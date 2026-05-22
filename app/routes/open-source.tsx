import type { OpenSourceProject } from "@/data/open-source";
import { openSourceProjects } from "@/data/open-source";
import { IconArrowUpRight } from "@tabler/icons-react";
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

function OpenSourceTile({
  project,
  className,
  featured,
}: {
  project: OpenSourceProject;
  className: string;
  featured?: boolean;
}) {
  return (
    <article
      className={`landing-section flex min-h-0 flex-col overflow-hidden border p-4 md:p-6 ${className}`}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h2
          className={
            featured ? "font-semibold text-2xl" : "font-semibold text-xl"
          }
        >
          {project.name}
        </h2>
        <span className="border px-2 py-0.5 text-muted-foreground text-xs uppercase tracking-wide">
          {project.role}
        </span>
      </div>

      <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
        {project.summary}
      </p>

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
    </article>
  );
}

export default function OpenSource() {
  const [chowbea, reactuse, gitnexus] = openSourceProjects;

  return (
    <div className="grid h-full w-full grid-cols-6 grid-rows-5 overflow-hidden">
      <header className="landing-section col-span-2 row-span-2 flex min-h-0 flex-col justify-center gap-2 border p-4 md:p-6">
        <h1 className="font-semibold text-3xl">Open Source</h1>
        <p className="text-muted-foreground text-sm">
          Things I maintain and help build in the open.
        </p>
      </header>

      <OpenSourceTile
        className="col-span-4 row-span-3"
        featured
        project={chowbea}
      />

      <OpenSourceTile className="col-span-2 row-span-3" project={reactuse} />

      <OpenSourceTile className="col-span-4 row-span-2" project={gitnexus} />
    </div>
  );
}
