import { Highlighter } from "@/components/ui/highlighter";
import Noise from "@/components/ui/noise";
import PixelBlast from "@/components/ui/pixel-blast";
import { useSidebar } from "@/components/ui/sidebar";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { IconArrowUpRight } from "@tabler/icons-react";
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

function ProjectTile({
  project,
  className,
  featured,
}: {
  project: Project;
  className: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`landing-section flex min-h-0 flex-col overflow-hidden border p-4 md:p-6 ${className}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className={featured ? "font-semibold text-2xl" : "font-semibold text-xl"}>
          {project.name}
        </h2>
        <span className="text-muted-foreground text-xs uppercase tracking-wide">
          {project.period} · {project.context}
        </span>
      </div>

      <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
        {project.summary}
      </p>

      {project.links.length > 0 && (
        <div className="mt-auto flex flex-wrap gap-4 pt-4">
          {project.links.map((link) => (
            <a
              className="inline-flex items-center gap-1 text-muted-foreground text-sm underline underline-offset-4 transition-colors hover:text-foreground"
              href={link.href}
              key={link.href}
              rel="noreferrer"
              target="_blank"
            >
              {link.label}
              <IconArrowUpRight size={14} stroke={1.5} />
            </a>
          ))}
        </div>
      )}
    </article>
  );
}

export default function Projects() {
  const [nubia, faa, goloka] = projects;
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="grid h-full min-w-0 flex-1 grid-cols-6 grid-rows-5 overflow-hidden">
      <header className="landing-section relative col-span-2 row-span-2 flex min-h-0 flex-col justify-center gap-2 overflow-hidden border p-4 md:p-6">
        <PixelBlast
          className="absolute inset-0"
          color="#FF9800"
          edgeFade={0.4}
          patternScale={2.5}
          pixelSize={4}
          speed={0.4}
        />
        <div className="relative z-10 flex flex-col gap-2">
          <h1 className="font-semibold text-3xl">Projects</h1>
          <p className="text-muted-foreground text-sm">
            A few things I&apos;ve built — the rest lives in the work itself.
          </p>
        </div>
      </header>

      <ProjectTile className="col-span-4 row-span-3" featured project={nubia} />

      <ProjectTile className="col-span-2 row-span-3" project={goloka} />

      <ProjectTile className="col-span-2 row-span-2" project={faa} />

      <aside className="landing-section relative col-span-2 row-span-2 flex min-h-0 flex-col justify-center gap-3 overflow-hidden border p-4 md:p-6">
        <Noise patternAlpha={18} patternRefreshInterval={3} />
        <div className="relative z-10 flex flex-col gap-3">
          <p className="font-medium text-lg leading-snug">
            The work that{" "}
            <Highlighter action="underline" color="#FF9800" strokeWidth={2}>
              matters most
            </Highlighter>{" "}
            is the work that nobody is writing marketing copy about.
          </p>
          <span className="text-muted-foreground text-xs uppercase tracking-wide">
            On building Nubia
          </span>
        </div>
      </aside>
      </div>

      <button
        aria-label="Toggle sidebar"
        className="flex shrink-0 items-center justify-center border-l px-3 text-muted-foreground transition-colors duration-300 hover:bg-muted/30 hover:text-foreground"
        onClick={toggleSidebar}
        type="button"
      >
        <span className="rotate-180 font-mono text-xs uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
          Toggle Sidebar
        </span>
      </button>
    </div>
  );
}
