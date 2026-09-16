import { LiquidMetalButton } from './liquid-metal-button/LiquidMetalButton'

/**
 * WebGL "liquid metal" pill button pre-wired for a file download: clicking
 * it triggers a download of `href` (or calls `onClick` instead, if given).
 *
 * @param {{
 *   label?: string,
 *   href?: string,
 *   disabled?: boolean,
 *   onClick?: () => void,
 * }} props
 */
export default function ResumeButton({ label = 'Download Resume', href = '/resume.pdf', disabled = false, onClick }) {
  const handleClick = () => {
    if (disabled) return
    if (onClick) return onClick()
    const a = document.createElement('a')
    a.href = href
    a.download = ''
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  return (
    <div className={`resume-btn-shell${disabled ? ' is-disabled' : ''}`}>
      <div className="resume-btn-shell__stage">
        <LiquidMetalButton text={label} onClick={handleClick} />
      </div>
    </div>
  )
}
