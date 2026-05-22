# Projects Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/projects` page that presents projects as flush, expandable blocks — Nubia with a full long-form write-up, Feature Adoption Analyser with marked placeholder content.

**Architecture:** Project content lives in a typed `app/data/projects.ts` module so the long Nubia essay stays out of the route file. `app/routes/projects.tsx` renders a header strip and a stack of bordered blocks, each using the existing `Collapsible` UI component for inline expansion. The route is registered in `app/routes.ts`. The landing page drops the open-source project and links its remaining project entries to `/projects`.

**Tech Stack:** React 19, React Router 7, TypeScript, Tailwind v4, `@tabler/icons-react`, `@/components/ui/collapsible` (Radix-backed).

**Verification:** This project has no test runner. Each task is verified with `bun run typecheck` (must be clean for the touched files) and a visual check via `bun dev`. Each task ends with a commit.

**Note on the sidebar:** the `/projects` nav entry already exists in `app/components/navigation/app.sidebar.tsx` — no sidebar change is needed. Task 4 verifies this.

**Note on text:** the Nubia write-up below is the user's prose with a few unambiguous typos tidied ("no kinda" → "no kinder", "LLm" → "LLM", "as about" → "as much about", "for majority" → "for the majority", stray double spaces removed). Reproduce the strings in this plan verbatim.

---

## File Structure

- **Create:** `app/data/projects.ts` — typed `Project` model + the `projects` array (Nubia content, FAA placeholder).
- **Create:** `app/routes/projects.tsx` — the `/projects` route: header strip, project list, collapsible blocks.
- **Modify:** `app/routes.ts` — register the `/projects` route inside the `_layout`.
- **Modify:** `app/routes/landing.tsx` — drop ChowBea Axios; link `kind: "Project"` entries to `/projects`.

---

### Task 1: Project content module

Create the typed content module with the `Project` model, the full Nubia write-up, and the placeholder Feature Adoption Analyser entry.

**Files:**
- Create: `app/data/projects.ts`

- [ ] **Step 1: Create `app/data/projects.ts`**

Create `app/data/projects.ts` with exactly this content:

