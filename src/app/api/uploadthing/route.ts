import { createRouteHandler } from "uploadthing/next";

import { uploadRouter } from "./core";

// Export routes for Next App Router
const { GET, POST } = createRouteHandler({
  router: uploadRouter,

  // Apply an (optional) custom config:
  // config: { ... },
});

export { GET, POST };
