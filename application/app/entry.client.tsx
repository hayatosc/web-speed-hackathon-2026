import { startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { HydratedRouter } from "react-router/dom";

import "@web-speed-hackathon-2026/client/app/buildinfo";

startTransition(() => {
  hydrateRoot(document, <HydratedRouter />);
});
