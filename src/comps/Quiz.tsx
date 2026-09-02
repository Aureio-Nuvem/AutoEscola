import { useEffect, useMemo, useRef } from 'react'
import { citar, placa, questao } from '../content'
import { IconeCerto, IconeErrado, IconeVoltar } from './Icones'

export interface QuizProps {
  titulo: string
  ids: string[]
  indice: number
  /** id da questão -> índice escolhido. */
  respostas: Record<string, number>
  onResponder: (id: string, escolha: number) => void
  onAvancar: () => void
  onSair: () => void
  /**
   * No simulado o gabarito só aparece no fim, como na prova de verdade.
   */
  feedbackImediato: boolean
  /** Cabeçalho extra à direita do título (usado pelo cronômetro). */
  extra?: React.ReactNode
}

const LETRAS = ['A', 'B', 'C', 'D']

export function Quiz(props: QuizProps) {
  const { ids, indice, respostas, feedbackImediato } = props
  const id = ids[indice]
  const q = id ? questao(id) : undefined
  const topo = useRef<HTMLDivElement>(null)

  useEffect(() => {
    topo.current?.scrollIntoView({ block: 'start' })
  }, [indice])

  const imagem = useMemo(() => placa(q?.placa ?? null), [q])

  if (!q || !id) {
    return (
      <div className="vazio">
        <p>Nada para mostrar aqui.</p>
        <button className="botao botao-suave" onClick={props.onSair}>Voltar</button>
      </div>
    )
  }

  const escolha = respostas[id]
  const respondida = escolha !== undefined
  const revelar = respondida && feedbackImediato
  const acertou = escolha === q.correta
  const ultima = indice === ids.length - 1

  return (
    <div className="pilha-g" ref={topo}>
      <div>
        <div className="topo">
          <button className="icone-botao" onClick={props.onSair} aria-label="Sair da sessão">
            <IconeVoltar />
          </button>
          <div className="espaco">
            <div className="forte">{props.titulo}</div>
            <div className="miudo tabular">
              {indice + 1} de {ids.length}
            </div>
          </div>
          {props.extra}
        </div>
        <div className="barra fina">
          <i style={{ width: `${((indice + (respondida ? 1 : 0)) / ids.length) * 100}%` }} />
        </div>
      </div>

      <div className="pilha">
        {imagem && (
          <figure className="placa-figura" style={{ margin: 0 }}>
            <img src={imagem.imagem} alt={`Placa ${imagem.codigo}`} width={148} />
          </figure>
        )}
        <h2 className="enunciado">{q.enunciado}</h2>
      </div>

      <div className="pilha">
        {q.alternativas.map((texto, i) => {
          const escolhida = escolha === i
          const correta = i === q.correta
          let classe = 'alternativa'
          if (revelar && correta) classe += ' certa'
          else if (revelar && escolhida) classe += ' errada'
          else if (revelar) classe += ' apagada'
          else if (respondida && escolhida) classe += ' certa'

          return (
            <button
              key={i}
              className={classe}
              disabled={respondida}
              onClick={() => props.onResponder(id, i)}
            >
              <span className="marca">
                {revelar && correta ? (
                  <IconeCerto />
                ) : revelar && escolhida ? (
                  <IconeErrado />
                ) : (
                  LETRAS[i]
                )}
              </span>
              <span>{texto}</span>
            </button>
          )
        })}
      </div>

      {revelar && (
        <div className="cartao pilha">
          <div className="linha">
            <span className={`etiqueta ${acertou ? 'verde' : 'vermelha'}`}>
              {acertou ? 'Acertou' : 'Errou'}
            </span>
            {!acertou && (
              <span className="miudo">Esta questão volta para você em breve.</span>
            )}
          </div>
          <div className="explicacao">
            <p className="medio">{q.explicacao}</p>
            <p className="miudo">
              {citar(q.origem)}
              {imagem ? ` · placa ${imagem.codigo} — ${imagem.nome}` : ''}
            </p>
          </div>
        </div>
      )}

      <div className="rodape-quiz">
        <button
          className="botao botao-largo"
          disabled={!respondida}
          onClick={props.onAvancar}
        >
          {ultima ? 'Concluir' : 'Continuar'}
        </button>
      </div>
    </div>
  )
}
