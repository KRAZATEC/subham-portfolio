# SUBHAM OS — AI Security Command Center

A futuristic AI-powered portfolio website for Subham Patro — built to feel like an AI operating system, not a regular portfolio. Combines cyberpunk aesthetics, holographic UI, terminal interaction, and animated neural network visuals.

## Run & Operate

- `pnpm --filter @workspace/portfolio run dev` — run the portfolio frontend (port 21113)
- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React 18 + Vite + Tailwind CSS
- Animations: Framer Motion + GSAP
- 3D: Three.js, @react-three/fiber, @react-three/drei
- API: Express 5 (health check only, portfolio is frontend-only)
- Build: Vite

## Where things live

- `artifacts/portfolio/` — Main portfolio frontend
- `artifacts/portfolio/src/data/portfolio-data.ts` — All resume content (source of truth for portfolio info)
- `artifacts/portfolio/src/components/portfolio/` — All portfolio section components
- `artifacts/portfolio/src/pages/portfolio/PortfolioPage.tsx` — Main page orchestrator
- `artifacts/portfolio/src/index.css` — Cyberpunk dark theme with all CSS utilities
- `artifacts/api-server/` — Express API server (health check endpoint only)

## Architecture decisions

- Frontend-only portfolio: no database needed, all data in `portfolio-data.ts`
- Boot screen animation plays on every page load (~3.5s), then fades into hero
- Terminal component is a full interactive overlay with command history (up/down arrows)
- Sections use Framer Motion's `useInView` for scroll-triggered entrance animations
- Particle canvas uses raw Canvas 2D API for performance (no 3D overhead on hero)
- Google Fonts imported as first line of index.css (required by PostCSS)

## Product

A world-class futuristic AI portfolio website "SUBHAM OS — AI Security Command Center" featuring:
- Cinematic boot sequence with terminal-style initialization
- Animated particle/neural network hero section with typing role rotator
- Interactive project cards with expand/collapse and category filtering
- Mission Logs experience section with metrics and achievement callouts
- Intelligence Matrix skills visualization with hover interactions
- Memory Core timeline with interactive expand nodes (2023–2026)
- Secure Vault certifications with holographic card animations
- Communication Terminal contact section
- Full interactive terminal (&gt;_ terminal) with commands: about, projects, skills, experience, certifications, contact, education, clear, sudo reveal-secret, sudo matrix

## User preferences

- Build should feel like an AI Operating System / SOC platform, not a normal portfolio
- Dark cyberpunk theme: deep black #050508, neon cyan #00f5ff, electric purple #8b5cf6, neon green #00ff88
- Fonts: Orbitron (headings), Space Grotesk (body), JetBrains Mono (terminal/code)
- No emojis in the UI (data file uses them as category icons only)

## Gotchas

- Google Fonts `@import url(...)` MUST be the very first line of index.css — PostCSS fails silently if placed after other imports
- The portfolio workflow at port 21113 must be running for the preview to work
- All portfolio resume data lives in `src/data/portfolio-data.ts` — edit there to update content

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
