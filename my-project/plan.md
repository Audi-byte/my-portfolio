# Project Plan

## Goal
A world-class LXD portfolio website for Charles Lwanda (Audi) — deployed on Cloudflare Pages — that signals strategic thinking, learning science, and technical execution to HR managers and L&D leads hiring at $80k–$150k remote roles.

## Current Status

### Deployed
- Live on Cloudflare Pages via GitHub (`Audi-byte/my-portfolio`)
- Custom domain setup available

### File Structure
```
portfolio/
  index.html          # Homepage — hero, signals, case study preview, services, testimonials, lab teaser, contact
  about.html          # Full about page with experience/education timeline
  about.css           # About page styles
  portfolio.html      # 6-card grid + expandable case study panels (CS1–CS5 done, CS6 placeholder)
  portfolio.css       # Portfolio grid + panel styles
  lab.html            # The Lab — 3 essays + 1 framework
  pages.css           # Shared styles for portfolio, lab, about pages
  home.css            # Homepage-specific styles
  contact.html        # Glassmorphism contact page with form
  contact.css         # Contact page styles
  start-a-project.html # 5-step multi-step project intake form
  project.css         # Project form styles
  style.css           # Global design system
  main.js             # All JS: nav, reveal, counters, auto year
  logo.png            # CL monogram (transparent bg)
  photo.png           # Professional headshot (black bg — uses mix-blend-mode:screen)
  elearning-design-checklist.pdf  # 50-question PDF lead magnet
```

### Design System
- **Fonts:** Open Sans (titles) · Bitter (body) · Montserrat (buttons/labels)
- **Background:** `#141B2B` / `#1E263B` / `#252F47` (Telegram dark blue)
- **Accent:** `#00D4FF` (Electric Cyan) — permanent
- **Logo:** `logo.png` — clickable home link on all pages
- **Photo:** `photo.png` — hero section, `mix-blend-mode: screen` removes black bg

### Content
- 5 full case studies: Algorithm Is Wrong · Field Guide · 3 Minutes a Day · Difficult Conversations · Training That Wasn't Working
- 3 Lab essays + 1 performance framework
- Contact form (frontend only — Formspree not yet wired)
- 50-question eLearning Design Checklist PDF

## Next Steps
1. Wire up Formspree endpoint in `contact.html` form action
2. Replace placeholder emoji images in portfolio cards with real Storyline screenshots
3. Add real Storyline/Rise demo links to "Try Sample Module" buttons
4. Update email `hello@yourname.com` → real email across all pages
5. Update LinkedIn URL → real profile link
6. Add 6th case study when next project completes
7. Optional: custom domain via Cloudflare Registrar

## Decisions Made
- Hosting: Cloudflare Pages (free tier, unlimited bandwidth)
- Stack: Plain HTML/CSS/JS — no frameworks, no build step
- Accent: Electric Cyan `#00D4FF` — permanent, confirmed
- Logo: PNG with transparent bg, `mix-blend-mode: screen` for dark nav
- Photo: black bg removed via blend mode — no re-export needed
- Portfolio layout: 6-card grid → expandable panels (not separate pages)
- Contact: glassmorphism card, form submission goes nowhere until Formspree wired
- Blog section: renamed to "The Lab" — essays not a traditional blog
- Nav: Home · About · Portfolio · The Lab · Contact · Start a Project

## Open Questions
- Real email address to replace `hello@yourname.com`
- Real LinkedIn URL
- Formspree account created yet?
- Custom domain purchased?
- Real Storyline demo files ready to embed?
