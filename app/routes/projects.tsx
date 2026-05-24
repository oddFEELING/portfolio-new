import { Highlighter } from "@/components/ui/highlighter";
import Noise from "@/components/ui/noise";
import PixelBlast from "@/components/ui/pixel-blast";
import { ShutterText } from "@/components/ui/shutter-text";
import { useSidebar } from "@/components/ui/sidebar";
import { projects } from "@/data/projects";
import type { Project } from "@/data/projects";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useState } from "react";
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
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className={`landing-section relative flex flex-col overflow-hidden border p-6 md:min-h-0 md:p-6 ${className}`}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {hovered && <Noise patternAlpha={18} patternRefreshInterval={3} />}

      <div className="relative z-10 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className={featured ? "font-semibold text-2xl" : "font-semibold text-xl"}>
          {project.name}
        </h2>
        <span className="text-muted-foreground text-xs uppercase tracking-wide">
          {project.period} · {project.context}
        </span>
      </div>

      <p className="relative z-10 mt-3 text-muted-foreground text-sm leading-relaxed">
        {project.summary}
      </p>

      {project.links.length > 0 && (
        <div className="relative z-10 mt-auto flex flex-wrap gap-4 pt-4">
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
  const [nubia, goloka, faa, chowbea] = projects;
  const { toggleSidebar } = useSidebar();

  return (
    <div className="grid h-full w-full grid-cols-1 overflow-y-auto md:grid-cols-6 md:grid-rows-5 md:overflow-hidden">
      <header className="landing-section relative flex overflow-hidden border md:col-span-2 md:row-span-2 md:min-h-0">
        <div className="relative flex flex-1 flex-col justify-center gap-2 overflow-hidden px-4 py-10 md:px-6 md:py-6">
          <PixelBlast
            className="absolute inset-0"
            color="#FF9800"
            edgeFade={0.55}
            patternDensity={0.75}
            patternScale={2}
            pixelSize={5}
            speed={0.4}
          />
          <div className="relative z-10 flex flex-col gap-4">
            <p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.4em]">
              // PROJECTS
            </p>
            <h1 className="flex flex-col items-start gap-1 font-semibold text-4xl leading-[0.95] tracking-tight md:text-5xl">
              <ShutterText
                className="justify-start!"
                text="Receipts"
                trigger="auto"
              />
              <span className="flex items-baseline">
                <ShutterText
                  className="justify-start!"
                  text="attached"
                  trigger="auto"
                />
                <span className="inline-block font-semibold text-[#FF9800] leading-none tracking-tighter">
                  .
                </span>
              </span>
            </h1>
            <p className="text-muted-foreground text-sm">
              A few things I&apos;ve built — the rest lives in the work itself.
            </p>
          </div>
        </div>
        <button
          aria-label="Toggle sidebar"
          className="flex shrink-0 items-center justify-center border-l px-3 text-muted-foreground transition-colors duration-300 hover:bg-muted/30 hover:text-foreground"
          onClick={toggleSidebar}
          type="button"
        >
          <span className="rotate-180 font-mono text-xs uppercase tracking-[0.3em] [writing-mode:vertical-rl]">
            <span className="md:hidden">Sidebar</span>
            <span className="hidden md:inline">Toggle Sidebar</span>
          </span>
        </button>
      </header>

      <ProjectTile
        className="md:col-span-4 md:row-span-2"
        featured
        project={nubia}
      />

      <ProjectTile className="md:col-span-2 md:row-span-2" project={goloka} />

      <ProjectTile className="md:col-span-2 md:row-span-2" project={faa} />

      <ProjectTile className="md:col-span-2 md:row-span-2" project={chowbea} />

      <aside className="landing-section relative flex flex-wrap items-center justify-between gap-4 overflow-hidden border p-6 md:col-span-6 md:row-span-1 md:min-h-0 md:p-6">
        <Noise patternAlpha={18} patternRefreshInterval={3} />
        <div className="relative z-10 flex flex-1 flex-col gap-1">
          <p className="font-medium text-base leading-snug md:text-lg">
            The work that{" "}
            <Highlighter action="underline" color="#FF9800" strokeWidth={1}>
              matters most
            </Highlighter>{" "}
            is the work that nobody is writing marketing copy about.
          </p>
        </div>
        <span className="relative z-10 text-muted-foreground text-xs uppercase tracking-wide">
          On building Nubia
        </span>
      </aside>
    </div>
  );
}
