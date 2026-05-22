/**
 * Project content.
 *
 * Nubia's metadata and summary are REAL. The Feature Adoption Analyser
 * summary is a PLACEHOLDER — search this file for `PLACEHOLDER` to find the
 * content that must be tailored later.
 */

export type ProjectLink = {
  label: string;
  href: string;
};

export type Project = {
  slug: string;
  name: string;
  period: string;
  context: string;
  summary: string;
  links: ProjectLink[];
};

export const projects: Project[] = [
  {
    slug: "nubia",
    name: "Nubia",
    period: "2022 — Present",
    context: "Dataphyte",
    summary:
      "An AI platform for African data journalism, built over four years in partnership with Archivi.ng, Daily Trust and Business Day. I designed its technical foundation — a Next.js frontend on an agentic microservice backend, a hosted LLM service, and a provenance-first vector store built around how journalists actually use their sources. The interesting problems sat upstream of generation: messy ingestion, local voice, lean infrastructure and verifiable output.",
    links: [
      {
        label: "LSE Polis write-up",
        href: "https://blogs.lse.ac.uk/polis/2022/10/04/nubia-the-call-the-crawl-and-the-counsels/",
      },
      { label: "nubia.ai", href: "https://nubia.ai/" },
    ],
  },
  {
    slug: "goloka",
    name: "Goloka",
    period: "2024",
    context: "Real-Time Market Intelligence",
    // PLACEHOLDER: period and summary are stand-ins — goloka.io only states a
    // tagline; confirm the dates/context and replace the summary with real detail.
    summary:
      "Placeholder: Goloka is a real-time market intelligence platform. A fuller summary is coming soon — confirm what it does and your role on it.",
    links: [{ label: "goloka.io", href: "https://www.goloka.io/" }],
  },
  {
    slug: "feature-adoption-analyser",
    name: "Feature Adoption Analyser",
    period: "2025",
    context: "Zenning AI",
    // PLACEHOLDER: summary is a stand-in — replace with real detail
    summary:
      "Placeholder: a tool that analyses how quickly users adopt new features and recommends actions to lift uptake across the product. A fuller summary is coming soon.",
    links: [{ label: "zenning.ai", href: "https://zenning.ai" }],
  },
];
