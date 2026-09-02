import { blocosDoModulo, cartoesDoModulo, modulo as buscarModulo, type ModuloId } from '../content'
import { maestria, type Progresso } from '../app/progresso'
import { IconeLivro, IconeVoltar } from '../comps/Icones'

interface Props {
  id: ModuloId
  progresso: Progresso
  onVoltar: () => void
  onCartoes: () => void
  onBloco: (blocoId: string) => void
}

export function Modulo({ id, progresso, onVoltar, onCartoes, onBloco }: Props) {
  const m = buscarModulo(id)
  const blocos = blocosDoModulo(id)
  const cartoes = cartoesDoModulo(id)
  const lidos = cartoes.filter((c) => progresso.cartoesLidos.includes(c.id)).length

  return (
    <div className="pilha-g">
      <div className="topo">
        <button className="icone-botao" onClick={onVoltar} aria-label="Voltar">
          <IconeVoltar />
        </button>
        <h1>{m.nome}</h1>
      </div>

      <p className="medio">{m.resumo}</p>

      {cartoes.length > 0 && (
        <button className="cartao cartao-acao pilha" onClick={onCartoes}>
          <div className="linha">
            <span className="etiqueta laranja">
              <IconeLivro />
              Estudar antes
            </span>
            <span className="espaco" />
            <span className="miudo tabular">
              {lidos}/{cartoes.length}
            </span>
          </div>
          <p className="medio">
            {lidos === 0
              ? `${cartoes.length} cartões de resumo do material, para ler antes de praticar.`
              : lidos === cartoes.length
                ? 'Você leu todos os cartões deste módulo.'
                : `Faltam ${cartoes.length - lidos} cartões para você ler.`}
          </p>
        </button>
      )}

      <div>
        <div className="secao-titulo">
          <h2>Blocos</h2>
          <span className="miudo">{blocos.length} blocos · ~20 questões cada</span>
        </div>
        <div className="pilha">
          {blocos.map((b) => {
            const mm = maestria(b.questoes, progresso.questoes)
            const completo = mm.dominadas === mm.total
            return (
              <button key={b.id} className="cartao cartao-acao pilha" onClick={() => onBloco(b.id)}>
                <div className="linha">
                  <span className="forte espaco">{b.nome}</span>
                  {completo ? (
                    <span className="etiqueta verde">dominado</span>
                  ) : (
                    <span className="miudo tabular">
                      {mm.dominadas}/{mm.total}
                    </span>
                  )}
                </div>
                <div className={`barra fina${completo ? ' verde' : ''}`}>
                  <i style={{ width: `${mm.fracao * 100}%` }} />
                </div>
                <p className="miudo">
                  material p. {b.paginas.de}
                  {b.paginas.ate !== b.paginas.de ? `–${b.paginas.ate}` : ''}
                  {mm.vistas > 0 && mm.vistas < mm.total ? ` · ${mm.vistas} vistas` : ''}
                </p>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
