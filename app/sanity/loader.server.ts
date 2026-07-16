import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId, studioUrl } from "./env";
// biome-ignore lint/style/noExportedImports: Importing first ensures server setup precedes loader use.
import { loadQuery, setServerClient } from "./loader";

/** Server Sanity client — token required for draft/preview reads. */
const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
  stega: {
    // Per-request stega is controlled via loadQuery options from preview mode.
    enabled: false,
    studioUrl,
  },
});

/** Connects server-side query loading to the private Sanity client. */
setServerClient(serverClient);

export { loadQuery };
