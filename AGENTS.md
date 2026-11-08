<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# HireLoop-client

Next.js 16 App Router (React 19, TypeScript strict), Tailwind CSS v4, shadcn/ui, better-auth with MongoDB adapter.

## Commands (npm)

- `npm run dev` — dev server on localhost:3000
- `npm run build` — production build (`.next/`, gitignored)
- `npm run start` — production server
- `npm run lint` — ESLint 9 flat config (`eslint.config.mjs`, extends `eslint-config-next`)
- `npm run format` — Prettier `--write "**/*.{ts,tsx}"` (no semicolons, double quotes, printWidth 80, tailwind plugin)
- `npm run typecheck` — `tsc --noEmit`

No test framework or test script is installed. Do not add `npm test` or test commands without adding a runner first.

## Verification order

`lint -> typecheck -> build`. Fix format first if Prettier complains (`format` rewrites files in place).

## Environment

`.env*` is gitignored and contains secrets (BETTER_AUTH_SECRET, BETTER_AUTH_URL, MONGODB_URI). A local `.env` already exists — copy it for local work, never commit it, never rotate the checked-in values without team coordination.

Required at runtime: `BETTER_AUTH_SECRET`, `BETTER_AUTH_URL`, `MONGODB_URI`.

## Architecture (not obvious from filenames)

- App Router: `app/layout.tsx`, `app/page.tsx`, `app/globals.css` (Tailwind v4 stylesheet), `app/api/auth/[...all]` (better-auth handler)
- Path alias: `@/*` maps to repo root (`tsconfig.json` `paths`)
- Auth: server client `lib/auth.ts` (`betterAuth` + `@better-auth/mongo-adapter` over `mongodb`), client `lib/auth-client.ts` (`createAuthClient` from `better-auth/react`), base URL from `BETTER_AUTH_URL`
- UI: shadcn/ui components live in `components/ui/`; add with `npx shadcn@latest add <name>`; import as `@/components/ui/button`
- `components/theme-provider.tsx` wraps next-themes; `lib/utils.ts` re-exports `cn` from `cn`
- `next.config.ts` is intentionally empty (default config)
- `CLAUDE.md` is just `@AGENTS.md` — no separate instructions

## Gotchas

- Tailwind v4 via `@tailwindcss/postcss`; Prettier tailwind plugin targets `app/globals.css` and functions `cn`, `cva`
- `next dev` rewrites the top `nextjs-agent-rules` block in this file — leave it in place
- `.next/` and `out/` are build artifacts; gitignored, do not commit
- No CI workflows, no pre-commit config, no `opencode.json`
