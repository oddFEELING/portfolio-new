# Nav Chrome Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make path-style headers real breadcrumbs (ancestors link, current plain) and replace every page’s sidebar toggle with a shared left OS-style glyph dock.

**Architecture:** Two small navigation components (`PageBreadcrumbs`, `NavDock`) under `app/components/navigation/`. Routes compose them into headers; no change to sidebar contents or `_layout.tsx` provider wiring. Dock uses existing `useSidebar()`; crumbs use React Router `Link`.

**Tech Stack:** React Router 7, existing shadcn `SidebarProvider` / `useSidebar`, Tailwind, lucide or plain Unicode glyph (`≡`), existing `nav-attn` / `nav-attn-text` CSS in `app/app.css`.

**Spec:** `docs/superpowers/specs/2026-07-16-nav-chrome-design.md`

## Global Constraints

- Ancestors link; current segment is plain text with `aria-current="page"`.
- No middle “Tag” crumb link — tag archive is `Blog` → `/blog` + current = tag slug.
- Dock is left-edge glyph pad with decorative traffic lights (not real window controls).
- Keep flush/mono + orange `#FF9800` accent; no new card chrome.
- Do not import from `radix-ui` root; comments describe functionality.
- No test runner in repo — verify with `bun run typecheck` + manual smoke.
- Commit only if the user has approved commits for this workstream.

---

## File map

| File | Responsibility |
| --- | --- |
| Create `app/components/navigation/page-breadcrumbs.tsx` | Accessible breadcrumb nav |
| Create `app/components/navigation/nav-dock.tsx` | Shared left dock toggle |
| Modify `app/routes/blog.tsx` | Dock left + breadcrumbs for index |
| Modify `app/routes/blog.tag.$slug.tsx` | Dock left + crumbs |
| Modify `app/routes/blog.$slug.tsx` | Dock left + crumbs |
| Modify `app/routes/contact.tsx` | Replace custom left strip with `NavDock` |
| Modify `app/routes/projects.tsx` | Replace right toggle with `NavDock` |
| Modify `app/routes/experience.tsx` | Replace header toggle with `NavDock` |
| Modify `app/routes/open-source.tsx` | Replace `[ Nav ]` with `NavDock` |
| Modify `app/routes/landing.tsx` | Replace hero sidebar chip with dock-friendly placement |

---

### Task 1: `PageBreadcrumbs`

**Files:**
- Create: `app/components/navigation/page-breadcrumbs.tsx`

**Interfaces:**
- Consumes: `react-router` `Link`
- Produces:

```ts
export type BreadcrumbItem = {
  label: string;
  /** Omit on the current page segment */
  href?: string;
};

export function PageBreadcrumbs(props: {
  items: BreadcrumbItem[];
  /** Optional trailing metadata, e.g. " · Preview" */
  suffix?: string;
  className?: string;
}): JSX.Element;
```

- [ ] **Step 1: Add the component**

```tsx
import { Link } from "react-router";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type PageBreadcrumbsProps = {
  items: BreadcrumbItem[];
  suffix?: string;
  className?: string;
};

/** Path-style crumbs: ancestors link, current segment is plain text. */
export function PageBreadcrumbs({
  items,
  suffix,
  className,
}: PageBreadcrumbsProps) {
  return (
    <nav
      aria-label="Breadcrumb"
      className={
        className ??
        "font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]"
      }
    >
      <ol className="flex flex-wrap items-center gap-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li className="flex items-center gap-x-2" key={`${item.label}-${index}`}>
              {index > 0 ? (
                <span aria-hidden="true" className="text-muted-foreground/50">
                  /
                </span>
              ) : null}
              {item.href && !isLast ? (
                <Link
                  className="text-foreground/80 underline-offset-4 transition-colors hover:text-[#FF9800] hover:underline"
                  to={item.href}
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
        {suffix ? (
          <li className="text-muted-foreground/80">{suffix}</li>
        ) : null}
      </ol>
    </nav>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `bun run typecheck`  
Expected: PASS (or only pre-existing unrelated errors)

- [ ] **Step 3: Commit (if approved)**

```bash
git add app/components/navigation/page-breadcrumbs.tsx
git commit -m "$(cat <<'EOF'
feat(nav): add shared PageBreadcrumbs component

