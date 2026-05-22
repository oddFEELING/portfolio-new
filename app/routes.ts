import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    index("routes/landing.tsx"),
    route("/experience", "routes/experience.tsx"),
    route("/projects", "routes/projects.tsx"),
    route("/open-source", "routes/open-source.tsx"),
    route("/operating-system", "routes/operating-system.tsx"),
  ]),
] satisfies RouteConfig;
