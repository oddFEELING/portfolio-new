/**
 * Open-source project content. Summaries are written from each project's own
 * documentation / README.
 */

export type ProjectLink = {
  label: string;
  href: string;
};

export type OpenSourceRole = "Owner" | "Contributor";

export type OpenSourceProject = {
  slug: string;
  name: string;
  role: OpenSourceRole;
  summary: string;
  links: ProjectLink[];
};

export const openSourceProjects: OpenSourceProject[] = [
  {
    slug: "chowbea-axios",
    name: "ChowBea Axios",
    role: "Owner",
    summary:
      "A CLI tool that generates fully-typed Axios clients straight from an OpenAPI specification, so hand-written type definitions never drift out of sync with the backend. It adds path- and operation-based calling, a Result-pattern error model ({ data, error } instead of thrown exceptions), spec-aware caching, and an interactive dashboard for the generation workflow.",
    links: [
      { label: "axios.chowbea.com", href: "https://axios.chowbea.com/docs" },
    ],
  },
  {
    slug: "chowbea-pdf",
    name: "Chowbea PDF",
    role: "Owner",
    summary:
      "Free, ad-free PDF tools that run in the browser — compress, lock, unlock, merge, convert, and rotate. Jobs go through a RabbitMQ-backed queue so heavy load never takes the service down; no accounts required.",
    links: [
      { label: "pdf.chowbea.com", href: "https://pdf.chowbea.com/" },
      { label: "GitHub", href: "https://github.com/ToniChowBea/chowbea-pdf" },
    ],
  },
  {
    slug: "reactuse",
    name: "reactuse",
    role: "Contributor",
    summary:
      "A library of 115+ production-ready React hooks covering sensors, UI, state and browser APIs — tree-shakable, fully typed, and SSR-safe for Next.js and Remix. It ships interactive documentation and MCP-based discovery, and is used in production by teams including Shopee and Ctrip.",
    links: [
      { label: "reactuse.com", href: "https://reactuse.com/" },
      { label: "GitHub", href: "https://github.com/childrentime/reactuse" },
    ],
  },
  {
    slug: "gitnexus",
    name: "GitNexus",
    role: "Contributor",
    summary:
      "A code-intelligence tool that indexes a repository into a queryable knowledge graph, giving AI agents the structure, dependencies and execution flows of a codebase in a single query. It handles multi-language parsing, clustering, process tracing and hybrid search, with MCP integration for editors like Claude Code and Cursor.",
    links: [
      { label: "GitHub", href: "https://github.com/abhigyanpatwari/GitNexus" },
    ],
  },
];
