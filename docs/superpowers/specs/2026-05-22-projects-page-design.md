# Projects Page — Design

**Date:** 2026-05-22
**Route:** `app/routes/projects.tsx` (new)
**Status:** Approved design, ready for implementation plan

## Goal

Add a `/projects` page presenting Emmanuel's projects as expandable blocks, in
the same flush, boxy aesthetic as the rest of the platform. Nubia ships with a
full long-form write-up; Feature Adoption Analyser ships with marked placeholder
content.

## Scope

- **In:** New `/projects` route, sidebar nav entry, a typed project content
  module, expandable project blocks, and a landing-page update.
- **Out:** Open-source projects (ChowBea Axios is excluded entirely).
  Per-project detail routes (single page, inline expansion instead).

## Projects included

| Project | Period | Context | Write-up |
|---|---|---|---|
| Nubia | 2022 — Present | Dataphyte | Full (provided) |
| Feature Adoption Analyser | — | Zenning AI | PLACEHOLDER (to be tailored later) |

### Nubia facts (real)

- AI platform for African data journalism, begun in 2022 during a Journalism AI
  Fellowship at Polis (LSE), built in partnership with Joshua Olufemi.
- Built with Dataphyte. Partnerships: Archivi.ng, Daily Trust, Business Day.
- Links:
  - LSE Polis blog post — `https://blogs.lse.ac.uk/polis/2022/10/04/nubia-the-call-the-crawl-and-the-counsels/`
  - Project site — `https://nubia.ai/`
- Write-up has an untitled intro plus five titled sections:
  1. Ingestion is the actual hard problem
  2. Generation has to earn its place in the newsroom
  3. Architecture follows infrastructure
  4. The data isn't just messy, it's contested
  5. What's missing from the conversation
- The full verbatim write-up text is supplied by the user and will be embedded
  in the implementation plan.

### Feature Adoption Analyser

- Real summary (from landing page): "A tool that analyses feature-adoption rates
  and recommends actions to improve uptake across the product."
- Context: Zenning AI.
- `writeUp` is a single `// PLACEHOLDER:`-marked section until the user provides
  a real write-up. The `PLACEHOLDER` token must be greppable.

## Architecture

### Files

- **Create `app/data/projects.ts`** — typed project content. Keeps the long
  Nubia essay out of the route file so `projects.tsx` stays focused on
  rendering.
- **Create `app/routes/projects.tsx`** — the route: header strip + project list
  rendering, expansion state.
- **Modify `app/routes.ts`** — register `/projects` inside the `_layout`.
- **Modify the sidebar** (`app/components/navigation/*`) — add a "Projects" nav
  entry following the existing nav-data pattern.
- **Modify `app/routes/landing.tsx`** — drop ChowBea Axios from the `experience`
  array; make `kind: "Project"` entries navigate to `/projects` on click.

### Data model (`app/data/projects.ts`)

```ts
type WriteUpSection = {
  heading?: string;        // omitted for the intro section
  paragraphs: string[];
};

type ProjectLink = {
  label: string;
  href: string;
};

type Project = {
  slug: string;            // stable key, e.g. "nubia"
  name: string;
  period: string;
  context: string;         // e.g. "Dataphyte"
  summary: string;         // one-line, shown collapsed
  links: ProjectLink[];
  writeUp: WriteUpSection[];
};
```

Exports an ordered `projects: Project[]` (Nubia first).

## Page structure & behaviour

- Root: `<div className="h-full overflow-y-auto">`.
- **Header strip** — "Projects" title + one-line intro, padded like the other
  pages (`px-4 py-3 md:px-6`). Simple strip, not split.
- **Project list** — a stack of flush bordered blocks (`border-b`). Each block:
  - Collapsed view: project `name`, `period · context` uppercase meta, `summary`
    line, the `links`, and an expand chevron.
  - Uses the existing `Collapsible` UI component
    (`@/components/ui/collapsible`) for inline expansion.
  - Expanded view: the `writeUp` rendered as a readable prose column —
    each section's optional `heading` then its `paragraphs`.
- Expansion is per-block and independent (multiple may be open). The chevron
  rotates to indicate state.
- External links open in a new tab (`target="_blank" rel="noreferrer"`); their
  clicks must not toggle the collapsible.

## Aesthetic

Carry over from the home/experience pages: flush bordered blocks, collapsed
seams, `hover:bg-muted/30` + `transition-colors` on the collapsed block,
small uppercase muted meta labels.

## Landing page change

- Remove the ChowBea Axios entry from the `experience` array in `landing.tsx`.
- For entries with `kind: "Project"`, the rendered block becomes an interactive
  element that navigates to `/projects` (React Router `Link`/`useNavigate`).
- `kind: "Work"` entries remain static (non-clickable).

## Placeholder marking

- Feature Adoption Analyser's `writeUp` content carries an inline
  `// PLACEHOLDER:` comment and self-identifying `Placeholder:` body text.
- A short comment at the top of `app/data/projects.ts` notes which content is
  real vs. placeholder.

## Out of scope / future

- Feature Adoption Analyser real write-up (follow-up pass).
- Per-project permalink routes.
- Images / media in write-ups.
