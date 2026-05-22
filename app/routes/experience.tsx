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
          <ExperienceBlock item={item} key={item.company} />
        ))}
      </section>

      <div className="border-b bg-muted/30 px-4 py-2 md:px-6">
        <span className="text-muted-foreground text-xs uppercase tracking-wide">
          Education
        </span>
      </div>

      <section>
        {education.map((item) => (
          <EducationBlock item={item} key={item.school} />
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
