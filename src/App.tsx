import { useCallback, useEffect, useMemo, useState } from 'react'
import { QUESTOES, type ModuloId } from './content'
import {
  carregar,
  hoje,
  marcarDiaEstudado,
  registrar,
  salvar,
  PROGRESSO_VAZIO,
  type Ajustes as AjustesTipo,
  type Progresso,
  type ResultadoSimulado,
  type SessaoSalva,
  type TipoSessao,
} from './app/progresso'
import {
  QUESTOES_DE_PLACA,
  montarBloco,
  montarSessaoDeErros,
  montarSessaoDePlacas,
  montarSessaoDoDia,
  montarSimulado,
} from './app/sessao'
import { Quiz } from './comps/Quiz'
import {
  IconeAjustes,
  IconeErros,
  IconeHoje,
  IconeModulos,
  IconePlacas,
} from './comps/Icones'
import { Inicio } from './telas/Inicio'
import { Erros } from './telas/Erros'
import { Modulos } from './telas/Modulos'
import { Modulo } from './telas/Modulo'
import { Cartoes } from './telas/Cartoes'
import { Placas } from './telas/Placas'
import { Ajustes } from './telas/Ajustes'
import { Resultado } from './telas/Resultado'
import { Cronometro } from './comps/Cronometro'

export type Rota =
  | { nome: 'inicio' }
  | { nome: 'erros' }
  | { nome: 'modulos' }
  | { nome: 'modulo'; id: ModuloId }
  | { nome: 'cartoes'; id: ModuloId }
  | { nome: 'placas' }
  | { nome: 'ajustes' }

type Aba = Extract<Rota['nome'], 'inicio' | 'erros' | 'modulos' | 'placas' | 'ajustes'>

const ABAS: { aba: Aba; rotulo: string; Icone: (p: { className?: string }) => JSX.Element }[] = [
  { aba: 'inicio', rotulo: 'Hoje', Icone: IconeHoje },
  { aba: 'erros', rotulo: 'Erros', Icone: IconeErros },
  { aba: 'modulos', rotulo: 'Módulos', Icone: IconeModulos },
  { aba: 'placas', rotulo: 'Placas', Icone: IconePlacas },
  { aba: 'ajustes', rotulo: 'Ajustes', Icone: IconeAjustes },
]

const TITULOS: Record<TipoSessao, string> = {
  dia: 'Sessão do dia',
  bloco: 'Bloco',
  erros: 'Meus erros',
  placas: 'Placas',
  simulado: 'Simulado',
}

const GABARITO = new Map(QUESTOES.map((q) => [q.id, q.correta]))

function acertosNa(s: SessaoSalva): number {
  let total = 0
  for (const [id, escolha] of Object.entries(s.respostas)) {
    if (GABARITO.get(id) === escolha) total += 1
  }
  return total
}

function resumirSimulado(s: SessaoSalva, ajustes: AjustesTipo): ResultadoSimulado {
  const acertos = acertosNa(s)
  const fim = s.finalizadaEm ? new Date(s.finalizadaEm) : new Date()
  return {
    em: hoje(),
    total: s.questoes.length,
    acertos,
    passou: acertos >= ajustes.acertosParaPassar,
    segundos: Math.round((fim.getTime() - new Date(s.iniciadaEm).getTime()) / 1000),
  }
}

