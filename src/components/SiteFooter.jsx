import { Link } from 'react-router-dom'

const socialIcon = {
  linkedin: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z',
  pinterest: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.067-.877-.128-2.223.026-3.181.14-.867.902-5.518.902-5.518s-.23-.46-.23-1.14c0-1.068.62-1.866 1.392-1.866.656 0 .974.493.974 1.083 0 .658-.42 1.643-.635 2.556-.181.762.383 1.383 1.135 1.383 1.36 0 2.406-1.437 2.406-3.507 0-1.834-1.318-3.117-3.198-3.117-2.178 0-3.454 1.634-3.454 3.324 0 .658.253 1.363.569 1.746a.229.229 0 0 1 .052.219c-.057.238-.184.762-.209.869-.033.14-.108.169-.25.102-1.342-.63-2.184-2.607-2.184-4.197 0-3.421 2.484-6.566 7.16-6.566 3.759 0 6.685 2.679 6.685 6.264 0 3.735-2.353 6.741-5.622 6.741-1.098 0-2.129-.571-2.481-1.244 0 0-.542 2.061-.674 2.567-.244.938-.905 2.115-1.348 2.834 1.014.312 2.09.481 3.207.481 6.62 0 11.987-5.367 11.987-11.987C24.005 5.367 18.638 0 12.017 0z',
  behance: 'M22 7.615h-6.39v1.505h6.39v-1.505zm-13.126 1.72c1.372-.68 2.099-1.79 2.099-3.31 0-3.18-2.379-4.025-5.145-4.025h-5.828v16h6.104c2.907 0 5.896-1.226 5.896-4.688 0-2.135-1.032-3.51-3.126-3.977zm-5.616-4.999h2.586c1.152 0 2.202.316 2.202 1.68 0 1.256-.844 1.76-2.008 1.76h-2.78v-3.44zm2.892 10.71h-2.892v-3.986h2.955c1.417 0 2.394.607 2.394 2.022 0 1.514-1.184 1.964-2.457 1.964zm12.694-6.228c-3.185 0-5.36 2.276-5.36 5.482 0 3.328 2.045 5.4 5.36 5.4 2.692 0 4.548-1.222 5.107-3.242h-2.566c-.283.893-1.14 1.366-2.462 1.366-1.709 0-2.744-1.02-2.83-2.791h8.038v-.667c0-3.35-2.033-5.548-5.287-5.548zm-2.794 4.5c.168-1.34 1.076-2.31 2.673-2.31 1.31 0 2.28.912 2.396 2.31h-5.069z',
  snapchat: 'M12 3C7.5 3 5 6.5 5 11c0 2.5.6 4.3.6 4.3-1 .3-1.8 1-1.8 1.8 0 .8.7 1.2 1.3 1.3.4 1.3 1.6 1.5 2.2.8.6.7 1.6 1 2.4.4.6.8 1.4 1.1 2.3 1.1.9 0 1.7-.3 2.3-1.1.8.6 1.8.3 2.4-.4.6.7 1.8.5 2.2-.8.6-.1 1.3-.5 1.3-1.3 0-.8-.8-1.5-1.8-1.8 0 0 .6-1.8.6-4.3 0-4.5-2.5-8-7-8Z',
  instagram: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z',
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  vercel: 'M12 2 22 20.5H2Z',
}

const socialUrl = {
  linkedin: 'https://www.linkedin.com/in/suhani-shahu-b755463a0/',
  behance: 'https://www.behance.net/suhanishahu',
  instagram: 'https://www.instagram.com/_softy_3008',
  github: 'https://github.com/suhani-shahu3008',
  vercel: 'https://vercel.com/suhani-shahu',
  pinterest: 'https://in.pinterest.com/suhanishahu3008/_profile/',
  snapchat: 'https://www.snapchat.com/@shahu_suhani',
}

function Mark({ id, ellipseEyes }) {
  return (
    <span className="foot-socials__mark">
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d={socialIcon[id]} />
        {ellipseEyes && (
          <>
            <ellipse cx="9.2" cy="11.2" rx="1" ry="1.2" />
            <ellipse cx="14.8" cy="11.2" rx="1" ry="1.2" />
          </>
        )}
      </svg>
    </span>
  )
}

