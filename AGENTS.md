<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->

---

# Solden Paint & Panel — project conventions

Marketing site + lead management dashboard for a family-owned smash repair shop
in Brendale, QLD. Replaces a dated Wix site that had no lead capture at all.

## The content rule (most important thing in this file)

**Never invent business facts.** Copy may be rewritten, tightened and given a
better voice, but every factual claim must trace to something Solden publishes
on soldenpaintandpanel.com.au. Specifically, do NOT add:

- services they don't offer
- star ratings, review counts, `aggregateRating` schema, or "X happy customers"
- awards, certifications or accreditations beyond Motor Trades Association
  Queensland membership
- insurer names or logos (they say "all major insurers", never which ones)
- turnaround times, prices, or staff numbers
- years in business other than "over 30 years"

The verified fact inventory lives in `lib/site.ts` and the header comments of
`content/services.ts`. Testimonials in `content/testimonials.ts` are quoted
verbatim and must not be edited.

## Architecture

| Area | Location |
|---|---|
| Public marketing site | `app/(site)/` — static-rendered |
| Dashboard | `app/(dashboard)/` — authenticated |
| Sign in | `app/(auth)/` |
| Backend | `convex/` |
| Copy as data | `content/` |
| Business constants | `lib/site.ts` |

**Convex is scoped to the authenticated route groups only.** `ConvexAuthNextjs*`
providers live in `app/(auth)/layout.tsx` and `app/(dashboard)/layout.tsx`, never
in the root layout — putting them there makes every marketing page read cookies
and go dynamic. The public site needs no Convex client: the quote wizard posts to
Convex HTTP actions via `lib/leads.ts`.

## Backend rules

- Thin `query`/`mutation`/`action` wrappers in `convex/*.ts`; logic in
  `convex/model/*.ts`.
- Always declare both `args` and `returns` validators. Use `schema.doc("table")`
  for whole documents and `paginationResultValidator` for paginated queries.
- Authorization is always derived server-side via `requireUser` / `requireRole` /
  `requireAdmin` from `convex/model/auth.ts`. Never trust a client-supplied
  identity. A client-supplied `userId` is fine only as the *target* of an admin
  action, never as the actor.
- Public lead submission goes through HTTP actions in `convex/http.ts`, not
  public mutations — a mutation cannot see the request IP, so it cannot be rate
  limited. `pickSubmission()` allow-lists fields so a caller cannot set
  `status`, `priority`, `tags` or `archived`.
- Every integration is env-gated and no-ops when unconfigured (Resend,
  Turnstile), so the app works end to end before keys exist.
- Statuses, roles and damage types are declared once in `convex/lib/constants.ts`
  and drive the schema unions and the UI.

## Frontend rules

- Next.js 16: `middleware.ts` is `proxy.ts` with a named `proxy` export.
  `params`/`searchParams` are async. Use the generated `LayoutProps<>` /
  `PageProps<>` types.
- Brand tokens are in the "Solden brand layer" block at the end of
  `app/globals.css`. `--brand-600` is the only green that carries white text at
  AA — use it for fills and links on white. `--brand-neon` is logo-true and
  restricted to accents on charcoal.
- Every page opens on a charcoal hero (`PageHero`), because `SiteHeader` renders
  transparent over it and only flips to its light "pill" state on scroll. A page
  with a light header area needs `<SiteHeader variant="solid" />`.
- Nav is data: `lib/nav.ts`.
- Images live in `public/images`, generated from the old site's originals by
  `raw-images/process.mjs` (sources are gitignored; `raw-images/urls.txt` makes
  it reproducible). `feature-paint.webp` is the only stock image.

## Commands

```
npm run dev          # next dev
npx convex dev       # watch + push backend
npx next build       # typechecks too
npx convex dashboard # open the Convex dashboard
```
