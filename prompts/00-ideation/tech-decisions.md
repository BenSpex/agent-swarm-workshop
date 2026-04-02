# Tech Decisions

## Stack

| Technology | Version | Rationale |
|-----------|---------|-----------|
| React | 18 | Fast dev server via Vite, component model fits panel-based UI, huge ecosystem |
| Vite | latest | Sub-second HMR, zero-config Vercel deploys, TypeScript out of the box |
| Tailwind CSS | v4 | Utility-first CSS, pairs naturally with WY_THEME constants, no CSS file sprawl |
| TypeScript | strict | Catches contract violations at compile time. `strict: true` in tsconfig, no `any` |
| BigInt | native | Required for numbers exceeding 2^53 -- clip counts reach 10^55 in late game |
| localStorage | browser | Save/load with no backend. Custom JSON replacer/reviver for BigInt serialization |
| Vercel | - | One-click deploy from CLI (`npx vercel`). Audience gets a live URL instantly |

## Why React 18 (not 19)

React 18 is stable and well-understood by Claude Code. React 19 introduces breaking changes (use hook patterns, RSC) that add complexity without benefit for a single-page game. We want zero friction.

## Why Vite (not CRA or Next.js)

- CRA is deprecated
- Next.js adds SSR/routing complexity we don't need (single-page game)
- Vite starts in <500ms, HMR is near-instant, and Vercel deployment is zero-config

## Why Tailwind v4 (not v3)

Tailwind v4 uses CSS-first configuration and is the current recommended version. Utility classes keep styles co-located with components. The WY_THEME constants are mapped to CSS custom properties in `tailwind.config.ts`.

## Why TypeScript Strict

Every team codes against frozen interfaces in `src/shared/`. TypeScript strict mode catches:
- Missing fields when constructing GameState
- Wrong action types when dispatching
- BigInt/number arithmetic mixing
- Contract violations from any team

This is the first line of defense after Keel's pre-write hooks.

## Why BigInt (not a library)

Native BigInt is supported in all modern browsers and Node.js 18+. No dependency needed. The gotcha is JSON serialization -- `JSON.stringify` silently drops bigint values. We handle this with a custom replacer/reviver in the persistence layer:

```typescript
// Serialization: bigint => { __bigint: "12345" }
// Deserialization: { __bigint: "12345" } => 12345n
```

## Why localStorage (not IndexedDB or a server)

- Zero backend means zero infrastructure
- Game state is a single JSON blob (~10KB)
- Auto-save every 25 seconds, manual save/load buttons
- Works offline
- Reset clears localStorage

## Why Vercel

- `npx vercel` deploys in <30 seconds
- Free tier is sufficient
- Audience can pull out their phones and play the game immediately
- No CI/CD setup needed for a workshop demo
