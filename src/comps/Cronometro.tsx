import { useEffect, useState } from 'react'
import { IconeRelogio } from './Icones'

interface Props {
  /** ISO de quando a sessão começou. */
  inicio: string
  minutos: number
  onEsgotar: () => void
}

/** Cronômetro regressivo do simulado. Sobrevive a recarregar a página porque
 *  conta a partir do horário de início guardado na sessão. */
export function Cronometro({ inicio, minutos, onEsgotar }: Props) {
  const total = minutos * 60
  const restante = () =>
    Math.max(0, total - Math.floor((Date.now() - new Date(inicio).getTime()) / 1000))
  const [segundos, definir] = useState(restante)

  useEffect(() => {
    const id = setInterval(() => {
      const agora = restante()
      definir(agora)
      if (agora <= 0) onEsgotar()
    }, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inicio, total])

  const m = Math.floor(segundos / 60)
  const s = segundos % 60
  return (
    <span className={`etiqueta ${segundos <= 120 ? 'vermelha' : ''}`}>
      <IconeRelogio />
      <span className="relogio">
        {m}:{String(s).padStart(2, '0')}
      </span>
    </span>
  )
}
