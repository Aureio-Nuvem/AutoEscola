/**
 * Progresso do estudo, guardado em localStorage.
 *
 * Duas decisões que sustentam o resto do app:
 *
 * 1. O progresso é guardado POR ITEM (id da questão), nunca por contador ou
 *    índice global. É isso que deixa você escolher por onde estudar sem
 *    perder o que já fez.
 *
 * 2. Errar não é só marcar um número: a questão entra num ciclo de repetição
 *    espaçada (Leitner) e volta em intervalos crescentes até você acertar
 *    várias vezes seguidas.
 */
import type { ModuloId } from '../content'

const CHAVE = 'baliza.progresso.v1'

/**
 * Intervalos da repetição espaçada, em dias, por caixa.
 * Caixa 0 volta no mesmo dia; a cada acerto sobe uma caixa e o intervalo
 * cresce. Errar derruba de volta para a caixa 0.
 */
export const INTERVALOS = [0, 1, 3, 7, 16, 35] as const

/** A partir desta caixa a questão conta como dominada. */
export const CAIXA_DOMINADA = 3

export interface RegistroQuestao {
  acertos: number
  erros: number
  caixa: number
  vistaEm: string
  revisarEm: string
}

export type TipoSessao = 'dia' | 'bloco' | 'erros' | 'simulado'

export interface SessaoSalva {
  tipo: TipoSessao
  /** Id do bloco, quando a sessão for de um bloco. */
  referencia: string | null
  questoes: string[]
  indice: number
  /** id da questão -> índice da alternativa escolhida. */
  respostas: Record<string, number>
  iniciadaEm: string
  /**
   * Preenchido quando a sessão chega ao fim. A sessão fica guardada até você
   * sair da tela de resultado, para o resumo sobreviver a um recarregamento.
   */
  finalizadaEm?: string
}

export interface ResultadoSimulado {
  em: string
  total: number
  acertos: number
  passou: boolean
  segundos: number
}

export interface Ajustes {
  /** Data da prova, no formato aaaa-mm-dd. Nulo enquanto você não informar. */
  dataProva: string | null
  tamanhoSessao: number
  questoesSimulado: number
  acertosParaPassar: number
  minutosSimulado: number
}

export interface Progresso {
  versao: 1
  questoes: Record<string, RegistroQuestao>
  cartoesLidos: string[]
  sessao: SessaoSalva | null
  ofensiva: { dias: number; ultimoDia: string | null }
  ajustes: Ajustes
  simulados: ResultadoSimulado[]
}

export const AJUSTES_PADRAO: Ajustes = {
  dataProva: null,
  tamanhoSessao: 12,
  // O material não define o formato da prova; estes são os valores usuais e
  // ficam editáveis em Ajustes justamente por isso.
  questoesSimulado: 30,
  acertosParaPassar: 21,
  minutosSimulado: 40,
}

export const PROGRESSO_VAZIO: Progresso = {
  versao: 1,
  questoes: {},
  cartoesLidos: [],
  sessao: null,
  ofensiva: { dias: 0, ultimoDia: null },
  ajustes: AJUSTES_PADRAO,
  simulados: [],
}

// ── Datas (sempre no fuso local) ──────────────────────────────────────────

