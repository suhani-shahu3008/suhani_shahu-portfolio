import { LiquidMetalButton } from '../shaders/liquid-metal-button/LiquidMetalButton'

export default function ResumeButton({ disabled = false }) {
  const handleClick = () => {
    if (disabled) return
    const a = document.createElement('a')
    a.href = '/resume.pdf'
    a.download = ''
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className={`resume-btn-shell${disabled ? ' is-disabled' : ''}`}>
      <div className="resume-btn-shell__stage">
        <LiquidMetalButton text="Download Resume" onClick={handleClick} />
      </div>
    </div>
  )
}
