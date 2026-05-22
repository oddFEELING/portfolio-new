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
