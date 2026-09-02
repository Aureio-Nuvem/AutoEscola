/**
 * Validador de conteúdo. Roda antes de todo build (`npm run build`).
 *
 * Ele reprova o build quando encontra:
 *   · questão sem matéria, sem explicação ou sem citação de origem
 *   · citação apontando para página que não existe no PDF de origem
 *   · alternativa duplicada dentro de uma questão
 *   · distrator que entrega a resposta (contém ou está contido na correta)
 *   · placa citada por questão que não tem imagem no disco
 *   · cartão de estudo sem texto ou sem citação
 *   · bloco que perde ou repete questão
 *
 * O que ele NÃO faz: julgar se a resposta é factualmente correta. Nenhum
 * script determinístico faz isso. O que dá para garantir é que toda questão
 * aponta para o trecho do material que a fundamenta — e isso ele garante.
 *
 * No fim imprime as medições que interessam, entre elas o viés de tamanho da
 * alternativa correta, que é forte neste banco.
 */
import { build } from 'esbuild'
import { existsSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const RAIZ = dirname(dirname(fileURLToPath(import.meta.url)))
const TEMP = join(RAIZ, 'node_modules', '.tmp', 'conteudo.mjs')

const erros = []
const avisos = []

const reprovar = (onde, motivo) => erros.push(`${onde}: ${motivo}`)

/** Compara textos ignorando acento, caixa e pontuação. */
const normalizar = (texto) =>
  texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

async function carregarConteudo() {
  await build({
    entryPoints: [join(RAIZ, 'src', 'content', 'index.ts')],
    outfile: TEMP,
    bundle: true,
    format: 'esm',
    platform: 'node',
    logLevel: 'silent',
  })
  return import(pathToFileURL(TEMP).href)
}

function validarQuestoes({ QUESTOES, FONTES, PLACAS }) {
  const paginasPorDoc = new Map(FONTES.map((f) => [f.documento, f.paginas]))
  const codigosDePlaca = new Set(PLACAS.map((p) => p.codigo))
  const vistos = new Set()

  for (const q of QUESTOES) {
    const onde = `questão ${q.id || '(sem id)'}`

    if (!q.id) reprovar(onde, 'sem id')
    else if (vistos.has(q.id)) reprovar(onde, 'id repetido')
    else vistos.add(q.id)

    if (![1, 2, 3, 4].includes(q.modulo)) reprovar(onde, `módulo inválido: ${q.modulo}`)
    if (![1, 2].includes(q.parte)) reprovar(onde, `parte inválida: ${q.parte}`)
    if (!['facil', 'media', 'dificil'].includes(q.dificuldade))
      reprovar(onde, `dificuldade inválida: ${q.dificuldade}`)

    if (!q.enunciado?.trim()) reprovar(onde, 'sem enunciado')
    if (!q.explicacao?.trim()) reprovar(onde, 'sem explicação')
    else if (q.explicacao.trim().length < 10) reprovar(onde, 'explicação curta demais')

    // Citação de origem
    if (!q.origem?.documento) reprovar(onde, 'sem documento de origem')
    else {
      const total = paginasPorDoc.get(q.origem.documento)
      if (total === undefined) reprovar(onde, `documento desconhecido: ${q.origem.documento}`)
      else if (!Number.isInteger(q.origem.pagina) || q.origem.pagina < 1 || q.origem.pagina > total)
        reprovar(onde, `página ${q.origem.pagina} fora do documento (1–${total})`)
    }

    // Alternativas
    if (!Array.isArray(q.alternativas) || q.alternativas.length !== 4) {
      reprovar(onde, `${q.alternativas?.length ?? 0} alternativas (esperado 4)`)
      continue
    }
    if (q.alternativas.some((a) => !a?.trim())) reprovar(onde, 'alternativa vazia')
    if (!Number.isInteger(q.correta) || q.correta < 0 || q.correta > 3) {
      reprovar(onde, `índice da correta inválido: ${q.correta}`)
      continue
    }

    const normais = q.alternativas.map(normalizar)
    if (new Set(normais).size !== 4) reprovar(onde, 'alternativa duplicada')

    // Distrator que entrega a resposta: contém a correta ou está contido nela.
    const correta = normais[q.correta]
    normais.forEach((alt, i) => {
      if (i === q.correta) return
      if (alt.length > 12 && correta.includes(alt)) reprovar(onde, `distrator ${i + 1} está contido na resposta correta`)
      if (correta.length > 12 && alt.includes(correta)) reprovar(onde, `distrator ${i + 1} contém a resposta correta`)
    })

    // Placa citada precisa existir e ter imagem no disco.
    if (q.placa) {
      if (!codigosDePlaca.has(q.placa)) reprovar(onde, `cita placa inexistente: ${q.placa}`)
      else if (!existsSync(join(RAIZ, 'public', 'placas', `${q.placa}.webp`)))
        reprovar(onde, `imagem da placa ${q.placa} não está em public/placas`)
    }
  }
}

function validarPlacas({ PLACAS, FONTES }) {
  const paginasPorDoc = new Map(FONTES.map((f) => [f.documento, f.paginas]))
  const vistos = new Set()

  for (const p of PLACAS) {
    const onde = `placa ${p.codigo || '(sem código)'}`
    if (!p.codigo) reprovar(onde, 'sem código')
    else if (vistos.has(p.codigo)) reprovar(onde, 'código repetido')
    else vistos.add(p.codigo)

    if (!p.nome?.trim()) reprovar(onde, 'sem nome')
    if (!['regulamentacao', 'advertencia', 'indicacao'].includes(p.categoria))
      reprovar(onde, `categoria inválida: ${p.categoria}`)

    if (!p.imagem?.startsWith('/placas/')) reprovar(onde, 'caminho de imagem inválido')
    else if (!existsSync(join(RAIZ, 'public', p.imagem.replace(/^\//, ''))))
      reprovar(onde, `imagem não encontrada: ${p.imagem}`)

    const total = paginasPorDoc.get(p.origem?.documento)
    if (total === undefined) reprovar(onde, 'sem documento de origem válido')
    else if (!Number.isInteger(p.origem.pagina) || p.origem.pagina < 1 || p.origem.pagina > total)
      reprovar(onde, `página ${p.origem?.pagina} fora do documento (1–${total})`)
  }
}

function validarCartoes({ CARTOES_POR_MODULO }) {
  const vistos = new Set()
  for (const c of CARTOES_POR_MODULO) {
    const onde = `cartão ${c.id || '(sem id)'}`
    if (!c.id) reprovar(onde, 'sem id')
    else if (vistos.has(c.id)) reprovar(onde, 'id repetido')
    else vistos.add(c.id)

    if (![1, 2, 3, 4].includes(c.modulo)) reprovar(onde, `módulo inválido: ${c.modulo}`)
    if (!c.titulo?.trim()) reprovar(onde, 'sem título')
    if (!Array.isArray(c.paragrafos) || c.paragrafos.length === 0)
      reprovar(onde, 'sem texto')
    else if (c.paragrafos.some((p) => !p?.trim())) reprovar(onde, 'parágrafo vazio')
    if (!c.fonte?.documento?.trim() || !c.fonte?.secao?.trim())
      reprovar(onde, 'sem citação de origem (documento e seção)')
  }
}

function validarBlocos({ BLOCOS, QUESTOES_TREINO }) {
  const emBloco = new Map()
  for (const b of BLOCOS) {
    const onde = `bloco ${b.id}`
    if (b.questoes.length === 0) reprovar(onde, 'sem questões')
    for (const id of b.questoes) {
      if (emBloco.has(id)) reprovar(onde, `questão ${id} também está em ${emBloco.get(id)}`)
      emBloco.set(id, b.id)
    }
  }
  for (const q of QUESTOES_TREINO) {
    if (!emBloco.has(q.id)) reprovar(`questão ${q.id}`, 'não está em nenhum bloco')
  }
}

function medir({ QUESTOES, BLOCOS, PLACAS, CARTOES_POR_MODULO }) {
  const posicoes = [0, 0, 0, 0]
  let maisLonga = 0
  let somaDiferenca = 0

  for (const q of QUESTOES) {
    posicoes[q.correta] += 1
    const correta = q.alternativas[q.correta]
    const outras = q.alternativas.filter((_, i) => i !== q.correta)
    if (correta.length > Math.max(...outras.map((a) => a.length))) maisLonga += 1
    somaDiferenca += correta.length - outras.reduce((s, a) => s + a.length, 0) / outras.length
  }

  const pct = Math.round((100 * maisLonga) / QUESTOES.length)
  const desvio = Math.round(somaDiferenca / QUESTOES.length)

  console.log(`\n  ${QUESTOES.length} questões · ${BLOCOS.length} blocos · ${PLACAS.length} placas · ${CARTOES_POR_MODULO.length} cartões`)
  console.log(`  posição da resposta certa: ${posicoes.join(' / ')}`)
  console.log(`  resposta certa é a mais longa em ${maisLonga} questões (${pct}%), +${desvio} caracteres em média`)

  if (pct >= 60) {
    avisos.push(
      `viés de tamanho no material: a resposta certa é a mais longa em ${pct}% das questões. ` +
        'Isso vem da fonte e não dá para corrigir sem reescrever conteúdo — ' +
        'estude pelo conteúdo, não pelo tamanho da alternativa.',
    )
  }
}

const conteudo = await carregarConteudo()

validarQuestoes(conteudo)
validarPlacas(conteudo)
validarCartoes(conteudo)
validarBlocos(conteudo)
medir(conteudo)

rmSync(TEMP, { force: true })

if (avisos.length) {
  console.log('')
  for (const a of avisos) console.log(`  aviso: ${a}`)
}

if (erros.length) {
  console.error(`\n✗ ${erros.length} problema(s) no conteúdo:\n`)
  for (const e of erros.slice(0, 40)) console.error(`  · ${e}`)
  if (erros.length > 40) console.error(`  … e mais ${erros.length - 40}`)
  console.error('')
  process.exit(1)
}

console.log('\n✓ conteúdo validado\n')
