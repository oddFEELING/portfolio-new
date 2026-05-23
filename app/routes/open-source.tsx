import DotGrid from "@/components/ui/dot-grid";
import { useSidebar } from "@/components/ui/sidebar";
import type { OpenSourceProject } from "@/data/open-source";
import { openSourceProjects } from "@/data/open-source";
import { IconArrowUpRight } from "@tabler/icons-react";
import { useState } from "react";
import type { Route } from "./+types/open-source";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Open Source — Emmanuel Alawode" },
    {
      name: "description",
      content:
        "Open-source projects Emmanuel Alawode builds and contributes to.",
    },
  ];
}

function OpenSourceRow({
  project,
  index,
}: {
  project: OpenSourceProject;
  index: number;
}) {
  const [hovered, setHovered] = useState(false);
  const isOwner = project.role === "Owner";
  const roleClass = isOwner
    ? "border-[#FF9800] text-[#FF9800]"
    : "border-border text-muted-foreground";

  return (
    <article
      className="relative grid grid-cols-[auto_1fr] overflow-hidden border-b bg-background transition-colors duration-300 md:min-h-0 md:grid-cols-12"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {hovered && (
        <DotGrid
          activeColor="#FF9800"
          baseColor="#52525B"
          className="pointer-events-none absolute inset-0"
          dotSize={3}
          gap={18}
          proximity={120}
          shockRadius={180}
          shockStrength={4}
        />
      )}

      <div className="relative z-10 flex items-center justify-center overflow-hidden border-r p-4 md:col-span-1 md:min-h-0 md:p-4">
        <span className="font-mono text-3xl text-muted-foreground/30 tabular-nums leading-none md:text-5xl">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative z-10 flex flex-col justify-center gap-3 overflow-hidden p-4 md:col-span-4 md:min-h-0 md:border-r md:p-6">
        <h2 className="truncate font-semibold text-2xl">{project.name}</h2>
        <span
          className={`w-fit border px-2 py-0.5 text-xs uppercase tracking-wide ${roleClass}`}
        >
          {project.role}
        </span>
      </div>

      <div className="relative z-10 col-span-2 flex flex-col justify-center gap-3 overflow-hidden border-t p-4 md:col-span-7 md:min-h-0 md:border-t-0 md:p-6">
        <p className="line-clamp-3 text-muted-foreground text-sm leading-relaxed">
          {project.summary}
        </p>
        <div className="flex flex-wrap gap-4">
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
      </div>
    </article>
  );
}

export default function OpenSource() {
  const { toggleSidebar } = useSidebar();
  const owned = openSourceProjects.filter((p) => p.role === "Owner").length;
  const contributing = openSourceProjects.filter(
    (p) => p.role === "Contributor"
  ).length;

  return (
    <div className="flex h-full flex-col overflow-y-auto md:grid md:grid-rows-[auto_1fr_1fr_1fr] md:overflow-hidden">
      <header className="flex items-end justify-between gap-4 border-b px-4 py-5 md:px-6">
        <div className="flex flex-col gap-1">
          <h1 className="font-semibold text-3xl">Open Source</h1>
          <p className="text-muted-foreground text-sm">
            Things I maintain and help build in the open.
          </p>
        </div>
        <div className="flex items-center gap-6">
          <span className="hidden font-mono text-muted-foreground text-xs uppercase tracking-wider sm:inline">
            {openSourceProjects.length} projects · {owned} owned ·{" "}
            {contributing} contributing
          </span>
          <button
            aria-label="Toggle sidebar"
            className="font-mono text-muted-foreground text-xs uppercase tracking-wider transition-colors hover:text-foreground"
            onClick={toggleSidebar}
            type="button"
          >
            [ Nav ]
          </button>
        </div>
      </header>

      {openSourceProjects.map((project, index) => (
        <OpenSourceRow index={index} key={project.slug} project={project} />
      ))}
    </div>
  );
}
