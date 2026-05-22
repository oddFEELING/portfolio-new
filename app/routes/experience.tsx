import type { Route } from "./+types/experience";

/**
 * PLACEHOLDER NOTICE
 * ------------------
 * All content on this page — company names, roles, employment types,
 * dates, locations, degrees, grades and highlight bullets — is REAL,
 * taken from the resume.
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
  highlights: string[];
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
    <article className="border-b cursor-pointer px-4 py-5 transition-colors duration-300 hover:bg-muted/30 md:px-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 className="font-semibold text-lg">{item.company}</h2>
        <span className="text-muted-foreground text-xs uppercase tracking-wide">
          {item.period} · {item.location}
        </span>
      </div>

      <p className="mt-0.5 text-muted-foreground text-sm">
        {item.role} · {item.employmentType}
      </p>

      <ul className="-mx-4 mt-3 flex flex-col gap-3 border-y px-4 py-4 md:-mx-6 md:px-6">
        {item.highlights.map((highlight) => (
          <li
            className="text-foreground/90 text-sm leading-relaxed"
            key={highlight}
          >
            {highlight}
          </li>
        ))}
      </ul>
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
    highlights: [
      "Founding engineer behind Zenning's core platform architecture across frontend and backend, establishing the patterns now powering AI chat workspaces, AI Employees, enterprise search and the integrations directory.",
      "Shipped end-to-end product surfaces including AI-driven workflows and backend integrations connecting to 50+ third-party systems (Slack, Gmail, GitHub, Salesforce, Snowflake and others), owning everything from API design through frontend to deployment.",
      "Automated integration testing within three months of joining, cutting deployment errors by 30% and giving a small team the confidence to ship continuously.",
      "Designed the multi-tenant platform foundation on distributed systems, building patterns for B2B growth and validating them across early pilot deployments.",
    ],
  },
  {
    company: "Dataphyte UK",
    role: "Software Engineer",
    employmentType: "Part-time",
    period: "Jan 2023 — Mar 2025",
    location: "London",
    highlights: [
      "Developed a financial dashboard enabling real-time monitoring of unit economics, improving decision-making for the features managed.",
      "Developed an automated AI research tool that transformed unstructured data into structured insights, enhancing data accessibility.",
      "Led the initiative to adopt best practices in coding standards, optimising the development process and reducing bugs by 40%.",
      "Reduced bundle size and improved load times through code-splitting and lazy loading, giving a faster perceived experience on slower connections and lower-end devices.",
    ],
  },
  {
    company: "Dataphyte",
    role: "Full-Stack Engineer",
    employmentType: "Full-time",
    period: "Aug 2021 — Jan 2023",
    location: "Abuja",
    highlights: [
      "Created and implemented dynamic interactive charts with D3 to replace static chart images, increasing click-through rates by 20% and driving 10K+ additional unique site visits.",
      "Designed and built automated web-scraping tools to acquire time-sensitive data, resulting in an 8.7% decrease in operational costs.",
      "Led the development of new features end-to-end using modern technologies, enhancing the codebase and improving user engagement by 15%.",
      "Tailored git workflows to project needs, improving collaboration and reducing merge conflicts within three months.",
    ],
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
