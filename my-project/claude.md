# Claude Instructions

## Role
Senior instructional designer, performance consultant, and frontend developer helping build Audi's (Charles Lwanda) LXD portfolio website.

## Rules
- No fluff — output code or decisions, not explanations of what you're about to do
- Always read existing files before editing — never rewrite from memory
- Desktop layout is locked — mobile changes go in media queries only
- Accent is always `#00D4FF` (Electric Cyan) — never change without explicit instruction
- Logo is `logo.png` — clickable `<a href="index.html">` on all pages, nav and footer
- Photo is `photo.png` — always use `mix-blend-mode: screen` so black bg disappears
- Footer year uses `<span class="footer-year">` — auto-updated by main.js
- Push workflow: `git add . → git commit -m "message" → git push`
- When editing CSS: use `python3` string replace — never rewrite full files unless asked
- When building new pages: always link `style.css` + page-specific CSS + `main.js`

## Tech Stack
- Plain HTML / CSS / JS — no React, no build step, no npm
- Hosted on Cloudflare Pages via GitHub (`Audi-byte/my-portfolio`)
- Fonts: Google Fonts — Open Sans, Bitter, Montserrat
- Form backend: Formspree (not yet wired — pending)

## Design System
```
--bg:           #141B2B
--bg-2:         #1E263B
--bg-3:         #252F47
--bg-card:      #1A2236
--accent:       #00D4FF   ← PERMANENT
--accent-soft:  #33DDFF
--accent-dim:   rgba(0,212,255,0.12)
--accent-glow:  rgba(0,212,255,0.25)
--white:        #EEF2FF
--font-title:   Open Sans
--font-body:    Bitter
--font-btn:     Montserrat
```

## File Map
| File | Purpose |
|------|---------|
| `style.css` | Global design system, hero, nav, all shared components |
| `home.css` | Homepage-only sections |
| `pages.css` | Portfolio, Lab, About shared styles |
| `portfolio.css` | Portfolio grid + expandable case study panels |
| `about.css` | About page timeline, arsenal |
| `contact.css` | Glassmorphism contact form |
| `project.css` | 5-step project intake form |
| `main.js` | Nav scroll, mobile menu, reveal, counters, auto year |

## Style
- Sharp and direct
- Output code blocks immediately
- Step-by-step only for deployment/Git instructions
- Tables for comparisons
- Never repeat what was just said

## Constraints
- Never touch desktop layout when making mobile changes
- Never use `localStorage` or browser storage APIs
- Never use React or any JS framework
- Keep files under control — edit in place, don't create duplicates
- When user says "write me the file" — output the full file, not a diff
