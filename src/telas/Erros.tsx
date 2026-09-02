import { INTERVALOS, diasEntre, hoje, type Progresso } from '../app/progresso'
import { emAberto, paraRevisar } from '../app/sessao'
import { modulo } from '../content'

interface Props {
  progresso: Progresso
  onPraticar: (quantidade: number) => void
}

export function Erros({ progresso, onPraticar }: Props) {
  const vencidas = paraRevisar(progresso)
  const todas = emAberto(progresso)
  const adiante = todas.filter((q) => !vencidas.some((v) => v.id === q.id))
  const lote = Math.min(vencidas.length || todas.length, progresso.ajustes.tamanhoSessao)

  if (todas.length === 0) {
    return (
      <div className="pilha-g">
        <div className="topo"><h1>Meus erros</h1></div>
        <div className="vazio">
          <p className="forte">Nenhum erro em recuperação.</p>
          <p className="medio">
            Toda questão que você errar entra aqui e volta em intervalos crescentes:
            no mesmo dia, depois em {INTERVALOS.slice(1).join(', ')} dias.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="pilha-g">
      <div className="topo"><h1>Meus erros</h1></div>

      <div className="cartao pilha">
        <div className="linha">
          <div className="espaco">
            <div className="forte">
              {vencidas.length > 0
                ? `${vencidas.length} para revisar hoje`
                : 'Nada vencido por hoje'}
            </div>
            <div className="miudo">
              {todas.length} questões em recuperação no total
            </div>
          </div>
        </div>
        <button className="botao botao-largo" onClick={() => onPraticar(lote)}>
          {vencidas.length > 0
            ? `Revisar ${lote} agora`
            : `Adiantar ${lote} revisões`}
        </button>
        {vencidas.length === 0 && (
          <p className="miudo">
            Você está em dia. Adiantar funciona, mas o intervalo maior é justamente
            o que fixa a memória.
          </p>
        )}
      </div>

      {vencidas.length > 0 && (
        <div>
          <div className="secao-titulo"><h2>Vencidas</h2></div>
          <div className="pilha">
            {vencidas.slice(0, 30).map((q) => {
              const r = progresso.questoes[q.id]!
              const atraso = diasEntre(r.revisarEm, hoje())
              return (
                <div key={q.id} className="cartao pilha">
                  <p className="medio">{q.enunciado}</p>
                  <div className="linha">
                    <span className="etiqueta">{modulo(q.modulo).nome}</span>
                    <span className="etiqueta vermelha">
                      {r.erros} {r.erros === 1 ? 'erro' : 'erros'}
                    </span>
                    <span className="miudo espaco" style={{ textAlign: 'right' }}>
                      {atraso === 0 ? 'para hoje' : `${atraso} ${atraso === 1 ? 'dia' : 'dias'} de atraso`}
                    </span>
                  </div>
                </div>
              )
            })}
            {vencidas.length > 30 && (
              <p className="miudo">e mais {vencidas.length - 30}…</p>
            )}
          </div>
        </div>
      )}

      {adiante.length > 0 && (
        <div>
          <div className="secao-titulo">
            <h2>Agendadas</h2>
            <span className="miudo">{adiante.length}</span>
          </div>
          <div className="pilha">
            {adiante.slice(0, 12).map((q) => {
              const r = progresso.questoes[q.id]!
              const faltam = diasEntre(hoje(), r.revisarEm)
              return (
                <div key={q.id} className="cartao">
                  <p className="medio">{q.enunciado}</p>
                  <p className="miudo" style={{ marginTop: 8 }}>
                    volta em {faltam} {faltam === 1 ? 'dia' : 'dias'} · caixa {r.caixa} de{' '}
                    {INTERVALOS.length - 1}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
