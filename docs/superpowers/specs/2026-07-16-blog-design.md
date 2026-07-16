# Blog Platform — Design

**Date:** 2026-07-16  
**Routes:** `/blog`, `/blog/:slug`, `/blog/tag/:slug`  
**CMS:** Sanity (`studio/`, project `frur52ku`, dataset `production`)  
**Status:** Approved design, ready for implementation plan

## Goal

Replace the `/blog` Coming Soon placeholder with a Sanity-powered engineering blog: write in Studio, read on the portfolio site, with tags, SEO, related posts, and (later) visual editing — matching the existing flush, boxy aesthetic.

## Scope

### In (phased)

**Phase 1 — Publishing core**
- Full Studio content model (schema defined up front)
- Sanity client + split loader wiring in the React Router app
- `/blog` index (real posts, real count)
- `/blog/:slug` article page with Portable Text rendering
- SEO meta from Sanity fields (with fallbacks)
- Sitemap integration for blog URLs

**Phase 2 — Discovery**
- Tag chips + filter on `/blog`
- `/blog/tag/:slug` tag archive pages
- Hybrid related posts on article pages

**Phase 3 — Editing UX**
- Presentation tool + draft mode / visual editing overlays
- No content-model changes expected

### Out

- Comments, full-text search, RSS, newsletter
- Multi-author workflows
- Categories (tags only)
- Redesigning the rest of the portfolio around the blog

## Approach

**Full schema upfront, UI in phases.** Model `post`, singleton `author`, `tag`, rich body blocks, SEO, and related-post fields in Studio immediately so content can be written early. Ship frontend capabilities in the three phases above. Avoids schema churn and content migrations later.

## Content model (Studio)

### `author` (singleton)

| Field | Notes |
|---|---|
| `name` | Required |
| `slug` | Required |
| `shortBio` | Short text |
| `avatar` | Image with hotspot |
| `socials` | Optional links (label + url) |

Pinned as a single document via Studio Structure (no author list).

### `tag`

| Field | Notes |
|---|---|
| `title` | Required |
| `slug` | Required |
| `description` | Optional; shown on tag pages |

### `post`

| Field | Notes |
|---|---|
| `title` | Required |
| `slug` | Required, unique |
| `publishedAt` | Datetime; required to appear on site |
| `excerpt` | Short summary for index / meta fallback |
| `coverImage` | Image with hotspot + alt |
| `author` | Reference → singleton author |
| `tags` | Array of tag references |
| `body` | Portable Text (see blocks below) |
| `seo` | Object: `metaTitle`, `metaDescription`, `ogImage` |
| `relatedPosts` | Optional array of post references (manual picks) |

### Portable Text blocks (`body`)

- Standard: H2/H3, paragraphs, lists, links, inline code
- Images (with alt)
- Code blocks (`language` + `code`)
- Callouts (`note` | `tip` | `warning` + body)
- Tables
- Embeds: YouTube + generic URL embed (e.g. CodeSandbox); invalid URLs fall back to a plain link

### Studio structure

- **Posts** — document list
- **Tags** — document list
- **Author** — singleton
- Vision tool retained for GROQ

## Architecture

### Studio

- Remains standalone under `studio/`
- Schemas in `studio/schemaTypes/`
- Deploy schema via Sanity CLI (`sanity schema deploy` / studio deploy as needed)
- Do not use MCP `deploy_schema` while local Studio files exist

### Frontend Sanity layer (`app/sanity/`)

- Browser-safe env: `projectId`, `dataset`, `apiVersion`, studio URL (`VITE_*`)
- Server-only read token in `*.server.ts` (never imported from client-reachable modules)
- Split loader pattern (`@sanity/client` + `@sanity/react-loader`) so phase 3 visual editing attaches without a rewrite
- GROQ queries colocated; TypeGen in the implementation plan

### Routes

| Route | Purpose | Phase |
|---|---|---|
| `/blog` | Post index | 1 |
| `/blog/:slug` | Single post | 1 |
| `/blog/tag/:slug` | Tag archive | 2 |

Index tag filtering (chips) lands in phase 2 alongside tag pages.

### Data flow

1. Route `loader` fetches published content via GROQ
2. Page renders list or Portable Text body + image URL builder
3. `meta()` uses `seo.*` with fallbacks: title → post title; description → excerpt; OG → `seo.ogImage` → cover → site default
4. Phase 3: Presentation + draft mode reuse the same loaders

Published filter: only documents with `publishedAt` set, excluding drafts in production.

## UI

Preserve the portfolio’s flush, boxy, mono-accent language (same family as Projects / current blog Coming Soon). Not a generic card-grid blog.

### `/blog`

- Header: `BLOG` + live post count
- Vertical list: title, date, excerpt, tag chips
- Cover images optional when present (no forced card grid)
- Empty state: short “No posts yet” once the route is live (Coming Soon removed)

### `/blog/:slug`

- Title, date, author line, tags
- Cover image within the content column (not a floating card)
- Readable measure; clear H2/H3 hierarchy
- Custom Portable Text components for code, callouts, tables, embeds
- Related posts footer (phase 2)

### `/blog/tag/:slug`

- Same list treatment as the index, scoped to the tag
- Tag title + optional description at top

### Motion

Light list/title motion only if it already fits the system. No heavy theater on long articles.

## Related posts (phase 2)

Resolve up to 3 related posts:

1. Manual `relatedPosts` if set  
2. Else posts sharing any tag, newest first, exclude self  
3. Else newest posts overall, exclude self  

## Edge cases

- Unknown slug → 404
- Missing cover/OG → graceful fallback, page still renders
- Broken embed → render as link, not an empty block
- Post with no tags → renders; related uses recent-posts fallback when needed
- Empty index → empty state, not Coming Soon

## Phase 3 — Visual editing

- Presentation tool in Studio pointed at the React Router app
- Draft mode + overlays via existing split loaders
- No schema changes expected

## Verification

- Sample post in Studio exercising each body block type; confirm frontend render
- Loaders: empty index, valid post, unknown slug → 404
- SEO: post with and without `seo` overrides
- Tag filter and `/blog/tag/:slug` return the same post set for a given tag
- Related: manual-only, tag-fallback, and recent-fallback cases

## Success criteria

- You can write and publish a real post in Studio and see it on `/blog` and `/blog/:slug`
- Tags, SEO, and related posts work as specified by end of phase 2
- Visual editing works against the live site by end of phase 3
- Visual language stays consistent with the rest of the portfolio