EOF
)"
```

---

### Task 2: `NavDock`

**Files:**
- Create: `app/components/navigation/nav-dock.tsx`

**Interfaces:**
- Consumes: `useSidebar` from `@/components/ui/sidebar`
- Produces:

```ts
export function NavDock(props?: {
  className?: string;
}): JSX.Element;
```

- [ ] **Step 1: Add the dock**

```tsx
import { useSidebar } from "@/components/ui/sidebar";

/** Left OS-style glyph pad that toggles the app sidebar. */
export function NavDock({ className }: { className?: string } = {}) {
  const { toggleSidebar, open, openMobile, isMobile } = useSidebar();
  const expanded = isMobile ? openMobile : open;
  const label = expanded ? "CLOSE NAV" : "OPEN NAV";

  return (
    <button
      aria-expanded={expanded}
      aria-label={expanded ? "Close navigation" : "Open navigation"}
      className={
        className ??
        "nav-attn-text group flex shrink-0 flex-col items-center gap-3 border-[#FF9800]/30 border-r px-2 py-3 transition-colors duration-300 hover:bg-[#FF9800]/10 sm:px-3"
      }
      onClick={toggleSidebar}
      type="button"
    >
      {/* Decorative traffic lights — not window controls */}
      <span aria-hidden="true" className="flex gap-1">
        <span className="size-1.5 rounded-full bg-[#FF5F57]" />
        <span className="size-1.5 rounded-full bg-[#FEBC2E]" />
        <span className="size-1.5 rounded-full bg-[#28C840]" />
      </span>

      <span
        aria-hidden="true"
        className="flex size-6 items-center justify-center border border-[#FF9800] font-mono text-[#FF9800] text-sm leading-none"
      >
        ≡
      </span>

      <span className="rotate-180 font-mono text-[0.65rem] text-[#FF9800] uppercase tracking-[0.3em] [writing-mode:vertical-rl] sm:text-xs">
        {label}
      </span>
    </button>
  );
}
```

- [ ] **Step 2: Typecheck**

Run: `bun run typecheck`  
Expected: PASS

- [ ] **Step 3: Commit (if approved)**

```bash
git add app/components/navigation/nav-dock.tsx
git commit -m "$(cat <<'EOF'
feat(nav): add shared left NavDock toggle

EOF
)"
```

---

### Task 3: Wire blog routes (crumbs + dock)

**Files:**
- Modify: `app/routes/blog.tsx`
- Modify: `app/routes/blog.tag.$slug.tsx`
- Modify: `app/routes/blog.$slug.tsx`

**Interfaces:**
- Consumes: `PageBreadcrumbs`, `NavDock`
- Produces: blog headers with left dock and clickable ancestors

- [ ] **Step 1: Update `blog.tsx` header**

Replace the header that has right-edge toggle with a flex row: `NavDock` first, then content.

Pattern:

```tsx
import { NavDock } from "@/components/navigation/nav-dock";
import { PageBreadcrumbs } from "@/components/navigation/page-breadcrumbs";

// remove useSidebar / toggleSidebar from this file

<header className="flex shrink-0 items-stretch border-b">
  <NavDock />
  <div className="flex min-w-0 flex-1 items-center justify-between gap-4 px-4 py-4 md:px-6">
    <PageBreadcrumbs
      items={[{ label: "Blog" }]}
      suffix={preview ? " · Preview" : undefined}
    />
    <span className="font-mono text-muted-foreground text-xs tabular-nums tracking-[0.2em]">
      {postCount}
    </span>
  </div>
</header>
```

- [ ] **Step 2: Update `blog.tag.$slug.tsx` header**

```tsx
<header className="flex shrink-0 items-stretch border-b">
  <NavDock />
  <div className="flex min-w-0 flex-1 items-center justify-between gap-4 px-4 py-4 md:px-6">
    <PageBreadcrumbs
      items={[
        { label: "Blog", href: "/blog" },
        { label: stegaClean(tag.slug) },
      ]}
      suffix={preview ? " · Preview" : undefined}
    />
    <span className="font-mono text-muted-foreground text-xs tabular-nums tracking-[0.2em]">
      {postCount}
    </span>
  </div>
</header>
```

- [ ] **Step 3: Update `blog.$slug.tsx` header**

```tsx
<header className="flex shrink-0 items-stretch border-b">
  <NavDock />
  <div className="flex min-w-0 flex-1 items-center px-4 py-3 md:px-6">
    <PageBreadcrumbs
      items={[
        { label: "Blog", href: "/blog" },
        { label: stegaClean(post.slug) },
      ]}
      suffix={preview ? " · Preview" : undefined}
    />
  </div>
