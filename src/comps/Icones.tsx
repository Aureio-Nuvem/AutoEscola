/** Ícones em traço, desenhados inline para o app não depender de fonte externa. */
type Props = { className?: string }

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export const IconeHoje = (p: Props) => (
  <svg {...base} {...p}><path d="M12 3v3M4.6 6.6l2.1 2.1M3 14h3M21 14h-3M17.3 8.7l2.1-2.1" /><path d="M6 20a6 6 0 1 1 12 0z" /></svg>
)

export const IconeErros = (p: Props) => (
  <svg {...base} {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 4v4h4" /><path d="M12 8v4l2.5 2" /></svg>
)

export const IconeModulos = (p: Props) => (
  <svg {...base} {...p}><rect x="3" y="4" width="7" height="7" rx="1.6" /><rect x="14" y="4" width="7" height="7" rx="1.6" /><rect x="3" y="14" width="7" height="7" rx="1.6" /><rect x="14" y="14" width="7" height="7" rx="1.6" /></svg>
)

export const IconePlacas = (p: Props) => (
  <svg {...base} {...p}><path d="M12 2.6 21.4 12 12 21.4 2.6 12z" /><path d="M12 8.4v4.2" /><path d="M12 15.9h.01" /></svg>
)

export const IconeAjustes = (p: Props) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="3.2" /><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 3 15a1.7 1.7 0 0 0-1.6-1.1H1a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 2.7 8.7a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 7 4.3h.1A1.7 1.7 0 0 0 8.7 2.7V2.6a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1.6 1.6 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.7 9v.1a1.7 1.7 0 0 0 1.6 1.6h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1.3z" /></svg>
)

export const IconeVoltar = (p: Props) => (
  <svg {...base} {...p} width="20" height="20"><path d="M15 18l-6-6 6-6" /></svg>
)

export const IconeChama = (p: Props) => (
  <svg {...base} {...p} width="16" height="16"><path d="M12 22a7 7 0 0 0 7-7c0-5-4-6-4-10 0 0-3 1.5-3 5 0-1.5-1-3-2.5-3.5C9.5 9 5 11 5 15a7 7 0 0 0 7 7z" /></svg>
)

export const IconeCerto = (p: Props) => (
  <svg {...base} {...p} strokeWidth={2.6} width="14" height="14"><path d="M20 6 9 17l-5-5" /></svg>
)

export const IconeErrado = (p: Props) => (
  <svg {...base} {...p} strokeWidth={2.6} width="14" height="14"><path d="M18 6 6 18M6 6l12 12" /></svg>
)

export const IconeRelogio = (p: Props) => (
  <svg {...base} {...p} width="16" height="16"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
)

export const IconeLivro = (p: Props) => (
  <svg {...base} {...p} width="16" height="16"><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v18H6.5A2.5 2.5 0 0 0 4 22z" /><path d="M4 17.5A2.5 2.5 0 0 1 6.5 15H20" /></svg>
)
