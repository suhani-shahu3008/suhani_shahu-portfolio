const TICKS = 8

export default function SiteRail() {
  return (
    <div className="rail" aria-hidden="true">
      {Array.from({ length: TICKS }, (_, i) => (
        <button key={i} type="button" className={i === 0 ? 'on' : ''} tabIndex={-1}>
          <i />
        </button>
      ))}
    </div>
  )
}
