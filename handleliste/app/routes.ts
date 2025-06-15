import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
    index("routes/index.tsx"),
    route("addList", "routes/addList.tsx"),
    route("registration", "routes/registration.tsx"),
    route("login", "routes/login.tsx")
] satisfies RouteConfig;
