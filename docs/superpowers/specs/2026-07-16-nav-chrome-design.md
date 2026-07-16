# Nav chrome: breadcrumbs + left dock glyph

Date: 2026-07-16  
Status: approved for planning

## Goal

Fix dead path headers so users can navigate without the browser back button, and replace the scattered “Toggle Sidebar” controls with a shared left dock that feels like a light OS window chrome.

## Decisions

| Topic | Choice |
| --- | --- |
| Breadcrumb scope | Every page that shows a path-style header |
| Breadcrumb behavior | Ancestors link; current segment is plain text (`aria-current="page"`) |
| Sidebar control | Option C — dock glyph only (not full title bar, not classic — □ ✕ chrome) |
| Placement | Left edge of page chrome, shared across routes that currently toggle the sidebar |

## Breadcrumbs

### Behavior

- Render segments as mono uppercase path labels (keep current visual language).
- Ancestors are `<Link>`s; the last segment is not a link.
- Separators stay visual only (`/` or `&nbsp;/&nbsp;`), not interactive.
- Preview suffixes (e.g. `· Preview`) stay non-link metadata after the path.

### Examples

| Route | Segments |
| --- | --- |
| `/blog` | `Blog` (current) — optional home ancestor only if we already show a multi-segment path |
| `/blog/tag/:slug` | `Blog` → `/blog`, current = tag slug (no middle “Tag” link) |
| `/blog/:slug` | `Blog` → `/blog`, current = post slug |

### Implementation shape

- Shared component, e.g. `app/components/navigation/page-breadcrumbs.tsx`.
- Props: `items: { label: string; href?: string }[]` (href omitted = current).
- Replace inline path `<span>`s on blog index/tag/post (and any other path-style headers found during implementation).

## Left dock glyph (OS window vibe)

### Behavior

- Single shared control, e.g. `app/components/navigation/nav-dock.tsx`.
- Calls existing `useSidebar().toggleSidebar`.
- Label reflects state when practical: `OPEN NAV` when closed, `CLOSE NAV` when open (desktop); short label on small screens if needed.
- Keeps orange attention pulse (`nav-attn` / `nav-attn-text`) so it still reads as the nav affordance.

### Visual

- Slim vertical dock on the **left** of the page chrome.
- Top: three traffic-light dots (decorative, not window controls — no close/minimize behavior).
- Middle: glyph pad (`≡` or small grid mark).
- Below/along: vertical mono label.
- No full-window title bar; no — □ ✕ buttons.
- Contact page’s existing left strip is replaced by this shared dock for consistency.

### Placement

- Used on every route that currently exposes a sidebar toggle (landing, blog, blog tag, blog post, projects, experience, open-source, contact, etc.).
- Prefer composing dock + breadcrumbs in each page header (or a thin shared header wrapper if that stays simple) without a sudden layout rewrite of `_layout.tsx`.

## Accessibility

- Dock is a real `<button type="button">` with `aria-label` (and `aria-expanded` if sidebar open state is available).
- Breadcrumb nav uses `<nav aria-label="Breadcrumb">` and `aria-current="page"` on the current item.
- Decorative traffic lights are `aria-hidden`.

## Out of scope

- Full Mac-style title bar wrapping the whole app (mockup A).
- Classic desktop window chrome with — □ ✕ (mockup B).
- Changing sidebar contents, routing, or Sanity preview behavior.
- Keyboard shortcut changes beyond what `SidebarProvider` already supports.

## Acceptance

1. On blog post and tag pages, clicking `Blog` navigates to `/blog`.
2. Current crumb is not a link and announces as current page.
3. Old right-edge “Toggle Sidebar” strips are gone from pages that adopt the dock.
4. Left dock opens/closes the sidebar on desktop and mobile sheet.
5. Visual language stays flush/mono with orange accent — no new card chrome.
