// Clean, Lucide-style stroked SVG icons.

const base = {
  width: 26,
  height: 26,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

export function HomeIcon() {
  return (
    <svg {...base}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" />
    </svg>
  )
}

export function LayersIcon() {
  return (
    <svg {...base}>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12.5 9 5 9-5" />
      <path d="m3 17 9 5 9-5" />
    </svg>
  )
}

export function UserIcon() {
  return (
    <svg {...base}>
      <circle cx="12" cy="8" r="3.75" />
      <path d="M5 21c1-4 4-6 7-6s6 2 7 6" />
    </svg>
  )
}

export function MailIcon() {
  return (
    <svg {...base}>
      <rect x="3" y="5.5" width="18" height="13" rx="2.5" />
      <path d="m4.5 7.5 7.5 5.5 7.5-5.5" />
    </svg>
  )
}

export function DownloadIcon(props) {
  return (
    <svg {...base} width={18} height={18} {...props}>
      <path d="M12 3.5v11" />
      <path d="m7 10 5 5 5-5" />
      <path d="M4.5 18.5v1.2a1.8 1.8 0 0 0 1.8 1.8h11.4a1.8 1.8 0 0 0 1.8-1.8v-1.2" />
    </svg>
  )
}
