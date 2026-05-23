import { Link } from "react-router";
import { useTheme } from "@/components/providers/theme.provider";
import { Highlighter } from "@/components/ui/highlighter";
import { useSidebar } from "@/components/ui/sidebar";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconLayout,
  IconMail,
  IconMoon,
  IconSun,
  type TablerIcon,
} from "@tabler/icons-react";
import type { Route } from "./+types/landing";

export function meta(_: Route.MetaArgs) {
  return [
    { title: "Emmanuel Alawode" },
    { name: "description", content: "I build stuff. And they work." },
  ];
}

export default function Home() {
  const { toggleSidebar } = useSidebar();
  const { theme, setTheme } = useTheme();

  return (
    <div className="grid h-full w-full grid-cols-1 overflow-y-auto md:grid-cols-6 md:grid-rows-5 md:overflow-hidden">
      <header className="landing-section flex w-full flex-col justify-center gap-4 overflow-hidden border px-4 py-8 md:col-span-4 md:row-span-2 md:min-h-0 md:p-6">
        <h1 className="w-full max-w-2xl font-semibold text-4xl">
          I&apos;m Emmanuel - A{" "}
          <Highlighter action="underline" color="#FF9800" strokeWidth={2}>
            Software Engineer
          </Highlighter>{" "}
          And I like to build stuff.
        </h1>
        <p className="w-full max-w-lg text-muted-foreground">
          I am a seasoned software engineer with 5+ years or experience shipping
          products for companies in a myraid of domains.
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-3">
          <span
            className="cursor-pointer rounded-md border bg-muted/30 p-2 text-muted-foreground hover:border-muted-foreground hover:text-primary dark:bg-muted/40"
            onClick={toggleSidebar}
            role="button"
            tabIndex={0}
          >
            <IconLayout size={22} stroke={1.5} />
          </span>
          <span
            className="cursor-pointer rounded-md border bg-muted/30 p-2 text-muted-foreground hover:border-muted-foreground hover:text-primary dark:bg-muted/40"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            role="button"
            tabIndex={0}
            title="Toggle theme"
          >
            {theme === "dark" ? (
              <IconSun size={22} stroke={1.5} />
            ) : (
              <IconMoon size={22} stroke={1.5} />
            )}
          </span>
          {socialLinks.map((item) => (
            <a
              className="cursor-pointer rounded-md border p-2 text-muted-foreground hover:animate-pulse hover:border-muted-foreground hover:bg-muted/15 hover:text-primary"
              href={item.href}
              key={item.label}
              rel="noreferrer"
              target="_blank"
              title={item.label}
            >
              <item.Icon size={22} stroke={1.5} />
            </a>
          ))}
        </div>
      </header>

      <section className="landing-section flex flex-col justify-center gap-4 border-y py-8 md:col-span-2 md:row-span-2 md:min-h-0 md:py-6">
        <div className="flex flex-col gap-1 px-4 md:px-6">
          <h2 className="font-semibold text-xl">My Tech Stack</h2>
          <p className="text-muted-foreground text-xs">
            The tools I reach for to ship end-to-end.
          </p>
        </div>
        <div className="-ml-px flex flex-wrap">
          {techStack.map((tech) => (
            <span
              className="-mr-px -mb-px flex grow items-center justify-center border px-3 py-2.5 text-center text-muted-foreground text-sm transition-colors duration-300 hover:bg-muted/30"
              key={tech}
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="landing-section flex items-center overflow-hidden border md:col-span-6 md:row-span-1">
        <div className="marquee w-full overflow-hidden">
          <div className="marquee-track flex w-max items-center">
            {[0, 1].map((copy) => (
              <div
                aria-hidden={copy === 1}
                className="flex items-center"
                key={copy}
              >
                {marqueeItems.map((item) => (
                  <span
                    className="flex items-center whitespace-nowrap"
                    key={`${copy}-${item.label}`}
                  >
                    <span
                      className={
                        item.accent
                          ? "px-6 py-4 font-medium text-base"
                          : "px-6 py-4 text-base text-muted-foreground"
                      }
                    >
                      {item.label}
                    </span>
                    <span className="text-muted-foreground/40">→</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-section flex flex-col border md:col-span-6 md:row-span-2 md:min-h-0">
        <div className="flex shrink-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-5 md:px-6 md:py-3">
          <h2 className="font-semibold text-xl">Experience &amp; Projects</h2>
          <p className="text-muted-foreground text-xs">
            Where I&apos;ve worked and what I&apos;ve built.
          </p>
        </div>

        <div className="grid auto-rows-auto grid-cols-1 border-t sm:grid-cols-2 md:min-h-0 md:flex-1 md:auto-rows-fr lg:grid-cols-3">
          {experience.map((item) => {
            const cellClass =
              "-mr-px -mb-px flex min-h-0 flex-col justify-center gap-1 overflow-hidden border-r border-b px-4 py-5 transition-colors duration-300 hover:bg-muted/30 md:px-6 md:py-3";
            const inner = (
              <>
                <span className="truncate text-[0.65rem] text-muted-foreground uppercase tracking-wide">
                  {item.kind} — {item.period}
                </span>
                <h3 className="truncate font-medium text-sm">{item.title}</h3>
                <p className="line-clamp-2 text-muted-foreground text-xs leading-snug">
                  {item.description}
                </p>
              </>
            );

            return item.kind === "Project" ? (
              <Link
                className={`${cellClass} cursor-pointer`}
                key={item.title}
                to="/projects"
              >
                {inner}
              </Link>
            ) : (
              <article className={cellClass} key={item.title}>
                {inner}
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}

const socialLinks: { Icon: TablerIcon; href: string; label: string }[] = [
  { Icon: IconBrandX, href: "https://x.com/emmanuelalawode", label: "X" },
  {
    Icon: IconBrandLinkedin,
    href: "https://linkedin.com/in/alawodeemmanuel",
    label: "LinkedIn",
  },
  {
    Icon: IconBrandGithub,
    href: "https://github.com/oddFEELING",
    label: "GitHub",
  },
  {
    Icon: IconMail,
    href: "mailto:alawodeemmanuel2@gmail.com",
    label: "Email",
  },
];

const marqueeItems: { label: string; accent?: boolean }[] = [
  { label: "Founding AI/Software Engineer", accent: true },
  { label: "React" },
  { label: "TypeScript" },
  { label: "NestJS" },
  { label: "Node" },
  { label: "50+ integrations", accent: true },
  { label: "AWS" },
  { label: "GCP" },
  { label: "Docker" },
  { label: "D3" },
  { label: "Autonomous agents", accent: true },
  { label: "Enterprise search" },
  { label: "MSc AI — Distinction", accent: true },
  { label: "Machine Learning" },
  { label: "4 years shipping", accent: true },
];

const techStack = [
  "React",
  "TypeScript",
  "NestJS",
  "Node",
  "Next.js",
  "Tailwind",
  "Redux",
  "AWS",
  "GCP",
  "Docker",
  "CI/CD",
  "Machine Learning",
  "REST APIs",
  "RabbitMQ",
  "Redis",
  "Nginx",
  "SQL",
];

type ExperienceItem = {
  kind: "Work" | "Project";
  title: string;
  period: string;
  description: string;
};

const experience: ExperienceItem[] = [
  {
    kind: "Work",
    title: "Founding AI/Software Engineer · Zenning AI",
    period: "2025 — Present",
    description:
      "Founding engineer behind Zenning's core platform — AI chat workspaces, AI Employees, enterprise search and a 50+ integrations directory.",
  },
  {
    kind: "Work",
    title: "Software Engineer · Dataphyte UK",
    period: "2023 — 2025",
    description:
      "Built a real-time financial dashboard and an automated AI research tool, and drove coding standards that cut bugs by 40%.",
  },
  {
    kind: "Work",
    title: "Full-Stack Engineer · Dataphyte",
    period: "2021 — 2023",
    description:
      "Replaced static charts with interactive D3 visualisations, lifting click-through 20%, and built automated web-scraping tools.",
  },
  {
    kind: "Project",
    title: "Feature Adoption Analyser",
    period: "Zenning AI",
    description:
      "A tool that analyses feature-adoption rates and recommends actions to improve uptake across the product.",
  },
];
