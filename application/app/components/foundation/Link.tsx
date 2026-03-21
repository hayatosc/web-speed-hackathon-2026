import { forwardRef } from "react";
import { Link as RouterLink, type LinkProps } from "react-router";

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ prefetch = "intent", ...props }, ref) => {
    return <RouterLink ref={ref} prefetch={prefetch} {...props} />;
  },
);

Link.displayName = "Link";
