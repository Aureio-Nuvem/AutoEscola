import type { Rota } from '../App'
import { MODULOS, QUESTOES_TREINO } from '../content'
import { maestria, ofensivaViva, type Progresso } from '../app/progresso'
import { emAberto, naoVistas, paraRevisar, ritmo } from '../app/sessao'
import { IconeChama, IconeRelogio } from '../comps/Icones'

interface Props {
  progresso: Progresso
  onSessaoDoDia: () => void
  onSimulado: () => void
  onIrPara: (r: Rota) => void
}

export function Inicio({ progresso, onSessaoDoDia, onSimulado, onIrPara }: Props) {
  const dias = ofensivaViva(progresso.ofensiva)
  const vencidas = paraRevisar(progresso).length
  const abertos = emAberto(progresso).length
  const restantes = naoVistas(progresso).length
  const geral = maestria(QUESTOES_TREINO.map((q) => q.id), progresso.questoes)
  const conta = ritmo(progresso)
  const ultimo = progresso.simulados.at(-1)

  return (
    <div className="pilha-g">
      <div className="topo">
        <h1>Baliza</h1>
        {dias > 0 && (
          <span className="etiqueta laranja">
            <IconeChama />
            {dias} {dias === 1 ? 'dia' : 'dias'}
          </span>
        )}
      </div>

      {/* Progresso geral — lê o que você realmente dominou. */}
      <div className="cartao pilha">
        <div className="secao-titulo">
          <h2>Seu progresso</h2>
          <span className="miudo tabular">
            {geral.dominadas} de {geral.total}
          </span>
        </div>
        <div className="barra">
          <i style={{ width: `${Math.max(geral.fracao * 100, geral.dominadas > 0 ? 2 : 0)}%` }} />
        </div>
        <p className="miudo">
          {geral.vistas === 0
            ? 'Você ainda não respondeu nenhuma questão.'
            : `${geral.vistas} questões vistas · ${restantes} ainda não vistas`}
        </p>
      </div>

      <div className="pilha">
        <button className="cartao cartao-acao pilha" onClick={onSessaoDoDia}>
          <div className="linha">
            <h2 className="espaco">Sessão do dia</h2>
            <span className="etiqueta laranja">{progresso.ajustes.tamanhoSessao} questões</span>
          </div>
          <p className="medio">
            {vencidas > 0
              ? `Inclui ${Math.min(vencidas, Math.ceil(progresso.ajustes.tamanhoSessao / 2))} questões que você errou e estão vencidas para revisão.`
              : 'Questões novas do módulo em que você está mais atrás.'}
          </p>
        </button>

        <button
          className="cartao cartao-acao pilha"
          onClick={() => onIrPara({ nome: 'erros' })}
          disabled={abertos === 0}
        >
          <div className="linha">
            <h2 className="espaco">Meus erros</h2>
            {abertos > 0 && (
              <span className={`etiqueta ${vencidas > 0 ? 'vermelha' : ''}`}>
                {vencidas > 0 ? `${vencidas} para hoje` : `${abertos} em aberto`}
              </span>
            )}
          </div>
          <p className="medio">
            {abertos === 0
              ? 'Nada aqui ainda. As questões que você errar voltam neste bloco.'
              : `${abertos} questões erradas em recuperação, com intervalos crescentes.`}
          </p>
        </button>

        <button className="cartao cartao-acao pilha" onClick={onSimulado}>
          <div className="linha">
            <h2 className="espaco">Simulado</h2>
            <span className="etiqueta">
              <IconeRelogio />
              {progresso.ajustes.minutosSimulado} min
            </span>
          </div>
          <p className="medio">
            {progresso.ajustes.questoesSimulado} questões cronometradas, de um conjunto que nunca
            aparece no treino. Aprovação com {progresso.ajustes.acertosParaPassar} acertos.
          </p>
          {ultimo && (
            <p className="miudo">
              Último: {ultimo.acertos}/{ultimo.total} — {ultimo.passou ? 'aprovado' : 'reprovado'}
            </p>
          )}
        </button>
      </div>

      {/* Só aparece quando há data da prova: sem data não existe número honesto. */}
      {conta && (
        <div className="cartao pilha">
          <div className="secao-titulo">
            <h2>Até a prova</h2>
            <span className="etiqueta laranja tabular">
              {conta.diasRestantes === 0
                ? 'é hoje'
                : `${conta.diasRestantes} ${conta.diasRestantes === 1 ? 'dia' : 'dias'}`}
            </span>
          </div>
          <p className="medio">
            {conta.naoVistas === 0
              ? 'Você já passou por todas as questões do treino ao menos uma vez.'
              : conta.diasRestantes === 0
                ? `Restam ${conta.naoVistas} questões que você nunca viu.`
                : `Faltam ${conta.naoVistas} questões nunca vistas — cerca de ${conta.porDia} por dia para cobrir tudo.`}
          </p>
        </div>
      )}

      <div>
        <div className="secao-titulo">
          <h2>Módulos</h2>
          <button className="botao-fantasma miudo" onClick={() => onIrPara({ nome: 'modulos' })}>
            ver todos
          </button>
        </div>
        <div className="pilha">
          {MODULOS.map((m) => {
            const ids = QUESTOES_TREINO.filter((q) => q.modulo === m.id).map((q) => q.id)
            const mm = maestria(ids, progresso.questoes)
            return (
              <button
                key={m.id}
                className="cartao cartao-acao pilha"
                onClick={() => onIrPara({ nome: 'modulo', id: m.id })}
              >
                <div className="linha">
                  <span className="forte espaco">
                    {m.id}. {m.nome}
                  </span>
                  <span className="miudo tabular">
                    {mm.dominadas}/{mm.total}
                  </span>
                </div>
                <div className="barra fina">
                  <i style={{ width: `${mm.fracao * 100}%` }} />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
