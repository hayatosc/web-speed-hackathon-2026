import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  layout("routes/_layout.tsx", [
    index("routes/_index.tsx"),
    route("dm", "routes/dm._index.tsx"),
    route("dm/:conversationId", "routes/dm.$conversationId.tsx"),
    route("search", "routes/search.tsx"),
    route("users/:username", "routes/users.$username.tsx"),
    route("posts/:postId", "routes/posts.$postId.tsx"),
    route("terms", "routes/terms.tsx"),
    route("crok", "routes/crok.tsx"),
    route("*", "routes/$.tsx"),
  ]),
] satisfies RouteConfig;
