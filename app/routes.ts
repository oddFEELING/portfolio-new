import {
  index,
  layout,
  type RouteConfig,
  route,
} from "@react-router/dev/routes";

export default [
  route("/sitemap.xml", "routes/sitemap[.]xml.ts"),
  route("/robots.txt", "routes/robots[.]txt.ts"),
  layout("routes/_layout.tsx", [
    index("routes/landing.tsx"),
    route("/experience", "routes/experience.tsx"),
    route("/projects", "routes/projects.tsx"),
    route("/contact", "routes/contact.tsx"),
    route("/open-source", "routes/open-source.tsx"),
    route("/blog", "routes/blog.tsx"),
    route("/blog/:slug", "routes/blog.$slug.tsx"),
    route("/operating-system", "routes/operating-system.tsx"),
  ]),
] satisfies RouteConfig;
