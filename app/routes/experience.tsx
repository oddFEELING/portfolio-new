import resumeUrl from "@/assets/Emmanuel_Alawode_Resume.pdf?url";
import { Highlighter } from "@/components/ui/highlighter";
import { ShutterText } from "@/components/ui/shutter-text";
import { useSidebar } from "@/components/ui/sidebar";
import TargetCursor from "@/components/ui/target-cursor";
import { IconDownload, IconLayout, IconMail } from "@tabler/icons-react";
import { useState } from "react";
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
  const [cursorActive, setCursorActive] = useState(false);
  const { toggleSidebar } = useSidebar();

  return (
    <div className="h-full overflow-y-auto">
      {cursorActive && <TargetCursor />}
      <header
        className="flex flex-col border-b md:grid md:grid-cols-2"
        onPointerEnter={() => setCursorActive(true)}
        onPointerLeave={() => setCursorActive(false)}
      >
        <div className="border-b px-4 py-6 md:border-b-0 md:px-6 md:py-3">
          <h1 className="font-semibold text-2xl">Experience</h1>
          <p className="text-muted-foreground text-sm">
            The roles I&apos;ve held and where I studied.
          </p>
        </div>
        <div className="grid grid-cols-[auto_1fr_1fr]">
          {/* Sidebar trigger — accent pulse calls attention among its neighbours */}
          <button
            aria-label="Toggle sidebar"
            className="nav-attn-text cursor-target flex items-center justify-center px-3 transition-colors duration-300 hover:bg-[#FF9800]/10 sm:px-4 md:border-l md:px-6"
            onClick={toggleSidebar}
            type="button"
          >
            <IconLayout className="shrink-0" size={22} stroke={1.5} />
          </button>
          <a
            className="cursor-target flex min-w-0 items-center gap-2 border-l px-3 py-3 transition-colors duration-300 hover:bg-muted/30 sm:gap-3 sm:px-4 md:px-6"
            download="Emmanuel_Alawode_Resume.pdf"
            href={resumeUrl}
          >
            <IconDownload
              className="shrink-0 text-muted-foreground"
              size={22}
              stroke={1.5}
            />
            <span className="truncate font-semibold text-sm">
              Download Résumé
            </span>
          </a>
          <a
            className="cursor-target flex min-w-0 items-center gap-2 border-l px-3 py-3 transition-colors duration-300 hover:bg-muted/30 sm:gap-3 sm:px-4 md:px-6"
            href="mailto:alawodeemmanuel2@gmail.com"
          >
            <IconMail
              className="shrink-0 text-muted-foreground"
              size={22}
              stroke={1.5}
            />
            <span className="truncate font-semibold text-sm">
              Get in Touch
            </span>
          </a>
        </div>
      </header>

      <section className="grid grid-cols-1 border-b md:grid-cols-[3fr_2fr]">
        <div className="md:order-1">
          <div className="flex flex-col gap-8 px-4 py-14 md:gap-12 md:px-6 md:py-24">
            <p className="text-balance text-lg leading-relaxed md:text-xl">
              Full-stack engineer with{" "}
              <Highlighter
                action="underline"
                color="#FF9800"
                strokeWidth={1}
              >
                four years
              </Highlighter>{" "}
              shipping AI products end-to-end, founding engineering on a
              multi-product platform with{" "}
              <Highlighter
                action="underline"
                color="#FF9800"
                strokeWidth={1}
              >
                50+ integrations
              </Highlighter>{" "}
              and owning everything from API design to deployment.
            </p>
            <p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.3em]">
              Currently &mdash; Founding AI/Software Engineer at Zenning AI
            </p>
          </div>
        </div>

        <aside className="relative overflow-hidden border-b md:order-2 md:border-b-0 md:border-l">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, currentColor 0 1px, transparent 1px 14px)",
            }}
          />
          <div className="relative z-10 flex h-full flex-col justify-center gap-4 px-4 py-8 md:px-6 md:py-12">
            <p className="font-mono text-muted-foreground text-xs uppercase tracking-[0.4em]">
              // About
            </p>
            <h2 className="flex flex-col items-start gap-1 font-semibold text-4xl leading-[0.95] tracking-tight md:text-6xl">
              <ShutterText
                className="justify-start!"
                text="Probably"
                trigger="auto"
              />
              <span className="flex items-baseline">
                <ShutterText
                  className="justify-start!"
                  text="a steal"
                  trigger="auto"
                />
                <span className="inline-block font-semibold text-[#FF9800] leading-none tracking-tighter">
                  .
                </span>
              </span>
            </h2>
          </div>
        </aside>
      </section>

      <div className="border-b bg-muted/30 px-4 py-3 md:px-6 md:py-2">
        <span className="text-muted-foreground text-xs uppercase tracking-wide">
          Work Experience
        </span>
      </div>

      <section>
        {workExperience.map((item) => (
          <ExperienceBlock item={item} key={item.company} />
        ))}
      </section>

      <div className="border-b bg-muted/30 px-4 py-3 md:px-6 md:py-2">
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