export function hoje(): string {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

export function somarDias(data: string, dias: number): string {
  const [a, m, d] = data.split('-').map(Number)
  const base = new Date(a!, m! - 1, d! + dias)
  const mes = String(base.getMonth() + 1).padStart(2, '0')
  const dia = String(base.getDate()).padStart(2, '0')
  return `${base.getFullYear()}-${mes}-${dia}`
}

export function diasEntre(de: string, ate: string): number {
  const [a1, m1, d1] = de.split('-').map(Number)
  const [a2, m2, d2] = ate.split('-').map(Number)
  const ms = Date.UTC(a2!, m2! - 1, d2!) - Date.UTC(a1!, m1! - 1, d1!)
  return Math.round(ms / 86_400_000)
}

// ── Persistência ──────────────────────────────────────────────────────────

export function carregar(): Progresso {
  try {
    const cru = localStorage.getItem(CHAVE)
    if (!cru) return PROGRESSO_VAZIO
    const lido = JSON.parse(cru) as Partial<Progresso>
    if (lido.versao !== 1) return PROGRESSO_VAZIO
    return {
      ...PROGRESSO_VAZIO,
      ...lido,
      ajustes: { ...AJUSTES_PADRAO, ...lido.ajustes },
      questoes: lido.questoes ?? {},
      cartoesLidos: lido.cartoesLidos ?? [],
      simulados: lido.simulados ?? [],
      ofensiva: lido.ofensiva ?? { dias: 0, ultimoDia: null },
    }
  } catch {
    // Modo anônimo, armazenamento bloqueado ou dado corrompido: começa limpo
    // em vez de quebrar o app.
    return PROGRESSO_VAZIO
  }
}

export function salvar(p: Progresso): void {
  try {
    localStorage.setItem(CHAVE, JSON.stringify(p))
  } catch {
    // Sem espaço ou sem permissão: o estudo continua, só não persiste.
  }
}

// ── Repetição espaçada ────────────────────────────────────────────────────

/** Aplica uma resposta ao registro da questão e devolve o registro novo. */
export function registrar(
  anterior: RegistroQuestao | undefined,
  acertou: boolean,
): RegistroQuestao {
  const base = anterior ?? { acertos: 0, erros: 0, caixa: 0, vistaEm: '', revisarEm: '' }
  const caixa = acertou ? Math.min(base.caixa + 1, INTERVALOS.length - 1) : 0
  const dia = hoje()
  return {
    acertos: base.acertos + (acertou ? 1 : 0),
    erros: base.erros + (acertou ? 0 : 1),
    caixa,
    vistaEm: dia,
    revisarEm: somarDias(dia, INTERVALOS[caixa] ?? 0),
  }
}

export function dominada(r: RegistroQuestao | undefined): boolean {
  return (r?.caixa ?? 0) >= CAIXA_DOMINADA
}

/** Questão que você já errou alguma vez e ainda não dominou. */
export function emRecuperacao(r: RegistroQuestao | undefined): boolean {
  return !!r && r.erros > 0 && !dominada(r)
}

/** Está na hora de rever? */
export function vencida(r: RegistroQuestao | undefined, dia = hoje()): boolean {
  return !!r && r.revisarEm <= dia
}

// ── Ofensiva ──────────────────────────────────────────────────────────────

/** Atualiza a sequência de dias ao concluir uma sessão. */
export function marcarDiaEstudado(o: Progresso['ofensiva']): Progresso['ofensiva'] {
  const dia = hoje()
  if (o.ultimoDia === dia) return o
  const seguido = o.ultimoDia !== null && diasEntre(o.ultimoDia, dia) === 1
  return { dias: seguido ? o.dias + 1 : 1, ultimoDia: dia }
}

/** A ofensiva só vale hoje ou ontem; passou disso, zerou. */
export function ofensivaViva(o: Progresso['ofensiva']): number {
  if (!o.ultimoDia) return 0
  const passou = diasEntre(o.ultimoDia, hoje())
  return passou <= 1 ? o.dias : 0
}

// ── Métricas por recorte ──────────────────────────────────────────────────

export interface Maestria {
  total: number
  vistas: number
  dominadas: number
  /** 0 a 1. */
  fracao: number
}

export function maestria(ids: string[], registros: Progresso['questoes']): Maestria {
  let vistas = 0
  let dominadas = 0
  for (const id of ids) {
    const r = registros[id]
    if (r) vistas += 1
    if (dominada(r)) dominadas += 1
  }
  return {
    total: ids.length,
    vistas,
    dominadas,
    fracao: ids.length === 0 ? 0 : dominadas / ids.length,
  }
}

export type { ModuloId }
