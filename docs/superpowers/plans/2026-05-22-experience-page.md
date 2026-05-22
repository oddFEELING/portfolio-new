# Experience Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the placeholder `experience.tsx` with a detailed Work + Education page that carries the home page's flush, boxy, minimalist aesthetic.

**Architecture:** A single self-scrolling route file (`app/routes/experience.tsx`) following the `landing.tsx` pattern — two small inline block components (`ExperienceBlock`, `EducationBlock`) plus typed content arrays at the bottom. The page owns its own scroll container because `_layout.tsx`'s `SidebarInset` is `overflow-hidden`. All invented detail is marked with `// PLACEHOLDER:` comments and a greppable `PLACEHOLDER` token.

**Tech Stack:** React 19, React Router 7, TypeScript, Tailwind v4, `@tabler/icons-react`, the existing `Highlighter` UI component.

**Verification:** This project has no test runner. Each task is verified with `bun run typecheck` (must be clean for `experience.tsx`) and a visual check via `bun dev` at `/experience`. Each task ends with a commit.

---

## File Structure

- **Modify (full rewrite):** `app/routes/experience.tsx` — the entire page: types, two block components, the page component, and content arrays.

No new files. Blocks stay inline because they are small and only used here, matching the `landing.tsx` convention.

---

### Task 1: Page shell, types, and scroll container

Replace the placeholder file with the scrollable shell, type definitions, real (resume) data, and a header strip. Sections render but are empty.

**Files:**
- Modify: `app/routes/experience.tsx` (full rewrite)

- [ ] **Step 1: Rewrite `experience.tsx` with the shell**

Replace the entire contents of `app/routes/experience.tsx` with:

```tsx
import { Highlighter } from "@/components/ui/highlighter";
import type { Route } from "./+types/experience";

/**
 * PLACEHOLDER NOTICE
 * ------------------
 * Company names, roles, employment types, dates, locations, degrees and
 * grades are REAL (from the resume). Every other detail — highlight bullets
 * and per-role tech lists — is invented placeholder data. Search this file
 * for `PLACEHOLDER` to find every value that must be tailored later.
 */

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Experience — Emmanuel Alawode" },
    {
      name: "description",
      content: "Work history and education of Emmanuel Alawode.",
    },
  ];
}

type WorkItem = {
  company: string;
  role: string;
  employmentType: string;
  period: string;
  location: string;
  isCurrent: boolean;
  highlights: string[];
  tech: string[];
};

type EducationItem = {
  school: string;
  degree: string;
  period: string;
  location: string;
  grade?: string;
};

export default function Experience() {
  return (
    <div className="h-full overflow-y-auto">
      <header className="border-b px-4 py-3 md:px-6">
        <h1 className="font-semibold text-2xl">Experience</h1>
        <p className="text-muted-foreground text-sm">
          The roles I&apos;ve held and where I studied.
        </p>
      </header>

      <section>
        {workExperience.map((item) => (
          <article className="border-b px-4 py-5 md:px-6" key={item.company}>
            {item.company}
          </article>
        ))}
      </section>

      <div className="border-b bg-muted/30 px-4 py-2 md:px-6">
        <span className="text-muted-foreground text-xs uppercase tracking-wide">
          Education
        </span>
      </div>

      <section>
        {education.map((item) => (
          <article className="border-b px-4 py-5 md:px-6" key={item.school}>
            {item.school}
          </article>
        ))}
      </section>
    </div>
  );
}

// ~ ======= Content ======= ~

const workExperience: WorkItem[] = [
  {
    company: "Zenning AI",
    role: "Founding AI/Software Engineer",
    employmentType: "Full-time",
    period: "Mar 2025 — Present",
    location: "London",
    isCurrent: true,
    // PLACEHOLDER: highlight bullets below are invented — replace with real detail
    highlights: [
      "Placeholder: led architecture of the core AI chat workspace.",
      "Placeholder: built the integrations directory connecting 50+ systems.",
      "Placeholder: automated integration testing, cutting deploy errors 30%.",
    ],
    // PLACEHOLDER: tech list is inferred — confirm or correct
    tech: ["React", "TypeScript", "NestJS", "Node", "AWS", "Docker"],
  },
  {
    company: "Dataphyte UK",
    role: "Software Engineer",
    employmentType: "Part-time",
    period: "Jan 2023 — Mar 2025",
    location: "London",
    isCurrent: false,
    // PLACEHOLDER: highlight bullets below are invented — replace with real detail
    highlights: [
      "Placeholder: built a real-time financial dashboard for unit economics.",
      "Placeholder: developed an AI research tool for structured insights.",
      "Placeholder: drove coding standards that reduced bugs by 40%.",
    ],
    // PLACEHOLDER: tech list is inferred — confirm or correct
    tech: ["React", "TypeScript", "Next.js", "Node"],
  },
  {
    company: "Dataphyte",
    role: "Full-Stack Engineer",
    employmentType: "Full-time",
    period: "Aug 2021 — Jan 2023",
    location: "Abuja",
    isCurrent: false,
    // PLACEHOLDER: highlight bullets below are invented — replace with real detail
    highlights: [
      "Placeholder: replaced static charts with interactive D3 visualisations.",
      "Placeholder: built automated web-scraping tools for time-sensitive data.",
      "Placeholder: led end-to-end feature development on the core product.",
    ],
    // PLACEHOLDER: tech list is inferred — confirm or correct
    tech: ["JavaScript", "React", "D3", "Node"],
  },
];

const education: EducationItem[] = [
  {
    school: "Teesside University",
    degree: "MSc Artificial Intelligence",
    period: "Jan 2023 — Jan 2025",
    location: "Middlesbrough",
    grade: "Distinction",
  },
  {
    school: "Bowen University",
    degree: "BSc Computer Science",
    period: "Sep 2016 — May 2020",
    location: "Osun",
  },
];
```

