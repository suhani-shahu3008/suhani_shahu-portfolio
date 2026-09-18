# suhani-design-system

Reusable UI components extracted from the [XR Portfolio](../../) site. Every
component takes props for its content (nav links, brand copy, socials,
contact details) with the portfolio's real values as defaults, so it renders
correctly out of the box but is fully reusable for other layouts.

## Requirements

- **React 19**, rendered inside a **react-router-dom `<Router>`** —
  `SiteNav`, `SideNav`, and `SiteFooter` use `Link` / `NavLink` /
  `useLocation`.
- **`three`** — required by `SiteCursorWisps` (WebGL particle trail).
- **Fonts**: components reference `Manrope`, `JetBrains Mono`,
  `Instrument Serif`, `Cormorant Garamond`, and (for `Logo`) `Clicker Script`
  but don't ship them — load them yourself (e.g. `<link>` to Google Fonts,
  or self-hosted `@font-face`). Without them, text renders in the browser's
  fallback font.
- **`src/styles.css`** — import this once; it carries the tokens (CSS custom
  properties) and per-component styles referenced by class name.

## Components

| Component | Notes |
|---|---|
| `SiteNav` | Sticky top nav — animated per-letter logo, links, CTA, mobile menu |
| `SideNav` | Collapsed icon pill that expands into a labeled nav on drag |
| `SiteRail` | Vertical scroll-spy progress rail |
| `IndexRail` | Numbered dot/line index list |
| `SiteFooter` | Multi-column footer — brand, nav, socials, contact |
| `ContactForm` | Validated contact form. No `accessKey` → submits are mocked (demoable without credentials). Pass a [web3forms.com](https://web3forms.com) `accessKey`, or `onSubmit` to handle submission yourself |
| `Button` | Pill button — `primary` (blush-pink liquid glass) / `secondary` (dark glass) variants, `sm`/`md`/`lg` sizes, icon/icon-only, loading state |
| `Logo` | "Clicker Script" cursive wordmark, reserved for the site name/monogram |
| `ResumeButton` | WebGL "liquid metal" pill button wired to trigger a file download |
| `LiquidMetalButton` | The underlying WebGL pill button (real-time shader, iframe-sandboxed) |
| `SiteCursor` | Full-viewport custom cursor ring, swells over `[data-cursor]` elements |
| `SiteCursorWisps` | Full-viewport WebGL particle trail following the pointer |
| `HomeIcon`, `LayersIcon`, `UserIcon`, `MailIcon`, `DownloadIcon` | Stroked icon set |

`SiteCursor` and `SiteCursorWisps` are full-viewport pointer effects, not
composable layout pieces — mount each once near the app root, not per-screen.

## Source of truth

This package is the canonical, parameterized implementation. The live
portfolio app (`../../src/components/`) re-exports these components as thin
wrappers, passing the app's real defaults (and, for `ContactForm`, its real
web3forms access key — kept local, never in this package).
