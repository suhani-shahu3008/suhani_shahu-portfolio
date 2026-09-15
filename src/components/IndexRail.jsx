export default function IndexRail({ items }) {
  return (
    <div className="idx-rail">
      {items.map(({ num, label }) => (
        <div className="idx-rail__row" key={num}>
          <span className="dot" />
          <span className="k"><b>{num}</b> — {label}</span>
          <span className="rule" />
        </div>
      ))}
    </div>
  )
}
