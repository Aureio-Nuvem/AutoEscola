/**
 * Monta as sessões de estudo a partir do progresso real.
 *
 * A sessão do dia é estável dentro do mesmo dia: a semente do sorteio é a
 * data. Recarregar a página não embaralha o que você já estava fazendo.
 */
import {
  BLOCOS,
  MODULOS,
  QUESTOES_SIMULADO,
  QUESTOES_TREINO,
  bloco,
  type ModuloId,
  type Questao,
} from '../content'
import {
  dominada,
  emRecuperacao,
  hoje,
  maestria,
  vencida,
  type Progresso,
} from './progresso'

/** Gerador determinístico simples (mulberry32), para sorteio reproduzível. */
function sorteador(semente: number): () => number {
  let a = semente >>> 0
  return () => {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function semear(texto: string): number {
  let h = 2166136261
  for (let i = 0; i < texto.length; i += 1) {
    h ^= texto.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function embaralhar<T>(itens: T[], semente: number): T[] {
  const copia = [...itens]
  const sortear = sorteador(semente)
  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(sortear() * (i + 1))
    const a = copia[i]!
    copia[i] = copia[j]!
    copia[j] = a
  }
  return copia
}

/** Questões que já foram erradas e estão vencidas para revisão. */
export function paraRevisar(p: Progresso, dia = hoje()): Questao[] {
  return QUESTOES_TREINO.filter((q) => {
    const r = p.questoes[q.id]
    return emRecuperacao(r) && vencida(r, dia)
  }).sort((a, b) => {
    const ra = p.questoes[a.id]!
    const rb = p.questoes[b.id]!
    // Mais atrasadas primeiro; empate desempata por quem você mais errou.
    if (ra.revisarEm !== rb.revisarEm) return ra.revisarEm < rb.revisarEm ? -1 : 1
    return rb.erros - ra.erros
  })
}

/** Todas as questões erradas ainda não dominadas, vencidas ou não. */
export function emAberto(p: Progresso): Questao[] {
  return QUESTOES_TREINO.filter((q) => emRecuperacao(p.questoes[q.id]))
}

export function naoVistas(p: Progresso): Questao[] {
  return QUESTOES_TREINO.filter((q) => !p.questoes[q.id])
}

/**
 * Sessão do dia: primeiro o que está vencido para revisão, depois questões
 * novas do módulo em que você está mais atrás.
 */
export function montarSessaoDoDia(p: Progresso): string[] {
  const tamanho = p.ajustes.tamanhoSessao
  const dia = hoje()
  const escolhidas: string[] = []

  // Até metade da sessão para revisão — o resto precisa avançar em conteúdo
  // novo, senão você trava só revisando.
  const revisao = paraRevisar(p, dia).slice(0, Math.ceil(tamanho / 2))
  escolhidas.push(...revisao.map((q) => q.id))

  const faltam = tamanho - escolhidas.length
  if (faltam > 0) {
    const novas = naoVistas(p)
    // Módulo mais atrasado primeiro, para o progresso ficar parelho.
    const ordemModulos = [...MODULOS]
      .map((m) => ({
        id: m.id,
        fracao: maestria(
          QUESTOES_TREINO.filter((q) => q.modulo === m.id).map((q) => q.id),
          p.questoes,
        ).fracao,
      }))
      .sort((a, b) => a.fracao - b.fracao)
      .map((m) => m.id)

    const porModulo = new Map<ModuloId, Questao[]>()
    for (const q of novas) {
      const lista = porModulo.get(q.modulo)
      if (lista) lista.push(q)
      else porModulo.set(q.modulo, [q])
    }

    let volta = 0
    while (escolhidas.length < tamanho && volta < 200) {
      let acrescentou = false
      for (const id of ordemModulos) {
        if (escolhidas.length >= tamanho) break
        const fila = porModulo.get(id)
        if (!fila || fila.length === 0) continue
        const sorteadas = embaralhar(fila, semear(`${dia}:${id}`))
        const escolhida = sorteadas[volta % sorteadas.length]
        if (escolhida && !escolhidas.includes(escolhida.id)) {
          escolhidas.push(escolhida.id)
          acrescentou = true
        }
      }
      if (!acrescentou) break
      volta += 1
    }
  }

  // Ainda curto? completa com o que já foi visto e não dominado.
  if (escolhidas.length < tamanho) {
    const resto = QUESTOES_TREINO.filter(
      (q) => !escolhidas.includes(q.id) && !dominada(p.questoes[q.id]),
    )
    for (const q of embaralhar(resto, semear(dia))) {
      if (escolhidas.length >= tamanho) break
      escolhidas.push(q.id)
    }
  }

  return embaralhar(escolhidas, semear(`ordem:${dia}`))
}

/** Sessão só de erros, do mais atrasado para o menos. */
export function montarSessaoDeErros(p: Progresso, tamanho: number): string[] {
  const vencidas = paraRevisar(p).map((q) => q.id)
  if (vencidas.length >= tamanho) return vencidas.slice(0, tamanho)
  // Se não há vencidas suficientes, adianta as próximas em aberto.
  const restantes = emAberto(p)
    .filter((q) => !vencidas.includes(q.id))
    .sort((a, b) => {
      const ra = p.questoes[a.id]!
      const rb = p.questoes[b.id]!
      return ra.revisarEm < rb.revisarEm ? -1 : ra.revisarEm > rb.revisarEm ? 1 : 0
    })
    .map((q) => q.id)
  return [...vencidas, ...restantes].slice(0, tamanho)
}

/** Questões do banco que mostram uma placa e cobram o significado dela. */
export const QUESTOES_DE_PLACA = QUESTOES_TREINO.filter((q) => q.placa !== null)

/** Treino de reconhecimento de placas, priorizando o que você ainda não domina. */
export function montarSessaoDePlacas(p: Progresso, tamanho: number): string[] {
  const pendentes = QUESTOES_DE_PLACA.filter((q) => !dominada(p.questoes[q.id]))
  const fonte = pendentes.length >= tamanho ? pendentes : QUESTOES_DE_PLACA
  return embaralhar(fonte, semear(`placas:${hoje()}`))
    .slice(0, tamanho)
    .map((q) => q.id)
}

export function montarBloco(blocoId: string): string[] {
  return bloco(blocoId)?.questoes ?? []
}

/** Simulado: sorteia da parte 2, que nunca aparece no treino. */
export function montarSimulado(p: Progresso): string[] {
  const semente = semear(`simulado:${Date.now()}`)
  return embaralhar(QUESTOES_SIMULADO, semente)
    .slice(0, p.ajustes.questoesSimulado)
    .map((q) => q.id)
}

export interface Ritmo {
  diasRestantes: number
  naoVistas: number
  porDia: number
}

/**
 * Quantas questões por dia faltam para cobrir o material até a prova.
 * Devolve null enquanto a data da prova não foi informada — sem data, não há
 * número honesto para mostrar.
 */
export function ritmo(p: Progresso): Ritmo | null {
  const { dataProva } = p.ajustes
  if (!dataProva) return null
  const dias = Math.max(0, diasAte(dataProva))
  const faltam = naoVistas(p).length
  return {
    diasRestantes: dias,
    naoVistas: faltam,
    porDia: dias <= 0 ? faltam : Math.ceil(faltam / dias),
  }
}

function diasAte(data: string): number {
  const dia = hoje()
  const [a1, m1, d1] = dia.split('-').map(Number)
  const [a2, m2, d2] = data.split('-').map(Number)
  return Math.round((Date.UTC(a2!, m2! - 1, d2!) - Date.UTC(a1!, m1! - 1, d1!)) / 86_400_000)
}

export const TOTAL_BLOCOS = BLOCOS.length
