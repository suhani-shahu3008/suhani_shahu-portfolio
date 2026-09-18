/**
 * Glossy liquid-glass wordmark from the Portfolio Design System — a
 * "Clicker Script" cursive rendering of the site name, reserved for the
 * site name/monogram (distinct from SiteNav's per-letter animated logo).
 * Requires the "Clicker Script" Google Font to be loaded by the host app.
 *
 * @param {{
 *   text?: string,
 *   as?: 'span' | 'a' | 'h1',
 *   href?: string,
 *   size?: number | string,
 *   className?: string,
 * }} props
 */
export default function Logo({
  text = 'Suhani Shahu',
  as = 'span',
  href,
  size,
  className = '',
  ...rest
}) {
  const classes = ['logo-wordmark', className].filter(Boolean).join(' ')
  const style = size != null ? { fontSize: size } : undefined
  const Tag = as

  return (
    <Tag className={classes} style={style} href={as === 'a' ? href : undefined} {...rest}>
      {text}
    </Tag>
  )
}
