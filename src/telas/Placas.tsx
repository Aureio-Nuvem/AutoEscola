import { useMemo, useState } from 'react'
import { PLACAS, citar, placasPorCategoria, type Placa } from '../content'
import { IconeVoltar } from '../comps/Icones'

interface Props {
  /** Quantas questões do banco tratam de placas — usado no botão de treino. */
  totalQuestoes: number
  onTreinar: () => void
}

export function Placas({ totalQuestoes, onTreinar }: Props) {
  const grupos = useMemo(() => placasPorCategoria(), [])
  const [busca, definirBusca] = useState('')
  const [aberta, abrir] = useState<Placa | null>(null)

  const filtro = busca.trim().toLowerCase()
  const filtrados = useMemo(() => {
    if (!filtro) return grupos
    return grupos
      .map((g) => ({
        ...g,
        placas: g.placas.filter(
          (p) =>
            p.nome.toLowerCase().includes(filtro) ||
            p.codigo.toLowerCase().includes(filtro),
        ),
      }))
      .filter((g) => g.placas.length > 0)
  }, [grupos, filtro])

  if (aberta) {
    return (
      <div className="pilha-g">
        <div className="topo">
          <button className="icone-botao" onClick={() => abrir(null)} aria-label="Voltar">
            <IconeVoltar />
          </button>
          <h1>{aberta.codigo}</h1>
        </div>
        <figure className="placa-figura" style={{ margin: 0, padding: 28 }}>
          <img src={aberta.imagem} alt={`Placa ${aberta.codigo}`} width={200} />
        </figure>
        <div className="cartao pilha">
          <h2>{aberta.nome}</h2>
          <span className="etiqueta">{aberta.categoriaRotulo}</span>
          {aberta.descricao && <p className="medio">{aberta.descricao}</p>}
          <p className="miudo">
            {citar(aberta.origem)}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="pilha-g">
      <div className="topo"><h1>Placas</h1></div>

      <button className="cartao cartao-acao pilha" onClick={onTreinar}>
        <div className="linha">
          <h2 className="espaco">Treinar reconhecimento</h2>
          <span className="etiqueta laranja">{totalQuestoes} questões</span>
        </div>
        <p className="medio">
          As questões do banco que mostram a placa e cobram o significado. Entram na
          repetição espaçada como qualquer outra.
        </p>
      </button>

      <div className="campo">
        <input
          type="search"
          placeholder={`Buscar entre ${PLACAS.length} placas`}
          value={busca}
          onChange={(e) => definirBusca(e.target.value)}
        />
      </div>

      {filtrados.length === 0 && (
        <div className="vazio">
          <p className="medio">Nenhuma placa encontrada para “{busca}”.</p>
        </div>
      )}

      {filtrados.map((g) => (
        <div key={g.rotulo}>
          <div className="secao-titulo">
            <h2>{g.rotulo}</h2>
            <span className="miudo">{g.placas.length}</span>
          </div>
          <div className="grade-placas">
            {g.placas.map((p) => (
              <button key={p.codigo} className="placa-item" onClick={() => abrir(p)}>
                <span className="moldura">
                  <img src={p.imagem} alt="" loading="lazy" />
                </span>
                <span className="miudo forte">{p.codigo}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
