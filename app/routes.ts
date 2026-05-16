import {
  index,
  layout,
  route,
  type RouteConfig,
} from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    index("routes/landing.tsx"),
    route("/about", "routes/about.tsx"),
    route("/operating-system", "routes/operating-system.tsx"),
  ]),
] satisfies RouteConfig;
