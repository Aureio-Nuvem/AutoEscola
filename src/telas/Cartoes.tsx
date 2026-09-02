import { useState } from 'react'
import { cartoesDoModulo, modulo as buscarModulo, type ModuloId } from '../content'
import type { Progresso } from '../app/progresso'
import { IconeCerto, IconeVoltar } from '../comps/Icones'

interface Props {
  id: ModuloId
  progresso: Progresso
  onVoltar: () => void
  onLido: (cartaoId: string) => void
}

/**
 * Leitura dos cartões, um por vez. Você pode parar no meio: o que já foi lido
 * fica marcado, e ao voltar a tela abre no primeiro cartão ainda não lido.
 */
export function Cartoes({ id, progresso, onVoltar, onLido }: Props) {
  const cartoes = cartoesDoModulo(id)
  const primeiroNaoLido = Math.max(
    0,
    cartoes.findIndex((c) => !progresso.cartoesLidos.includes(c.id)),
  )
  const [i, definir] = useState(primeiroNaoLido)
  const cartao = cartoes[i]

  if (!cartao) {
    return (
      <div className="pilha-g">
        <div className="topo">
          <button className="icone-botao" onClick={onVoltar} aria-label="Voltar">
            <IconeVoltar />
          </button>
          <h1>Cartões</h1>
        </div>
        <div className="vazio">
          <p className="forte">Este módulo ainda não tem cartões.</p>
          <p className="medio">
            O resumo é extraído do material didático de {buscarModulo(id).nome}.
          </p>
        </div>
      </div>
    )
  }

  const lido = progresso.cartoesLidos.includes(cartao.id)
  const ultimo = i === cartoes.length - 1

  return (
    <div className="pilha-g">
      <div>
        <div className="topo">
          <button className="icone-botao" onClick={onVoltar} aria-label="Voltar">
            <IconeVoltar />
          </button>
          <div className="espaco">
            <div className="forte">Estudar antes</div>
            <div className="miudo tabular">
              {i + 1} de {cartoes.length}
            </div>
          </div>
          {lido && (
            <span className="etiqueta verde">
              <IconeCerto />
              lido
            </span>
          )}
        </div>
        <div className="barra fina">
          <i style={{ width: `${((i + 1) / cartoes.length) * 100}%` }} />
        </div>
      </div>

      <div className="cartao pilha-g">
        <h2>{cartao.titulo}</h2>
        <div className="pilha">
          {cartao.paragrafos.map((p, n) => (
            <p key={n} style={{ whiteSpace: 'pre-line' }}>
              {p}
            </p>
          ))}
        </div>
        <p className="miudo">
          {cartao.fonte.documento} · seção “{cartao.fonte.secao}”
        </p>
      </div>

      <div className="linha">
        <button
          className="botao botao-suave"
          disabled={i === 0}
          onClick={() => definir((n) => n - 1)}
        >
          Anterior
        </button>
        <button
          className="botao espaco"
          onClick={() => {
            onLido(cartao.id)
            if (ultimo) onVoltar()
            else definir((n) => n + 1)
          }}
        >
          {ultimo ? 'Concluir leitura' : 'Próximo'}
        </button>
      </div>
    </div>
  )
}