</header>
```

Remove the old right-side `Menu` / vertical toggle buttons and unused `useSidebar` imports from all three files.

- [ ] **Step 4: Smoke-check blog**

Run: `bun run typecheck`  
Manual: `/blog`, `/blog/tag/<slug>`, `/blog/<slug>` — click `Blog` crumb; dock opens sidebar.

- [ ] **Step 5: Commit (if approved)**

```bash
git add app/routes/blog.tsx app/routes/blog.tag.\$slug.tsx app/routes/blog.\$slug.tsx
git commit -m "$(cat <<'EOF'
feat(blog): wire breadcrumbs and left NavDock

EOF
)"
```

---

### Task 4: Wire remaining layout routes

**Files:**
- Modify: `app/routes/contact.tsx` — replace the custom left `TOGGLE_SIGNAL` button with `<NavDock />` (same outer flex layout).
- Modify: `app/routes/projects.tsx` — put `<NavDock />` on the left of the header; remove right vertical toggle.
- Modify: `app/routes/experience.tsx` — put `<NavDock />` at the start of the header action row (or as left edge of the page shell); remove the old layout icon button.
- Modify: `app/routes/open-source.tsx` — left dock beside header; remove `[ Nav ]`.
- Modify: `app/routes/landing.tsx` — remove the orange layout chip from the CTA row; wrap the landing shell so `<NavDock />` sits on the left edge of the inset content (same contact-style `flex` row: dock + main column). Keep theme/social controls as they are.

**Interfaces:**
- Consumes: `NavDock`
- Produces: consistent left dock on every toggled route

- [ ] **Step 1: Contact** — swap the existing left button block for `<NavDock />`; drop local `toggleSidebar` if unused.

- [ ] **Step 2: Projects** — header becomes `flex items-stretch`: `<NavDock />` then existing hero panel (no right toggle column).

- [ ] **Step 3: Experience** — page root `flex`; `<NavDock />` + scrollable column; remove toggle from the 3-col action grid (resume / email stay).

- [ ] **Step 4: Open source** — same shell pattern; keep project count text in the header.

- [ ] **Step 5: Landing** — outer `flex h-full` with `<NavDock />` + existing content; delete the sidebar `span`/`IconLayout` control from the CTA cluster.

- [ ] **Step 6: Verify no leftover toggles**

Run:

```bash
rg "toggleSidebar|Toggle Sidebar|\\[ Nav \\]" app/routes --glob '*.tsx'
```

Expected: no matches in route files (only possible leftovers inside `app/components/ui/sidebar.tsx` primitives — leave those alone).

- [ ] **Step 7: Typecheck + manual pass**

Run: `bun run typecheck`  
Manual: each route above — dock left, opens sidebar, no right strip.

- [ ] **Step 8: Commit (if approved)**

```bash
git add app/routes/contact.tsx app/routes/projects.tsx app/routes/experience.tsx app/routes/open-source.tsx app/routes/landing.tsx
git commit -m "$(cat <<'EOF'
feat(nav): use shared NavDock across layout routes

EOF
)"
```

---

### Task 5: Acceptance checklist

- [ ] **Step 1: Run through spec acceptance**

1. Blog post / tag: `Blog` crumb navigates to `/blog`.
2. Current crumb is not a link; has `aria-current="page"`.
3. Right-edge “Toggle Sidebar” gone on adopted pages.
4. Left dock opens/closes sidebar (desktop + narrow mobile).
5. Visual stays mono/flush with orange accent; traffic lights decorative only.

- [ ] **Step 2: Final typecheck**

Run: `bun run typecheck`  
Expected: PASS

---

## Spec coverage (self-review)

| Spec requirement | Task |
| --- | --- |
| Shared breadcrumbs, ancestors link / current plain | Task 1, 3 |
| Tag archive: Blog + slug only | Task 3 Step 2 |
| Left dock glyph + traffic lights | Task 2 |
| Shared dock on all toggle routes | Task 3–4 |
| a11y: nav, aria-current, button, aria-expanded, lights hidden | Tasks 1–2 |
| Out of scope A/B chrome | Not scheduled |
| Acceptance criteria | Task 5 |