export function App() {
  const [progresso, definir] = useState<Progresso>(() => carregar())
  const [rota, irPara] = useState<Rota>({ nome: 'inicio' })

  useEffect(() => {
    salvar(progresso)
  }, [progresso])

  const iniciar = useCallback(
    (tipo: TipoSessao, ids: string[], referencia: string | null = null) => {
      if (ids.length === 0) return
      definir((p) => ({
        ...p,
        sessao: {
          tipo,
          referencia,
          questoes: ids,
          indice: 0,
          respostas: {},
          iniciadaEm: new Date().toISOString(),
        },
      }))
    },
    [],
  )

  const responder = useCallback((id: string, escolha: number) => {
    definir((p) => {
      const s = p.sessao
      if (!s || s.respostas[id] !== undefined) return p
      const sessao = { ...s, respostas: { ...s.respostas, [id]: escolha } }

      // O simulado não alimenta a repetição espaçada: a parte 2 do banco fica
      // reservada para medir conhecimento, não para treinar.
      if (s.tipo === 'simulado') return { ...p, sessao }

      const acertou = GABARITO.get(id) === escolha
      return { ...p, sessao, questoes: { ...p.questoes, [id]: registrar(p.questoes[id], acertou) } }
    })
  }, [])

  /** Encerra a sessão atual, guardando o resumo quando for simulado. */
  const encerrar = useCallback((p: Progresso): Progresso => {
    const s = p.sessao
    if (!s || s.finalizadaEm) return p
    const finalizada: SessaoSalva = {
      ...s,
      indice: s.questoes.length,
      finalizadaEm: new Date().toISOString(),
    }
    const base = { ...p, sessao: finalizada, ofensiva: marcarDiaEstudado(p.ofensiva) }
    if (s.tipo !== 'simulado') return base
    return { ...base, simulados: [...p.simulados, resumirSimulado(finalizada, p.ajustes)] }
  }, [])

  const avancar = useCallback(() => {
    definir((p) => {
      const s = p.sessao
      if (!s) return p
      const proximo = s.indice + 1
      if (proximo < s.questoes.length) return { ...p, sessao: { ...s, indice: proximo } }
      return encerrar(p)
    })
  }, [encerrar])

  const esgotarTempo = useCallback(() => definir(encerrar), [encerrar])

  const sair = useCallback(() => definir((p) => ({ ...p, sessao: null })), [])

  const abrirAjustes = useCallback((ajustes: AjustesTipo) => {
    definir((p) => ({ ...p, ajustes }))
  }, [])

  const apagarTudo = useCallback(() => {
    try {
      localStorage.removeItem('baliza.progresso.v1')
    } catch {
      /* sem permissão de escrita: o estado em memória zera do mesmo jeito */
    }
    definir(PROGRESSO_VAZIO)
    irPara({ nome: 'inicio' })
  }, [])

  const sessao = progresso.sessao

  const conteudo = useMemo(() => {
    switch (rota.nome) {
      case 'inicio':
        return (
          <Inicio
            progresso={progresso}
            onSessaoDoDia={() => iniciar('dia', montarSessaoDoDia(progresso))}
            onSimulado={() => iniciar('simulado', montarSimulado(progresso))}
            onIrPara={irPara}
          />
        )
      case 'erros':
        return (
          <Erros
            progresso={progresso}
            onPraticar={(n) => iniciar('erros', montarSessaoDeErros(progresso, n))}
          />
        )
      case 'modulos':
        return <Modulos progresso={progresso} onAbrir={(id) => irPara({ nome: 'modulo', id })} />
      case 'modulo':
        return (
          <Modulo
            id={rota.id}
            progresso={progresso}
            onVoltar={() => irPara({ nome: 'modulos' })}
            onCartoes={() => irPara({ nome: 'cartoes', id: rota.id })}
            onBloco={(blocoId) => iniciar('bloco', montarBloco(blocoId), blocoId)}
          />
        )
      case 'cartoes':
        return (
          <Cartoes
            id={rota.id}
            progresso={progresso}
            onVoltar={() => irPara({ nome: 'modulo', id: rota.id })}
            onLido={(cartaoId) =>
              definir((p) =>
                p.cartoesLidos.includes(cartaoId)
                  ? p
                  : { ...p, cartoesLidos: [...p.cartoesLidos, cartaoId] },
              )
            }
          />
        )
      case 'placas':
        return (
          <Placas
            totalQuestoes={QUESTOES_DE_PLACA.length}
            onTreinar={() =>
              iniciar('placas', montarSessaoDePlacas(progresso, progresso.ajustes.tamanhoSessao))
            }
          />
        )
      case 'ajustes':
        return <Ajustes progresso={progresso} onMudar={abrirAjustes} onApagar={apagarTudo} />
    }
  }, [rota, progresso, iniciar, abrirAjustes, apagarTudo])

  if (sessao?.finalizadaEm) {
    return (
      <div className="app">
        <Resultado sessao={sessao} acertos={acertosNa(sessao)} progresso={progresso} onFechar={sair} />
      </div>
    )
  }

  if (sessao) {
    return (
      <div className="app">
        <Quiz
          titulo={TITULOS[sessao.tipo]}
          ids={sessao.questoes}
          indice={sessao.indice}
          respostas={sessao.respostas}
          onResponder={responder}
          onAvancar={avancar}
          onSair={sair}
          feedbackImediato={sessao.tipo !== 'simulado'}
          {...(sessao.tipo === 'simulado'
            ? {
                extra: (
                  <Cronometro
                    inicio={sessao.iniciadaEm}
                    minutos={progresso.ajustes.minutosSimulado}
                    onEsgotar={esgotarTempo}
                  />
                ),
              }
            : {})}
        />
      </div>
    )
  }

  return (
    <div className="app">
      {conteudo}
      <nav className="nav">
        {ABAS.map(({ aba, rotulo, Icone }) => (
          <button
            key={aba}
            className={rota.nome === aba ? 'ativo' : ''}
            onClick={() => irPara({ nome: aba })}
          >
            <Icone />
            {rotulo}
          </button>
        ))}
      </nav>
    </div>
  )
}
