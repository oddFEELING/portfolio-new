# Experience Page — Design

**Date:** 2026-05-22
**Route:** `app/routes/experience.tsx`
**Status:** Approved design, ready for implementation plan

## Goal

Replace the placeholder content in `experience.tsx` with a detailed Work +
Education page that carries the home page's flush, boxy, minimalist aesthetic
through the rest of the platform.

## Scope

- **In:** Three work roles, two education entries, detailed per-role body
  content, per-role tech pills.
- **Out:** Projects (ChowBea Axios, Feature Adoption Analyser) — not on this
  page for now.

## Content status

Per-role detail (highlight bullets, scope, outcomes, tech lists) is **placeholder
/ random data** for this first pass. Every invented value MUST be marked in the
source so it can be tailored later (see "Placeholder marking" below). Factual
data from the resume (company names, roles, dates, locations, degrees, grades)
is real and must not be randomised.

### Real data (from resume)

| Company / School | Role / Degree | Period | Location |
|---|---|---|---|
| Zenning AI (formerly AllTheTables LTD) | Founding AI/Software Engineer · Full-time | 03/2025 – Present | London |
| Dataphyte UK | Software Engineer · Part-time | 01/2023 – 03/2025 | London |
| Dataphyte | Full-Stack Engineer · Full-time | 08/2021 – 01/2023 | Abuja |
| Teesside University | MSc Artificial Intelligence | 01/2023 – 01/2025 | Middlesbrough · Distinction |
| Bowen University | BSc Computer Science | 09/2016 – 05/2020 | Osun |

## Layout & behaviour

- The page owns its own scroll container: root element is
  `h-full overflow-y-auto`, because `_layout.tsx`'s `SidebarInset` is
  `overflow-hidden` and would otherwise clip long content.
- No fixed pixel heights — fluid, like the home page.
- Newest-first chronological order.

## Visual design (aesthetic carryover from home page)

- Flush bordered blocks with collapsed `-mb-px` seams so the page reads as one
  continuous bordered column.
- `hover:bg-muted/30` + `transition-colors` on interactive/entry blocks.
- Small uppercase muted labels for periods and locations.
- Boxy bento-style tech pills (same treatment as the home page tech stack:
  `border`, collapsed `-mr-px -mb-px` seams).
- `Highlighter` accent on the current role (Zenning AI).

## Structure (top to bottom)

1. **Header strip** — "Experience" title + one-line intro, padded like the
   landing sections (`px-4 py-3 md:px-6`).
2. **Work section** — three flush bordered `ExperienceBlock`s
   (Zenning AI → Dataphyte UK → Dataphyte). Each block:
   - Header row: company · role · period · location.
   - Body: highlight bullets (placeholder detail).
   - Flush row of boxy tech pills for that role (placeholder tech lists).
3. **Education section** — a labelled divider ("Education"), then two
   `EducationBlock`s (MSc AI · Teesside, BSc CS · Bowen) with degree, period,
   location, and grade.

## Components

- `ExperienceBlock` — one work role. Props: company, role, employmentType,
  period, location, isCurrent, highlights[], tech[].
- `EducationBlock` — one school. Props: school, degree, period, location, grade.
- Content lives in typed arrays at the bottom of `experience.tsx`, mirroring the
  `landing.tsx` pattern (`experience`, `marqueeItems`, etc.).
- If the blocks stay small they may remain inline in `experience.tsx`; extract to
  `app/components/` only if the file grows unwieldy.

## Placeholder marking

Every randomised value is marked so it is trivially greppable later:

- A file-level comment block listing all placeholder fields.
- Each placeholder array/field tagged with an inline `// PLACEHOLDER:` comment
  describing what real data should replace it.
- A single exported/searchable token `PLACEHOLDER` used consistently.

## Out of scope / future

- Tailoring placeholder detail to real experience (follow-up pass).
- Projects section.
- Any animation beyond the existing hover transitions.
