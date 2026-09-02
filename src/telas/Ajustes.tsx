import { useEffect, useState } from 'react'
import { FONTES, PLACAS, QUESTOES_SIMULADO, QUESTOES_TREINO } from '../content'
import type { Ajustes as AjustesTipo, Progresso } from '../app/progresso'

interface Props {
  progresso: Progresso
  onMudar: (a: AjustesTipo) => void
  onApagar: () => void
}

type Tema = 'sistema' | 'claro' | 'escuro'
const CHAVE_TEMA = 'baliza.tema'

function lerTema(): Tema {
  try {
    const t = localStorage.getItem(CHAVE_TEMA)
    return t === 'claro' || t === 'escuro' ? t : 'sistema'
  } catch {
    return 'sistema'
  }
}

export function Ajustes({ progresso, onMudar, onApagar }: Props) {
  const a = progresso.ajustes
  const [tema, definirTema] = useState<Tema>(lerTema)
  const [confirmar, pedirConfirmacao] = useState(false)

  useEffect(() => {
    const raiz = document.documentElement
    if (tema === 'sistema') raiz.removeAttribute('data-tema')
    else raiz.setAttribute('data-tema', tema)
    try {
      localStorage.setItem(CHAVE_TEMA, tema)
    } catch {
      /* sem persistência: o tema vale só nesta sessão */
    }
  }, [tema])

  const numero = (v: string, min: number, max: number, atual: number) => {
    const n = Number(v)
    return Number.isFinite(n) && n >= min && n <= max ? Math.round(n) : atual
  }

  return (
    <div className="pilha-g">
      <div className="topo"><h1>Ajustes</h1></div>

      <div className="cartao pilha-g">
        <h2>Prova</h2>
        <div className="campo">
          <label htmlFor="data">Data da prova</label>
          <input
            id="data"
            type="date"
            value={a.dataProva ?? ''}
            onChange={(e) => onMudar({ ...a, dataProva: e.target.value || null })}
          />
          <p className="miudo">
            Enquanto estiver em branco, a contagem regressiva não aparece na tela inicial.
          </p>
        </div>
        <div className="campo">
          <label htmlFor="tamanho">Questões por sessão do dia</label>
          <input
            id="tamanho"
            type="number"
            min={5}
            max={30}
            value={a.tamanhoSessao}
            onChange={(e) =>
              onMudar({ ...a, tamanhoSessao: numero(e.target.value, 5, 30, a.tamanhoSessao) })
            }
          />
        </div>
      </div>

      <div className="cartao pilha-g">
        <h2>Formato do simulado</h2>
        <p className="miudo">
          Nenhum PDF do material define o formato da prova. Estes são os valores usuais —
          ajuste quando souber os do seu Detran.
        </p>
        <div className="campo">
          <label htmlFor="qtd">Questões</label>
          <input
            id="qtd"
            type="number"
            min={5}
            max={QUESTOES_SIMULADO.length}
            value={a.questoesSimulado}
            onChange={(e) =>
              onMudar({
                ...a,
                questoesSimulado: numero(
                  e.target.value,
                  5,
                  QUESTOES_SIMULADO.length,
                  a.questoesSimulado,
                ),
              })
            }
          />
        </div>
        <div className="campo">
          <label htmlFor="corte">Acertos para aprovação</label>
          <input
            id="corte"
            type="number"
            min={1}
            max={a.questoesSimulado}
            value={a.acertosParaPassar}
            onChange={(e) =>
              onMudar({
                ...a,
                acertosParaPassar: numero(e.target.value, 1, a.questoesSimulado, a.acertosParaPassar),
              })
            }
          />
          <p className="miudo">
            {Math.round((a.acertosParaPassar / a.questoesSimulado) * 100)}% de aproveitamento
          </p>
        </div>
        <div className="campo">
          <label htmlFor="min">Minutos</label>
          <input
            id="min"
            type="number"
            min={5}
            max={180}
            value={a.minutosSimulado}
            onChange={(e) =>
              onMudar({ ...a, minutosSimulado: numero(e.target.value, 5, 180, a.minutosSimulado) })
            }
          />
        </div>
      </div>

      <div className="cartao pilha">
        <h2>Aparência</h2>
        <div className="linha">
          {(['sistema', 'claro', 'escuro'] as const).map((t) => (
            <button
              key={t}
              className={`botao ${tema === t ? '' : 'botao-suave'} espaco`}
              onClick={() => definirTema(t)}
            >
              {t[0]!.toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="cartao pilha">
        <h2>Material</h2>
        <p className="medio">
          {QUESTOES_TREINO.length} questões de treino · {QUESTOES_SIMULADO.length} reservadas para
          simulado · {PLACAS.length} placas
        </p>
        <div className="pilha">
          {FONTES.map((f) => (
            <p key={f.arquivo} className="miudo">
              {f.documento} — {f.paginas} páginas
            </p>
          ))}
        </div>
        <p className="miudo">
          Toda questão mostra o documento e a página de onde saiu, para você conferir contra
          o PDF original.
        </p>
      </div>

      <div className="cartao pilha">
        <h2>Apagar progresso</h2>
        <p className="medio">
          Zera respostas, ofensiva, cartões lidos e simulados. Não dá para desfazer.
        </p>
        {confirmar ? (
          <div className="linha">
            <button className="botao botao-suave espaco" onClick={() => pedirConfirmacao(false)}>
              Cancelar
            </button>
            <button
              className="botao espaco"
              style={{ background: 'var(--vermelho)' }}
              onClick={() => {
                pedirConfirmacao(false)
                onApagar()
              }}
            >
              Apagar mesmo
            </button>
          </div>
        ) : (
          <button className="botao botao-suave" onClick={() => pedirConfirmacao(true)}>
            Apagar tudo
          </button>
        )}
      </div>
    </div>
  )
}
