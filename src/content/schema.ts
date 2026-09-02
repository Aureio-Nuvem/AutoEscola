/**
 * Tipos do conteúdo. Todo o material de estudo é DADO, tipado aqui e gerado a
 * partir dos PDFs em `fontes/` pelos scripts de `tools/`.
 *
 * Nenhum componente conhece pergunta, placa ou matéria nenhuma: para somar
 * conteúdo, edita-se dado, nunca componente.
 */

/** Os quatro módulos vêm do próprio material (CNH do Brasil / SENATRAN). */
export type ModuloId = 1 | 2 | 3 | 4

/** Parte 1 é o banco de treino; parte 2 fica reservada para o simulado. */
export type Parte = 1 | 2

export type Dificuldade = 'facil' | 'media' | 'dificil'

export type CategoriaPlaca = 'regulamentacao' | 'advertencia' | 'indicacao'

/** De onde a informação saiu, para conferência contra o material. */
export interface Origem {
  documento: string
  pagina: number
}

export interface Questao {
  id: string
  modulo: ModuloId
  parte: Parte
  dificuldade: Dificuldade
  enunciado: string
  /** Sempre 4, já embaralhadas de forma estável na geração. */
  alternativas: string[]
  /** Índice da correta dentro de `alternativas`. */
  correta: number
  explicacao: string
  /** Código da placa citada, quando a questão depende da imagem dela. */
  placa: string | null
  origem: Origem
}

export interface Placa {
  codigo: string
  nome: string
  descricao: string
  categoria: CategoriaPlaca
  categoriaRotulo: string
  /** Caminho público da imagem, ex.: `/placas/R-1.webp`. */
  imagem: string
  origem: Origem
}

export interface Modulo {
  id: ModuloId
  nome: string
  /** Uma linha sobre o que o módulo cobre, tirada do material. */
  resumo: string
}

/**
 * Recorte de estudo dentro de um módulo. Conteúdo grande se estuda em blocos:
 * cada um tem tamanho de uma sessão e maestria própria.
 */
export interface Bloco {
  id: string
  modulo: ModuloId
  indice: number
  nome: string
  /** Faixa de páginas do material que o bloco cobre. */
  paginas: { de: number; ate: number }
  questoes: string[]
}

/**
 * Cartão de resumo, lido antes de praticar.
 *
 * A citação aponta a seção do material, não a página: o texto dos módulos é
 * corrido e o título da seção é o que se acha por busca no PDF.
 */
export interface Cartao {
  id: string
  modulo: ModuloId
  titulo: string
  paragrafos: string[]
  fonte: { documento: string; secao: string }
}
