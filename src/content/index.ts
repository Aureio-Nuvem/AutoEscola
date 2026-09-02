/**
 * Carrega o conteúdo gerado e deriva os recortes de estudo.
 *
 * Os arquivos `*.gerado.json` saem de `tools/extrair-*.py` a partir dos PDFs
 * em `fontes/`. Aqui eles só ganham tipo e são organizados; nada de conteúdo
 * é escrito neste arquivo.
 */
import questoesJson from './questoes.gerado.json'
import placasJson from './placas.gerado.json'
import type { Bloco, Cartao, Modulo, ModuloId, Placa, Questao } from './schema'
import { CARTOES } from './cartoes'

export * from './schema'

/** Quantas questões formam um bloco — o tamanho de uma sessão de estudo. */
export const TAMANHO_BLOCO = 20

/** Manifesto que cada extrator emite: a fonte e os itens tirados dela. */
interface Fonte<T> {
  documento: string
  arquivo: string
  paginas: number
  itens: T[]
}

const bancoQuestoes = questoesJson as Fonte<Questao>
const mosaicoPlacas = placasJson as Fonte<Placa>

/** As fontes, para o validador e a tela de créditos conferirem as citações. */
export const FONTES = [bancoQuestoes, mosaicoPlacas].map(({ documento, arquivo, paginas }) => ({
  documento,
  arquivo,
  paginas,
}))

export const QUESTOES = bancoQuestoes.itens
export const PLACAS = mosaicoPlacas.itens

/**
 * Os quatro módulos do material. Os nomes vêm dos títulos do próprio Banco
 * Nacional de Questões; os resumos descrevem o que as questões de cada um
 * cobrem.
 */
export const MODULOS: Modulo[] = [
  {
    id: 1,
    nome: 'Placas, Cores e Caminhos',
    resumo: 'Sinalização vertical, horizontal, semafórica, cicloviária e temporária.',
  },
  {
    id: 2,
    nome: 'Escolhas e Consequências',
    resumo: 'Infrações, penalidades, medidas administrativas e crimes de trânsito.',
  },
  {
    id: 3,
    nome: 'Na Direção da Segurança',
    resumo: 'Direção defensiva: preferências, condições adversas e convivência na via.',
  },
  {
    id: 4,
    nome: 'Cuidar, Agir e Preservar',
    resumo: 'Primeiros socorros, meio ambiente, cidadania e manutenção do veículo.',
  },
]

export const CARTOES_POR_MODULO = CARTOES

const porId = new Map(QUESTOES.map((q) => [q.id, q]))
const placaPorCodigo = new Map(PLACAS.map((p) => [p.codigo, p]))

export function questao(id: string): Questao | undefined {
  return porId.get(id)
}

export function placa(codigo: string | null): Placa | undefined {
  return codigo ? placaPorCodigo.get(codigo) : undefined
}

export function modulo(id: ModuloId): Modulo {
  const achado = MODULOS.find((m) => m.id === id)
  if (!achado) throw new Error(`Módulo desconhecido: ${id}`)
  return achado
}

/** Questões de treino: a parte 2 fica guardada só para o simulado. */
export const QUESTOES_TREINO = QUESTOES.filter((q) => q.parte === 1)

/** Questões que o simulado usa — nunca vistas no treino do dia a dia. */
export const QUESTOES_SIMULADO = QUESTOES.filter((q) => q.parte === 2)

/**
 * Divide cada módulo em blocos do tamanho de uma sessão, preservando a ordem
 * do material — que já agrupa assuntos próximos. Cada bloco mostra a faixa de
 * páginas que cobre, para conferência contra o PDF.
 */
function montarBlocos(): Bloco[] {
  const blocos: Bloco[] = []
  for (const m of MODULOS) {
    const doModulo = QUESTOES_TREINO.filter((q) => q.modulo === m.id)
    for (let i = 0; i < doModulo.length; i += TAMANHO_BLOCO) {
      const fatia = doModulo.slice(i, i + TAMANHO_BLOCO)
      const paginas = fatia.map((q) => q.origem.pagina)
      const indice = Math.floor(i / TAMANHO_BLOCO) + 1
      blocos.push({
        id: `m${m.id}b${indice}`,
        modulo: m.id,
        indice,
        nome: `Bloco ${indice}`,
        paginas: { de: Math.min(...paginas), ate: Math.max(...paginas) },
        questoes: fatia.map((q) => q.id),
      })
    }
  }
  return blocos
}

export const BLOCOS = montarBlocos()

export function blocosDoModulo(id: ModuloId): Bloco[] {
  return BLOCOS.filter((b) => b.modulo === id)
}

export function bloco(id: string): Bloco | undefined {
  return BLOCOS.find((b) => b.id === id)
}

export function cartoesDoModulo(id: ModuloId): Cartao[] {
  return CARTOES.filter((c) => c.modulo === id)
}

/** Placas agrupadas por categoria, para o modo de reconhecimento visual. */
/**
 * Nome curto do documento, para a citação caber inline. O nome completo fica
 * na tela de Ajustes, em Material.
 */
const APELIDOS: Record<string, string> = {
  [bancoQuestoes.documento]: 'Banco Nacional de Questões',
  [mosaicoPlacas.documento]: 'Mosaico de Placas',
}

/** "Banco Nacional de Questões, p. 82" */
export function citar(origem: { documento: string; pagina: number }): string {
  return `${APELIDOS[origem.documento] ?? origem.documento}, p. ${origem.pagina}`
}

export function placasPorCategoria(): { rotulo: string; placas: Placa[] }[] {
  const grupos = new Map<string, Placa[]>()
  for (const p of PLACAS) {
    const atual = grupos.get(p.categoriaRotulo)
    if (atual) atual.push(p)
    else grupos.set(p.categoriaRotulo, [p])
  }
  return [...grupos].map(([rotulo, placas]) => ({ rotulo, placas }))
}
