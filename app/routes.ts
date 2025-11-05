import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("/ads/:id","routes/detail.tsx")] satisfies RouteConfig;
