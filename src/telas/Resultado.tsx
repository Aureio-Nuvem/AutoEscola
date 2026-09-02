import { citar, modulo, questao } from '../content'
import type { Progresso, SessaoSalva } from '../app/progresso'
import { IconeCerto, IconeErrado } from '../comps/Icones'

interface Props {
  sessao: SessaoSalva
  acertos: number
  progresso: Progresso
  onFechar: () => void
}

const NOMES = {
  dia: 'Sessão do dia',
  bloco: 'Bloco concluído',
  erros: 'Revisão concluída',
  simulado: 'Simulado',
} as const

export function Resultado({ sessao, acertos, progresso, onFechar }: Props) {
  const total = sessao.questoes.length
  const respondidas = Object.keys(sessao.respostas).length
  const erradas = sessao.questoes.filter((id) => {
    const escolha = sessao.respostas[id]
    const q = questao(id)
    return q && escolha !== undefined && escolha !== q.correta
  })
  const simulado = sessao.tipo === 'simulado'
  const corte = progresso.ajustes.acertosParaPassar
  const passou = acertos >= corte
  const minutos = Math.round(
    (new Date(sessao.finalizadaEm ?? Date.now()).getTime() -
      new Date(sessao.iniciadaEm).getTime()) /
      60000,
  )

  return (
    <div className="pilha-g">
      <div className="topo"><h1>{NOMES[sessao.tipo]}</h1></div>

      <div className="cartao pilha-g">
        <div className="linha">
          <div className="espaco">
            <div style={{ fontSize: '2.2rem', fontWeight: 680, letterSpacing: '-0.03em' }}>
              <span className="tabular">{acertos}</span>
              <span style={{ color: 'var(--tinta-3)' }}>/{total}</span>
            </div>
            <p className="medio">
              {respondidas < total
                ? `${total - respondidas} questões ficaram sem resposta (tempo esgotado).`
                : `${Math.round((acertos / total) * 100)}% de acerto`}
            </p>
          </div>
          {simulado && (
            <span className={`etiqueta ${passou ? 'verde' : 'vermelha'}`}>
              {passou ? 'aprovado' : 'reprovado'}
            </span>
          )}
        </div>
        <div className={`barra${passou && simulado ? ' verde' : ''}`}>
          <i style={{ width: `${(acertos / total) * 100}%` }} />
        </div>
        {simulado && (
          <p className="miudo">
            Corte em {corte} acertos · {minutos} {minutos === 1 ? 'minuto' : 'minutos'}
          </p>
        )}
      </div>

      {simulado && (
        <p className="medio">
          O simulado usa questões reservadas, que não entram no treino nem na repetição
          espaçada. Revise abaixo o que errou.
        </p>
      )}

      {erradas.length > 0 && (
        <div>
          <div className="secao-titulo">
            <h2>O que você errou</h2>
            <span className="miudo">{erradas.length}</span>
          </div>
          <div className="pilha">
            {erradas.map((id) => {
              const q = questao(id)
              if (!q) return null
              const escolha = sessao.respostas[id]!
              return (
                <div key={id} className="cartao pilha">
                  <p className="medio forte">{q.enunciado}</p>
                  <div className="linha" style={{ alignItems: 'flex-start' }}>
                    <span className="etiqueta vermelha"><IconeErrado /></span>
                    <span className="medio">{q.alternativas[escolha]}</span>
                  </div>
                  <div className="linha" style={{ alignItems: 'flex-start' }}>
                    <span className="etiqueta verde"><IconeCerto /></span>
                    <span className="medio">{q.alternativas[q.correta]}</span>
                  </div>
                  <div className="explicacao">
                    <p className="medio">{q.explicacao}</p>
                    <p className="miudo">
                      {modulo(q.modulo).nome} · {citar(q.origem)}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {erradas.length === 0 && respondidas === total && (
        <div className="vazio">
          <p className="forte">Você acertou tudo.</p>
        </div>
      )}

      <button className="botao botao-largo" onClick={onFechar}>
        Voltar ao início
      </button>
    </div>
  )
}