Note: `Highlighter` is imported now but used in Task 2; if the linter flags an unused import between tasks, that resolves in Task 2.

- [ ] **Step 2: Typecheck**

Run: `bun run typecheck 2>&1 | grep -i experience || echo "experience.tsx: clean"`
Expected: `experience.tsx: clean`

- [ ] **Step 3: Visual check**

Run `bun dev`, open `/experience`. Expected: a scrollable page with an "Experience" header strip, three rows showing company names, an "Education" divider, and two rows showing school names.

- [ ] **Step 4: Commit**

```bash
git add app/routes/experience.tsx
git commit -m "feat: experience page shell with work and education data"
```

---

### Task 2: ExperienceBlock component

Add the `ExperienceBlock` component and render the work section with it — header row, highlight bullets, and boxy tech pills.

**Files:**
- Modify: `app/routes/experience.tsx`

- [ ] **Step 1: Add the `ExperienceBlock` component**

Insert this component immediately above the `Experience` default export (after the `EducationItem` type):

```tsx
function ExperienceBlock({ item }: { item: WorkItem }) {
  return (
    <article className="border-b px-4 py-5 transition-colors duration-300 hover:bg-muted/30 md:px-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-semibold text-lg">{item.company}</h2>
        <span className="text-muted-foreground text-xs uppercase tracking-wide">
          {item.period} · {item.location}
        </span>
      </div>

      <p className="mt-0.5 text-muted-foreground text-sm">
        {item.isCurrent ? (
          <Highlighter action="underline" color="#FF9800" strokeWidth={2}>
            {item.role}
          </Highlighter>
        ) : (
          item.role
        )}{" "}
        · {item.employmentType}
      </p>

      <ul className="mt-3 flex flex-col gap-1.5">
        {item.highlights.map((highlight) => (
          <li
            className="text-foreground/90 text-sm leading-relaxed"
            key={highlight}
          >
            {highlight}
          </li>
        ))}
      </ul>

      <div className="-ml-px mt-4 flex flex-wrap">
        {item.tech.map((tech) => (
          <span
            className="-mr-px -mb-px border px-2.5 py-1 text-muted-foreground text-xs"
            key={tech}
          >
            {tech}
          </span>
        ))}
      </div>
    </article>
  );
}
```

- [ ] **Step 2: Render the work section with `ExperienceBlock`**

In the `Experience` component, replace the first `<section>` block:

```tsx
      <section>
        {workExperience.map((item) => (
          <article className="border-b px-4 py-5 md:px-6" key={item.company}>
            {item.company}
          </article>
        ))}
      </section>
```

with:

```tsx
      <section>
        {workExperience.map((item) => (
          <ExperienceBlock item={item} key={item.company} />
        ))}
      </section>
```

- [ ] **Step 3: Typecheck**

Run: `bun run typecheck 2>&1 | grep -i experience || echo "experience.tsx: clean"`
Expected: `experience.tsx: clean`

- [ ] **Step 4: Visual check**

