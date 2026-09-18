/**
 * Pill button from the Portfolio Design System (Claude Design handoff:
 * "Buttons.dc.html"). Two variants — `primary` (blush-pink liquid glass,
 * strongest priority) and `secondary` (neutral dark glass, quieter
 * priority) — each in three sizes, with icon/icon-only support and a
 * built-in loading state.
 *
 * @param {{
 *   variant?: 'primary' | 'secondary',
 *   size?: 'sm' | 'md' | 'lg',
 *   as?: 'button' | 'a',
 *   href?: string,
 *   type?: 'button' | 'submit' | 'reset',
 *   icon?: import('react').ReactNode,
 *   iconTrailing?: import('react').ReactNode,
 *   iconOnly?: boolean,
 *   loading?: boolean,
 *   loadingLabel?: string,
 *   disabled?: boolean,
 *   className?: string,
 *   children?: import('react').ReactNode,
 * }} props
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  as = 'button',
  href,
  type = 'button',
  icon,
  iconTrailing,
  iconOnly = false,
  loading = false,
  loadingLabel = 'Loading…',
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const isDisabled = disabled || loading
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    iconOnly && 'btn-icon-only',
    loading && 'btn-loading',
    className,
  ].filter(Boolean).join(' ')

  const content = (
    <>
      <span className="btn-gloss" aria-hidden="true" />
      {loading
        ? <>
            <span className="btn-spinner" aria-hidden="true" />
            {!iconOnly && <span className="btn-label">{loadingLabel}</span>}
          </>
        : <>
            {icon && <span className="btn-icon" aria-hidden="true">{icon}</span>}
            {!iconOnly && <span className="btn-label">{children}</span>}
            {iconTrailing && <span className="btn-icon" aria-hidden="true">{iconTrailing}</span>}
          </>
      }
    </>
  )

  if (as === 'a') {
    return (
      <a
        className={classes}
        href={isDisabled ? undefined : href}
        aria-disabled={isDisabled || undefined}
        {...rest}
      >
        {content}
      </a>
    )
  }

  return (
    <button className={classes} type={type} disabled={isDisabled} {...rest}>
      {content}
    </button>
  )
}
