import { MODULOS, QUESTOES_TREINO, blocosDoModulo, cartoesDoModulo, type ModuloId } from '../content'
import { maestria, type Progresso } from '../app/progresso'

interface Props {
  progresso: Progresso
  onAbrir: (id: ModuloId) => void
}

export function Modulos({ progresso, onAbrir }: Props) {
  return (
    <div className="pilha-g">
      <div className="topo"><h1>Módulos</h1></div>
      <p className="medio">
        Os quatro módulos vêm do próprio material. Cada um é dividido em blocos do
        tamanho de uma sessão, com progresso próprio.
      </p>
      <div className="pilha">
        {MODULOS.map((m) => {
          const ids = QUESTOES_TREINO.filter((q) => q.modulo === m.id).map((q) => q.id)
          const mm = maestria(ids, progresso.questoes)
          const blocos = blocosDoModulo(m.id).length
          const cartoes = cartoesDoModulo(m.id).length
          return (
            <button key={m.id} className="cartao cartao-acao pilha" onClick={() => onAbrir(m.id)}>
              <div className="linha">
                <h2 className="espaco">
                  {m.id}. {m.nome}
                </h2>
                <span className="miudo tabular">{Math.round(mm.fracao * 100)}%</span>
              </div>
              <p className="medio">{m.resumo}</p>
              <div className="barra fina">
                <i style={{ width: `${mm.fracao * 100}%` }} />
              </div>
              <div className="linha miudo">
                <span>{blocos} blocos</span>
                <span>·</span>
                <span>{mm.total} questões</span>
                {cartoes > 0 && (
                  <>
                    <span>·</span>
                    <span>{cartoes} cartões</span>
                  </>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