```ts
/**
 * Project content.
 *
 * Nubia's metadata and write-up are REAL (provided by the user). The
 * Feature Adoption Analyser write-up is PLACEHOLDER — search this file for
 * `PLACEHOLDER` to find the content that must be tailored later.
 */

export type WriteUpSection = {
  heading?: string;
  paragraphs: string[];
};

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  name: string;
  period: string;
  context: string;
  summary: string;
  links: ProjectLink[];
  writeUp: WriteUpSection[];
};

export const projects: Project[] = [
  {
    slug: "nubia",
    name: "Nubia",
    period: "2022 — Present",
    context: "Dataphyte",
    summary:
      "Building AI for African data journalism means solving problems the mainstream AI conversation ignores.",
    links: [
      {
        label: "LSE Polis write-up",
        href: "https://blogs.lse.ac.uk/polis/2022/10/04/nubia-the-call-the-crawl-and-the-counsels/",
      },
      { label: "nubia.ai", href: "https://nubia.ai/" },
    ],
    writeUp: [
      {
        paragraphs: [
          `In 2022, during a Journalism AI Fellowship at Polis, I partnered with Joshua Olufemi to begin building Nubia, an AI platform for African data journalism. What began as conditional algorithms and SpaCy NLP routines wired into a templating engine has grown, over four years, into a production system in partnerships with Archivi.ng, Daily Trust, and Business Day, training on corpora that very little of the dominant AI tooling has ever seen.`,
          `I designed and built its technical foundation: a Next.js frontend on a microservice backend running an agentic architecture, a hosted LLM service, and a vector store designed around how journalists actually use sources. The first dataset we tried to load was a procurement filing from a Nigerian state government, a 200-page scanned PDF in which the numbers we needed sat inside a table printed, signed and rescanned enough times that the digits had started to bleed into each other.`,
          `The dominant AI-for-journalism conversation, then and now, is largely about generation. The implicit assumption is that you have structured data, or at minimum, clean text. For the newsrooms we were building for, that assumption was almost never true. The hard problems were upstream of generation, and they stayed upstream no matter the generative model used.`,
        ],
      },
      {
        heading: "Ingestion is the actual hard problem",
        paragraphs: [
          `In Nubia's architecture, the model is one service among several, and one that took the most engineering thought. The real product is the orchestration that happens before the model is put to work.`,
          `The Archivi.ng partnership meant working with Nigerian newspaper archives back to 1960; varying scan quality, columns that break across pages, body text interleaved with images. Day-to-day inputs were no kinder: budget tables photographed at press conferences, audio testimonies in native dialect, election results exported from systems built in the early 2000s.`,
          `Fine-tuning an open-source model on the historical corpus was a serious option, but continuous fine-tuning meant continuous infrastructural upkeep in a field where the methodologies changed faster than we could re-train. We chose a knowledge base path instead; keep the corpus stable, swap the model behind it as the field moves. The cost was Optical Character Recognition's (OCR) blind spot. In newsprint, paragraphs are often held together contextually by the images alongside them, and OCR strips that out.`,
          `Documents pass through a sequential transformation pipeline before they reach the vector store. Each chunk gets a context extractor, a title, a summary, keywords and entities, and a set of questions the chunk could answer. All of it gets embedded with the chunk, so retrieval is not just semantic similarity against raw text but a query against meaning the pipeline has already drawn out.`,
          `The deeper lesson is about posture. The temptation, when you're solving a problem the wider industry isn't looking at, is to branch off and build everything yourself. That path is a trap. Industry's innovation wave is the most powerful tailwind you have. Ride it for what it gives you, and spend your engineering only where it doesn't reach. For Nubia, that meant ingestion.`,
        ],
      },
      {
        heading: "Generation has to earn its place in the newsroom",
        paragraphs: [
          `The default voice of every major language model is North American business English. It's polite, it's even, and it's wrong for a Lagos investigative desk, a Nairobi data team, or a Kampala radio newsroom. Generic LLM prose doesn't just fail because it's bland; it fails because the register is culturally located somewhere else. And the journalist on the receiving end has to write the draft into a voice their readers actually trust.`,
          `The temptation is to solve this with longer prompts. We tried, and prompts don't carry the weight. What works better is treating the newsroom's existing archive as the source of truth for voice, retrieving from it not just for facts but for tone, sentence rhythm, framing conventions, the local register that makes a piece sound like it belongs in that paper. Nubia draws on the same corpus for voice as for content, which is why the Archivi.ng, Daily Trust, and Business Day partnerships matter beyond their value as historical or factual sources, they're also training the model in how Nigerian journalism actually sounds.`,
          `"Newsroom-grade" is not a single thing. The dominant AI conversation treats voice as a styling problem solved by a system prompt. For newsrooms outside the anglophone-Western mainstream, voice is closer to a retrieval problem, and the data you train on shapes it more than the instructions you give.`,
        ],
      },
      {
        heading: "Architecture follows infrastructure",
        paragraphs: [
          `Building for African newsrooms is not building for Western newsrooms scaled down. The constraints are different, and they push back on every architectural decision.`,
          `Routing every query through a paid frontier model was not survivable at the cost structure our newsrooms could bear, particularly for smaller and grassroots outlets where Nubia's value proposition depends on producing data stories at a fraction of traditional cost. So Nubia runs a hosted Llama 4 series model for the majority of quick AI tasks, with the frontier model reserved for the work that genuinely needs it. The distributed-systems split is as much about cost control as it is about scaling; keep the expensive operations behind queues, run the cheap ones close to the user. The architecture is the budget.`,
          `Latency matters in ways the dominant conversation underestimates. A journalist working in the field, often on a phone, on intermittent connectivity, cannot wait through a thirty-second round-trip to a model provider on another continent. So inference has to live close enough to be usable, retrieval has to degrade gracefully, and the system has to assume the connection will drop mid-query and the user will resume later from a different device.`,
          `Infrastructure is not a deployment detail you sort out at the end. It is an upstream design constraint that determines which models you can use, which features you can offer, and which journalists you can actually serve. A system designed on the assumption of cheap tokens, fast networks, and uninterrupted sessions will quietly exclude the newsrooms that need it most. The teams that build for these contexts don't get to choose between good architecture and accessible architecture; they have to make the architectural choices that make accessibility possible.`,
        ],
      },
      {
        heading: "The data isn't just messy, it's contested",
        paragraphs: [
          `Beneficial ownership records, procurement filings, election results — the data African investigative journalism actually runs on — exist in fragmented and often disputed form. A procurement filing may be authentic, leaked, redacted, or fabricated. A government dataset may be the official version or the one published before a quiet correction. Sources disagree, portals disappear, records get released, retracted, or never published at all.`,
          `For an AI tool expected to produce defensible journalism on top of these sources, this changes the design problem. The risk isn't generic hallucination, it's the model confidently asserting something the underlying source doesn't actually support, in a context where that assertion goes to print under the publication's name. The cost of being wrong here is a correction at best, a retraction at worst, and a story that misleads the public in the cases that don't get caught.`,
          `We made provenance a first-class part of retrieval, not a feature bolted on later. Every claim Nubia surfaces is traceable to the chunk that supports it, and the journalist using it can verify the chunk against the original source before anything goes to publication. The model is allowed to draft. It is not allowed to assert. The boundary is enforced in the architecture, not just the prompt, because boundaries enforced only in prompts are boundaries that fail under pressure.`,
          `Responsible AI for journalism in this context cannot be a question of model behaviour alone. It has to be a question of what the surrounding system makes verifiable, and what it makes the journalist confirm before anything leaves the building.`,
        ],
      },
      {
        heading: "What's missing from the conversation",
        paragraphs: [
          `The AI-in-journalism conversation has become a conversation about prompts and models. For the newsrooms most of the world's journalists work in, the harder questions are about the data on the way in, the voice that comes out, the infrastructure underneath, and the verification that surrounds it. Four years of Nubia have not made me less interested in generation. They have made me certain that for AI to genuinely serve African newsrooms, the work that matters most is the work that nobody is writing marketing copy about.`,
        ],
      },
    ],
  },
  {
    slug: "feature-adoption-analyser",
    name: "Feature Adoption Analyser",
    period: "2025",
    context: "Zenning AI",
    summary:
      "A tool that analyses feature-adoption rates and recommends actions to improve uptake across the product.",
    links: [],
    writeUp: [
      {
        // PLACEHOLDER: Feature Adoption Analyser write-up — replace with real detail
        paragraphs: [
          "Placeholder: a full write-up for the Feature Adoption Analyser is coming soon. It will cover how the tool measures feature adoption, the recommendation system behind its suggested actions, and the impact it had on product uptake at Zenning AI.",
        ],
      },
    ],
  },
];
```

- [ ] **Step 2: Typecheck**

Run: `bun run typecheck 2>&1 | grep -i "data/projects" || echo "projects.ts: clean"`
Expected: `projects.ts: clean`

- [ ] **Step 3: Commit**

```bash
git add app/data/projects.ts
git commit -m "feat: add projects content module with Nubia write-up"
```

---

### Task 2: Projects route

Create the `/projects` route file and register it. The page renders a header strip and a stack of collapsible project blocks.

**Files:**
- Create: `app/routes/projects.tsx`
- Modify: `app/routes.ts`

- [ ] **Step 1: Register the route in `app/routes.ts`**

Replace the entire contents of `app/routes.ts` with:

```ts
import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    index("routes/landing.tsx"),
    route("/experience", "routes/experience.tsx"),
    route("/projects", "routes/projects.tsx"),
    route("/operating-system", "routes/operating-system.tsx"),
  ]),
] satisfies RouteConfig;
```

- [ ] **Step 2: Create `app/routes/projects.tsx`**

Create `app/routes/projects.tsx` with exactly this content:

```tsx
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { IconChevronDown } from "@tabler/icons-react";
import type { Route } from "./+types/projects";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Projects — Emmanuel Alawode" },
    {
      name: "description",
      content: "Selected projects built by Emmanuel Alawode.",
    },
  ];
}

