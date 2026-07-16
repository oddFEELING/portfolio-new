import { motion } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { Link } from "react-router";
import {
  HeroReplayButton,
  hasSeenLandingHero,
  LANDING_EASE,
  LANDING_LAYOUT_MS,
  LandingHero,
} from "@/components/landing-hero";
import { NavDock } from "@/components/navigation/nav-dock";
import { useTheme } from "@/components/providers/theme.provider";
import { Highlighter } from "@/components/ui/highlighter";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
  IconMail,
  IconMoon,
  IconSun,
  type TablerIcon,
} from "@tabler/icons-react";
import type { Route } from "./+types/landing";
import { buildMeta } from "@/lib/seo";

export function meta(_: Route.MetaArgs) {
  return buildMeta({
    title: "Emmanuel Alawode | Full-Stack & AI Software Engineer",
    description:
      "Emmanuel Alawode — full-stack and AI software engineer in London. Founding engineer shipping production AI products, agents, and scalable platforms.",
    path: "/",
    type: "profile",
  });
}

export default function Home() {
  const { theme, setTheme } = useTheme();
  // Start settled if this session already saw the intro (avoids a layout flash).
  const [settled, setSettled] = useState(() => {
    if (typeof window === "undefined") {
      return true;
    }
    if (hasSeenLandingHero()) {
      return true;
    }
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  });
  // Skip fade-in when remounting after the intro was already finished this session.
  const instantSectionsRef = useRef(hasSeenLandingHero());
  const handleSettledChange = useCallback((next: boolean) => {
    if (!next) {
      // Replay re-expands — allow sibling entrance motion again.
      instantSectionsRef.current = false;
    }
    setSettled(next);
  }, []);

  return (
    <div className="flex h-full">
      {/* Shared left dock toggles the app sidebar */}
      <NavDock />

      {/* Landing grid: hero, tech stack, marquee, experience */}
      <div className="grid h-full min-w-0 w-full flex-1 grid-cols-1 overflow-y-auto md:grid-cols-6 md:grid-rows-5 md:overflow-hidden">
        {/* Hero starts full-bleed, then morphs into its grid cell at 4s. */}
        <LandingHero onSettledChange={handleSettledChange}>
          <h1 className="w-full max-w-2xl font-semibold text-4xl text-zinc-900 dark:text-foreground">
            I&apos;m Emmanuel Alawode, A{" "}
            <Highlighter action="underline" color="#FF9800" strokeWidth={2}>
              Software Engineer
            </Highlighter>{" "}
            And I like to build stuff.
          </h1>
          <p className="w-full max-w-lg text-zinc-700 dark:text-muted-foreground">
            Four years building AI products that don&apos;t quietly break in
            production, based in London.
          </p>

          <div className="mt-2 flex w-full max-w-2xl flex-col gap-2 md:max-w-none md:flex-row md:flex-wrap md:items-center md:gap-3">
            {/* Theme, replay, and social controls */}
            <div className="grid w-full grid-cols-3 gap-2 md:contents">
              <span
                className="flex h-11 w-full cursor-pointer items-center justify-center rounded-md border bg-background p-2 text-muted-foreground transition-colors hover:border-muted-foreground hover:bg-muted hover:text-primary md:h-auto md:w-auto"
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
              {/* Restart the hero walk-in clip from the beginning. */}
              <HeroReplayButton className="flex h-11 w-full items-center justify-center p-2 md:h-auto md:w-auto" />
              {socialLinks.map((item) => (
                <a
                  className="flex h-11 w-full cursor-pointer items-center justify-center rounded-md border bg-background p-2 text-muted-foreground transition-colors hover:animate-pulse hover:border-muted-foreground hover:bg-muted hover:text-primary md:h-auto md:w-auto"
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
          </div>
        </LandingHero>

        {/* Tech stack + marquee enter as the hero settles; experience stays put. */}
        {settled && (
          <>
            <motion.section
              animate={{ opacity: 1 }}
              className="landing-section flex flex-col justify-center gap-4 border-y py-12 md:col-span-2 md:row-span-2 md:min-h-0 md:py-6"
              initial={instantSectionsRef.current ? false : { opacity: 0 }}
              transition={{
                duration: LANDING_LAYOUT_MS / 1000,
                ease: LANDING_EASE,
                delay: 0.05,
              }}
            >
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
            </motion.section>

            <motion.section
              animate={{ opacity: 1 }}
              className="landing-section flex items-center overflow-hidden border md:col-span-6 md:row-span-1"
              initial={instantSectionsRef.current ? false : { opacity: 0 }}
              transition={{
                duration: LANDING_LAYOUT_MS / 1000,
                ease: LANDING_EASE,
                delay: 0.12,
              }}
            >
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
            </motion.section>
          </>
        )}

        <motion.section
          animate={{ opacity: 1 }}
          className="landing-section flex flex-col border md:col-span-6 md:row-span-2 md:min-h-0"
          initial={false}
        >
          <div className="flex shrink-0 flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-4 py-7 md:px-6 md:py-3">
            <h2 className="font-semibold text-xl">Experience &amp; Projects</h2>
            <p className="text-muted-foreground text-xs">
              Where I&apos;ve worked and what I&apos;ve built.
            </p>
          </div>

          <div className="grid auto-rows-auto grid-cols-1 border-t sm:grid-cols-2 md:min-h-0 md:flex-1 md:auto-rows-fr lg:grid-cols-3">
            {experience.map((item, index) => {
              const cellClass =
                "-mr-px -mb-px flex min-h-0 flex-col justify-center gap-1 overflow-hidden border-r border-b px-4 py-7 transition-colors duration-300 hover:bg-muted/30 md:px-6 md:py-3";
              const baseDelay = 0.15 + index * 0.07;
              const fadeUp = (offset: number) => ({
                initial: { opacity: 0, y: 6 },
                animate: { opacity: 1, y: 0 },
                transition: {
                  duration: 0.35,
                  delay: baseDelay + offset,
                  ease: LANDING_EASE,
                },
              });

              const inner = (
                <>
                  <motion.span
                    className="truncate text-[0.65rem] text-muted-foreground uppercase tracking-wide"
                    {...fadeUp(0)}
                  >
                    {item.kind} — {item.period}
                  </motion.span>
                  <motion.h3
                    className="truncate font-medium text-sm"
                    {...fadeUp(0.06)}
                  >
                    {item.title}
                  </motion.h3>
                  <motion.p
                    className="line-clamp-2 text-muted-foreground text-xs leading-snug"
                    {...fadeUp(0.12)}
                  >
                    {item.description}
                  </motion.p>
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
        </motion.section>
      </div>
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
    href: "https://github.com/ToniChowBea",
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
