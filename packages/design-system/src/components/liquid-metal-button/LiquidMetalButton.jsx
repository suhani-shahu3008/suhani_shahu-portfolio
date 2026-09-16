import { useRef, useState, useCallback, useEffect } from 'react'
import html from './liquid-metal-button.html.js'
import './liquid-metal-button.css'

// Same bridge the registered component appends to its srcDoc: sets the label
// text and pill width from postMessage, and turns a click into an 'activate'
// message the parent listens for. Copied verbatim from
// @designcodeio/threeui's LiquidMetalButton.js.
const BRIDGE = `
<script id="liquid-metal-button-bridge">
  window.addEventListener('message', event => {
    if(event.source !== parent) return;
    const config = event.data && event.data.liquidMetalButton;
    if(!config) return;
    const text = typeof config.text === 'string' ? config.text.slice(0, 24) : '';
    const label = btn.querySelector('.lbl');
    if(label) label.textContent = text;
    btn.setAttribute('aria-label', text || 'Button');
    if(Number.isFinite(config.pillWidthUnits)) {
      stage.style.setProperty('--bw', 'calc(' + config.pillWidthUnits + ' * var(--u))');
    }
    document.body.style.background = config.embedded ? '#0e0f12' : '';
    stage.style.position = config.embedded ? 'absolute' : '';
    stage.style.top = config.embedded ? '50%' : '';
    stage.style.left = config.embedded ? '50%' : '';
    stage.style.transform = config.embedded ? 'translate(-50%, -50%)' : '';
  });

  btn.addEventListener('click', () => {
    parent.postMessage({ liquidMetalButton: { type: 'activate' } }, '*');
  });
<\/script>`

const SRC_DOC = html.replace('</body>', `${BRIDGE}\n</body>`)

/**
 * Interactive WebGL "liquid metal" pill button (real-time shader + ripple
 * physics + bloom pipeline, rendered in a sandboxed iframe). Portfolio-local
 * pill variant of ThreeUI's LiquidMetalButton.
 *
 * @param {{
 *   text?: string,
 *   embedded?: boolean,
 *   onClick?: () => void,
 *   className?: string,
 * }} props
 */
export function LiquidMetalButton({ className = '', text = 'Download Resume', embedded = false, onClick }) {
  const wrapRef = useRef(null)
  const frameRef = useRef(null)
  const [ready, setReady] = useState(false)

  const label = String(text).slice(0, 24)
  const pillWidthUnits = Math.min(3000, Math.max(1407, 820 + label.length * 94))

  const postConfig = useCallback(() => {
    frameRef.current?.contentWindow?.postMessage(
      { liquidMetalButton: { text: label, pillWidthUnits, embedded } },
      '*'
    )
  }, [label, pillWidthUnits, embedded])

  useEffect(() => {
    if (!ready) return
    // Belt-and-braces: resend a couple of times shortly after load. The
    // bridge's listener is registered synchronously before the iframe's
    // 'load' event fires, so one send should always land — this just
    // guards against React StrictMode's mount/unmount/remount cycle in dev,
    // which can otherwise leave the very first message posted to a frame
    // that's already been replaced.
    postConfig()
    const t1 = setTimeout(postConfig, 150)
    const t2 = setTimeout(postConfig, 500)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [ready, postConfig])

  useEffect(() => {
    if (!onClick) return
    const handler = (e) => {
      if (e.source === frameRef.current?.contentWindow && e.data?.liquidMetalButton?.type === 'activate') {
        onClick()
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [onClick])

  return (
    <div ref={wrapRef} className={`liquid-metal-button${className ? ` ${className}` : ''}`} data-state={ready ? 'ready' : 'loading'} data-variant="pill">
      <iframe
        ref={frameRef}
        className={`liquid-metal-button__frame${ready ? ' is-ready' : ''}`}
        title="Interactive liquid metal button"
        srcDoc={SRC_DOC}
        sandbox="allow-scripts"
        loading="eager"
        onLoad={() => setReady(true)}
      />
    </div>
  )
}