Reload `/experience`. Expected: each work role shows company + period/location on one row, the role line (Zenning AI's role underlined via Highlighter), three highlight bullets, and a flush row of boxy tech pills. Hovering a block tints it `muted/30`.

- [ ] **Step 5: Commit**

```bash
git add app/routes/experience.tsx
git commit -m "feat: render work experience blocks with detail and tech pills"
```

---

### Task 3: EducationBlock component

Add the `EducationBlock` component and render the education section with it.

**Files:**
- Modify: `app/routes/experience.tsx`

- [ ] **Step 1: Add the `EducationBlock` component**

Insert this component immediately above the `Experience` default export (after `ExperienceBlock`):

```tsx
function EducationBlock({ item }: { item: EducationItem }) {
  return (
    <article className="border-b px-4 py-5 transition-colors duration-300 hover:bg-muted/30 md:px-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-semibold text-lg">{item.school}</h2>
        <span className="text-muted-foreground text-xs uppercase tracking-wide">
          {item.period} · {item.location}
        </span>
      </div>
      <p className="mt-0.5 text-muted-foreground text-sm">
        {item.degree}
        {item.grade ? ` · ${item.grade}` : ""}
      </p>
    </article>
  );
}
```

- [ ] **Step 2: Render the education section with `EducationBlock`**

In the `Experience` component, replace the second `<section>` block:

```tsx
      <section>
        {education.map((item) => (
          <article className="border-b px-4 py-5 md:px-6" key={item.school}>
            {item.school}
          </article>
        ))}
      </section>
```

with:

```tsx
      <section>
        {education.map((item) => (
          <EducationBlock item={item} key={item.school} />
        ))}
      </section>
```

- [ ] **Step 3: Typecheck**

Run: `bun run typecheck 2>&1 | grep -i experience || echo "experience.tsx: clean"`
Expected: `experience.tsx: clean`

- [ ] **Step 4: Visual check**

Reload `/experience`. Expected: below the "Education" divider, two blocks — "Teesside University · MSc Artificial Intelligence · Distinction" and "Bowen University · BSc Computer Science" — each with period/location, hover tint matching the work blocks.

- [ ] **Step 5: Commit**

```bash
git add app/routes/experience.tsx
git commit -m "feat: render education blocks on experience page"
```

---

### Task 4: Placeholder audit and final verification

Confirm every invented value is greppable and the page is consistent.

**Files:**
- Modify: `app/routes/experience.tsx` (only if the audit finds an unmarked placeholder)

- [ ] **Step 1: Grep for placeholder markers**

Run: `grep -n "PLACEHOLDER" app/routes/experience.tsx`
Expected: the file-level `PLACEHOLDER NOTICE` comment plus one `// PLACEHOLDER:` comment per `highlights` array and one per `tech` array (7 inline markers total: 3 highlights + 3 tech + the notice... i.e. at least 7 lines).

- [ ] **Step 2: Confirm placeholder bullet text is self-identifying**

Run: `grep -c "Placeholder:" app/routes/experience.tsx`
Expected: `9` (three highlight bullets per role × three roles). If any invented bullet lacks the `Placeholder:` prefix, add it.

- [ ] **Step 3: Full typecheck**

Run: `bun run typecheck 2>&1 | grep -i experience || echo "experience.tsx: clean"`
Expected: `experience.tsx: clean`

- [ ] **Step 4: Full-page visual check**

Run `bun dev`, open `/experience`. Confirm: page scrolls within the sidebar inset (does not clip), the boxy flush aesthetic matches the home page, and no placeholder is left visually ambiguous.

- [ ] **Step 5: Commit (only if Step 1 or 2 required a fix)**

```bash
git add app/routes/experience.tsx
git commit -m "chore: ensure all placeholder data is marked on experience page"
```

If no fix was needed, skip this commit.

---

## Self-Review Notes

- **Spec coverage:** Work + Education scope ✓ (Tasks 2, 3). Self-scrolling container ✓ (Task 1, `h-full overflow-y-auto`). Flush boxy aesthetic ✓ (`border-b`, collapsed `-mr-px -mb-px` pills, `hover:bg-muted/30`). `Highlighter` on current role ✓ (Task 2). Header strip ✓ (Task 1). Education divider ✓ (Task 1). Placeholder marking ✓ (Task 1 comments + Task 4 audit). Projects correctly excluded ✓.
- **Type consistency:** `WorkItem` / `EducationItem` defined in Task 1 and consumed unchanged in Tasks 2–3. Component prop shape `{ item }` consistent across `ExperienceBlock` and `EducationBlock`.
- **No test runner:** TDD steps replaced with typecheck + visual verification, consistent with the project's tooling (Biome/Ultracite + `tsc`).
