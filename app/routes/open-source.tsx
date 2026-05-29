import { useTheme } from "@/components/providers/theme.provider";
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
  const { theme } = useTheme();
  const isLight = theme === "light";
  const dotBaseColor = isLight ? "#D4D4D8" : "#71717A";
  const isOwner = project.role === "Owner";
  const roleStripClass = isOwner
    ? "bg-[#FF9800]/10 text-[#FF9800] border-[#FF9800]/30"
    : "bg-muted/30 text-muted-foreground border-border";

  return (
    <article
      className="landing-section relative grid grid-cols-[auto_1fr] overflow-hidden border-b md:min-h-0 md:grid-cols-12"
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      <div className="relative z-10 flex items-center justify-center overflow-hidden border-r p-4 md:col-span-1 md:min-h-0 md:p-4">
        <span className="font-mono text-3xl text-muted-foreground/30 tabular-nums leading-none md:text-5xl">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative z-10 flex flex-col overflow-hidden md:col-span-4 md:min-h-0 md:border-r">
        <div className="flex flex-1 items-center px-4 py-6 md:px-6">
          <h2 className="truncate font-semibold text-2xl">{project.name}</h2>
        </div>
        <div
          className={`w-full border-t px-4 py-1.5 font-mono text-xs uppercase tracking-[0.3em] md:px-6 ${roleStripClass}`}
        >
          {project.role}
        </div>
      </div>

      <div className="relative z-10 col-span-2 flex flex-col justify-center overflow-hidden border-t px-4 py-6 md:col-span-7 md:min-h-0 md:border-t-0 md:p-6">
        {hovered && (
          <DotGrid
            activeColor="#FF9800"
            baseColor={dotBaseColor}
            className="pointer-events-none absolute inset-0"
            dotSize={3}
            gap={18}
            proximity={120}
            shockRadius={180}
            shockStrength={4}
          />
        )}
        <div className="relative z-10 flex flex-col gap-3">
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
          {/* Sidebar trigger — accent pulse calls attention to navigation */}
          <button
            aria-label="Toggle sidebar"
            className="nav-attn-text font-mono text-xs uppercase tracking-wider"
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
