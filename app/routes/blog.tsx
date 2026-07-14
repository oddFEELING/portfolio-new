import { useSidebar } from "@/components/ui/sidebar";
import { buildMeta } from "@/lib/seo";
import type { Route } from "./+types/blog";

export function meta(_: Route.MetaArgs) {
  return buildMeta({
    title: "Blog — Coming Soon",
    description:
      "Emmanuel Alawode's engineering blog is coming soon — notes on AI systems, full-stack craft, and shipping.",
    path: "/blog",
    noindex: true,
  });
}

const statusCells = [
  { label: "Status", value: "In Progress" },
  { label: "CMS", value: "Sanity" },
  { label: "ETA", value: "Soon™" },
  { label: "Posts", value: "000" },
];

export default function Blog() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <header className="flex items-center justify-between gap-4 border-b px-4 py-3 md:px-6">
        <span className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
          BLOG &nbsp;/&nbsp; COMING_SOON
        </span>
        {/* Sidebar trigger — a Coming-Soon bar that loads forever; click opens nav */}
        <button
          aria-label="Toggle sidebar"
          className="nav-load group/load flex items-center gap-2.5"
          onClick={toggleSidebar}
          type="button"
        >
          <span className="w-28 text-right font-mono text-[#FF9800] text-[0.7rem] uppercase tracking-[0.25em]">
            {/* Label flips to the affordance on hover, when the bar freezes */}
            <span className="group-hover/load:hidden">Click me</span>
            <span className="hidden group-hover/load:inline">Toggle Nav</span>
          </span>
          <span className="relative h-2 w-32 overflow-hidden border border-[#FF9800]/50 bg-[#FF9800]/10">
            <span className="nav-load-fill absolute inset-y-0 left-0 bg-[#FF9800]" />
          </span>
        </button>
      </header>

      <main className="relative flex min-h-0 flex-1 flex-col justify-center overflow-hidden border-b">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 14px)",
          }}
        />
        <div className="relative z-10 max-w-5xl px-4 py-12 md:px-12 md:py-16">
          <p className="mb-6 font-mono text-muted-foreground text-xs uppercase tracking-[0.4em]">
            // 01 — The Blog
          </p>
          <h1 className="font-semibold text-6xl leading-[0.85] tracking-tight sm:text-7xl md:text-9xl">
            Coming
            <br />
            Soon
            <span className="text-[#FF9800]">.</span>
            <span className="ml-2 inline-block h-[0.7em] w-[0.4em] translate-y-[0.08em] animate-pulse bg-foreground/70 align-baseline" />
          </h1>
          <p className="mt-8 max-w-xl text-base text-muted-foreground md:text-lg">
            A space for writing about the work that happens upstream of the
            demo — ingestion, architecture, voice, verification.
          </p>
          <p className="mt-4 font-mono text-muted-foreground text-xs uppercase tracking-wider">
            Powered by Sanity CMS · publishing first, polish later.
          </p>
        </div>
      </main>

      <footer className="-mr-px grid grid-cols-2 md:grid-cols-4">
        {statusCells.map((cell) => (
          <div
            className="-mr-px flex flex-col gap-1 border-r border-b p-3 md:p-4"
            key={cell.label}
          >
            <span className="font-mono text-[0.65rem] text-muted-foreground uppercase tracking-wider">
              {cell.label}
            </span>
            <span className="font-mono text-foreground text-sm uppercase tracking-wider">
              {cell.value}
            </span>
          </div>
        ))}
      </footer>
    </div>
  );
}