function ProjectBlock({ project }: { project: Project }) {
  return (
    <Collapsible className="border-b">
      <CollapsibleTrigger className="group flex w-full items-start justify-between gap-4 px-4 py-5 text-left transition-colors duration-300 hover:bg-muted/30 md:px-6">
        <div className="flex flex-col gap-1">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h2 className="font-semibold text-lg">{project.name}</h2>
            <span className="text-muted-foreground text-xs uppercase tracking-wide">
              {project.period} · {project.context}
            </span>
          </div>
          <p className="text-muted-foreground text-sm leading-relaxed">
            {project.summary}
          </p>
        </div>
        <IconChevronDown
          className="mt-1 shrink-0 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180"
          size={20}
          stroke={1.5}
        />
      </CollapsibleTrigger>

      {project.links.length > 0 && (
        <div className="flex flex-wrap gap-4 px-4 pb-4 md:px-6">
          {project.links.map((link) => (
            <a
              className="text-muted-foreground text-sm underline underline-offset-4 transition-colors hover:text-foreground"
              href={link.href}
              key={link.href}
              rel="noreferrer"
              target="_blank"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}

      <CollapsibleContent>
        <div className="border-t px-4 py-6 md:px-6">
          <div className="flex max-w-2xl flex-col gap-6">
            {project.writeUp.map((section, index) => (
              <section
                className="flex flex-col gap-3"
                key={section.heading ?? `section-${index}`}
              >
                {section.heading ? (
                  <h3 className="font-semibold text-base">
                    {section.heading}
                  </h3>
                ) : null}
                {section.paragraphs.map((paragraph) => (
                  <p
                    className="text-foreground/90 text-sm leading-relaxed"
                    key={paragraph}
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}

export default function Projects() {
  return (
    <div className="h-full overflow-y-auto">
      <header className="border-b px-4 py-3 md:px-6">
        <h1 className="font-semibold text-2xl">Projects</h1>
        <p className="text-muted-foreground text-sm">
          Selected work — tap a project to read the full write-up.
        </p>
      </header>

      <section>
        {projects.map((project) => (
          <ProjectBlock key={project.slug} project={project} />
        ))}
      </section>
    </div>
  );
}
```

- [ ] **Step 3: Typecheck**

Run: `bun run typecheck 2>&1 | grep -iE "projects|routes.ts" || echo "projects route: clean"`
Expected: `projects route: clean`

- [ ] **Step 4: Visual check**

Run `bun dev`, open `/projects`. Expected: a "Projects" header strip, then two bordered blocks (Nubia, Feature Adoption Analyser). Each shows name, `period · context`, and summary. Nubia shows two external links. Clicking a block expands it inline with the write-up; the chevron rotates 180°. Clicking an external link opens a new tab and does not toggle the block.

- [ ] **Step 5: Commit**

```bash
git add app/routes/projects.tsx app/routes.ts
git commit -m "feat: add projects route with expandable project blocks"
```

---

### Task 3: Landing page update

Drop the ChowBea Axios entry, and make `kind: "Project"` entries on the landing page navigate to `/projects`.

**Files:**
- Modify: `app/routes/landing.tsx`

- [ ] **Step 1: Add the `Link` import**

In `app/routes/landing.tsx`, the first import line is currently:

```tsx
import { useTheme } from "@/components/providers/theme.provider";
```

Insert a new line directly above it:

```tsx
import { Link } from "react-router";
import { useTheme } from "@/components/providers/theme.provider";
```

- [ ] **Step 2: Remove the ChowBea Axios entry**

In `app/routes/landing.tsx`, find and delete this exact object from the `experience` array (including its trailing comma):

```tsx
  {
    kind: "Project",
    title: "ChowBea Axios",
    period: "Open Source",
    description:
      "An npm package that generates fully-typed Axios clients from your OpenAPI specification — no hand-written type definitions.",
  },
```

- [ ] **Step 3: Make project entries navigate to `/projects`**

In `app/routes/landing.tsx`, replace this exact block:

```tsx
        <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-3">
          {experience.map((item) => (
            <article
              className="-mr-px -mb-px flex min-h-0 flex-col justify-center gap-1 overflow-hidden border-r border-b px-4 py-3 transition-colors duration-300 hover:bg-muted/30 md:px-6"
              key={item.title}
            >
              <span className="truncate text-[0.65rem] text-muted-foreground uppercase tracking-wide">
                {item.kind} — {item.period}
              </span>
              <h3 className="truncate font-medium text-sm">{item.title}</h3>
              <p className="line-clamp-2 text-muted-foreground text-xs leading-snug">
                {item.description}
              </p>
            </article>
          ))}
        </div>
```

with:

```tsx
        <div className="grid min-h-0 flex-1 auto-rows-fr grid-cols-1 border-t sm:grid-cols-2 lg:grid-cols-3">
          {experience.map((item) => {
            const cellClass =
              "-mr-px -mb-px flex min-h-0 flex-col justify-center gap-1 overflow-hidden border-r border-b px-4 py-3 transition-colors duration-300 hover:bg-muted/30 md:px-6";
            const inner = (
              <>
                <span className="truncate text-[0.65rem] text-muted-foreground uppercase tracking-wide">
                  {item.kind} — {item.period}
                </span>
                <h3 className="truncate font-medium text-sm">{item.title}</h3>
                <p className="line-clamp-2 text-muted-foreground text-xs leading-snug">
                  {item.description}
                </p>
              </>
            );

            return item.kind === "Project" ? (
              <Link
                className={`${cellClass} cursor-pointer`}
                key={item.title}
                to="/projects"
              >
                {inner}
              </Link>
            ) : (
              <article className={cellClass} key={item.title}>
                {inner}
              </article>
            );
          })}
        </div>
```

- [ ] **Step 4: Typecheck**

Run: `bun run typecheck 2>&1 | grep -i landing || echo "landing.tsx: clean"`
Expected: `landing.tsx: clean`

- [ ] **Step 5: Visual check**

Run `bun dev`, open `/`. Expected: the "Experience & Projects" section no longer shows ChowBea Axios. The "Feature Adoption Analyser" cell (and any other `Project` cell) shows a pointer cursor and, when clicked, navigates to `/projects`. Work cells remain non-interactive.

- [ ] **Step 6: Commit**

```bash
git add app/routes/landing.tsx
git commit -m "feat: link landing project entries to projects page"
```

---

### Task 4: Verification and placeholder audit

Confirm the sidebar entry exists, the placeholder is greppable, and the whole feature is consistent.

**Files:**
- None (verification only, unless an issue is found).

- [ ] **Step 1: Confirm the sidebar already links to `/projects`**

Run: `grep -n '"/projects"' app/components/navigation/app.sidebar.tsx`
Expected: at least one match (the existing `checkActive("/projects")` / `navigate("/projects")` nav entry). If there is NO match, add a `Projects` `SidebarMenuItem` following the pattern of the existing `Experience` item, then commit it.

- [ ] **Step 2: Confirm the placeholder is greppable**

Run: `grep -n "PLACEHOLDER\|Placeholder:" app/data/projects.ts`
Expected: one `// PLACEHOLDER:` comment on the Feature Adoption Analyser write-up, plus the file-header note, plus one `Placeholder:`-prefixed paragraph string.

- [ ] **Step 3: Full typecheck**

Run: `bun run typecheck 2>&1 | grep -iE "projects|landing|routes" || echo "feature: clean"`
Expected: `feature: clean` (pre-existing errors in `app/lib/logger.ts` and `app/routes/operating-system.tsx` are unrelated and may remain).

- [ ] **Step 4: Full visual check**

Run `bun dev`. Confirm: the sidebar "Projects" item highlights when on `/projects`; the page scrolls within the sidebar inset without clipping; both project blocks expand and collapse; Nubia's full essay renders with its five section headings; the landing project cell navigates to `/projects`.

- [ ] **Step 5: Commit (only if Step 1 required a sidebar fix)**

```bash
git add app/components/navigation/app.sidebar.tsx
git commit -m "feat: add projects entry to sidebar nav"
```

If no fix was needed, skip this commit.

---

## Self-Review Notes

- **Spec coverage:** New `/projects` route ✓ (Task 2). `app/data/projects.ts` typed content module ✓ (Task 1). Expandable blocks via `Collapsible` ✓ (Task 2). Header strip, own scroll container ✓ (Task 2). Nubia full write-up + FAA placeholder ✓ (Task 1). External links open new tab and don't toggle the collapsible — links sit outside `CollapsibleTrigger` ✓ (Task 2). Landing: drop ChowBea Axios + link project entries ✓ (Task 3). ChowBea Axios excluded from projects page ✓ (never added). Sidebar nav ✓ (already exists; verified in Task 4). Placeholder marking ✓ (Task 1 + Task 4 audit).
- **Type consistency:** `Project`, `WriteUpSection`, `ProjectLink` defined in Task 1 and consumed unchanged in Task 2 (`import type { Project }`, `projects` array). `kind: "Project"` string matches the existing `ExperienceItem` union in `landing.tsx`.
- **No test runner:** TDD steps replaced with typecheck + visual verification, consistent with the project's tooling.