function Arrow() {
  return (
    <svg className="foot-socials__arrow" viewBox="0 0 14 14" fill="none" width="11" height="11" aria-hidden="true">
      <path d="M3 11 11 3M5 3h6v6" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  )
}

/**
 * Exact port of `.foot` from public/landing-pages/suhanishahu-portfolio.html
 * (Home's own footer, data-layout-footer="b" variant) — same classes, same
 * values (ported into the `.foot*` rules in src/index.css). The `.fg`
 * decorative foreground images are not ported: they're driven by the 3D/
 * camera system that only exists inside the Kage iframe.
 */
export default function SiteFooter() {
  return (
    <footer className="foot">
      <div className="foot-grid">
        <div className="foot-brand">
          <div>
            <p className="eyebrow foot-meta">End of the walk</p>
            <p className="foot-brand__l1">I design for people, not just pixels.</p>
            <p className="foot-brand__l2">Because great design should never stop at the screen.</p>
          </div>
          <div className="foot-brand__tag eyebrow">
            <span className="dot" />
            Designing for screens and beyond
          </div>
        </div>

        <div>
          <h4>Navigation</h4>
          <ul>
            <li><Link to="/" data-cursor>Home</Link></li>
            <li><Link to="/case-studies" data-cursor>Case Studies</Link></li>
            <li><Link to="/about-me" data-cursor>About Me</Link></li>
            <li><Link to="/get-in-touch" data-cursor>Get in Touch</Link></li>
          </ul>
        </div>

        <div>
          <h4>Socials</h4>
          <ul className="foot-socials">
            <li className="foot-socials__row">
              <a href={socialUrl.linkedin} target="_blank" rel="noopener noreferrer" data-cursor><Mark id="linkedin" />LinkedIn<Arrow /></a>
              <a href={socialUrl.pinterest} target="_blank" rel="noopener noreferrer" data-cursor><Mark id="pinterest" />Pinterest<Arrow /></a>
            </li>
            <li className="foot-socials__row">
              <a href={socialUrl.behance} target="_blank" rel="noopener noreferrer" data-cursor><Mark id="behance" />Behance<Arrow /></a>
              <a href={socialUrl.snapchat} target="_blank" rel="noopener noreferrer" data-cursor style={{ transform: 'translateX(-2px)' }}><Mark id="snapchat" ellipseEyes />Snapchat<Arrow /></a>
            </li>
            <li><a href={socialUrl.instagram} target="_blank" rel="noopener noreferrer" data-cursor><Mark id="instagram" />Instagram<Arrow /></a></li>
            <li><a href={socialUrl.github} target="_blank" rel="noopener noreferrer" data-cursor><Mark id="github" />GitHub<Arrow /></a></li>
            <li><a href={socialUrl.vercel} target="_blank" rel="noopener noreferrer" data-cursor><Mark id="vercel" />Vercel<Arrow /></a></li>
          </ul>
        </div>

        <div>
          <h4>Contact</h4>
          <ul className="foot-contact">
            <li>
              <a href="tel:+919284828790" data-cursor>
                <span className="foot-contact__icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M6.6 3h3.2l1.4 4.4-2.2 1.7a12.4 12.4 0 0 0 5.9 5.9l1.7-2.2 4.4 1.4v3.2c0 1-.8 1.8-1.8 1.7A17.6 17.6 0 0 1 4.9 4.8C4.8 3.8 5.6 3 6.6 3z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  </svg>
                </span>
                +91 92848 28790
              </a>
            </li>
            <li>
              <a href="mailto:suhanishahu3008@gmail.com" data-cursor>
                <span className="foot-contact__icon">
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3.2" y="5.5" width="17.6" height="13" rx="1.8" stroke="currentColor" strokeWidth="1.4" />
                    <path d="M4.2 6.7 12 12.9l7.8-6.2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                suhanishahu3008@gmail.com
              </a>
            </li>
          </ul>
          <p className="foot-contact__note">Always open to exciting projects, collaborations, or just a good conversation about design, technology, and what's next.</p>
        </div>
      </div>

      <div className="foot-base">
        <span>© 2026 Suhani Shahu. All rights reserved.</span>
        <span>UI/UX Designer · Brand Designer · XR/Spatial Designer</span>
      </div>

      <p className="foot-closing">— Till we meet again —</p>
    </footer>
  )
}
