import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId, studioUrl } from "./env";
// biome-ignore lint/style/noExportedImports: Importing first ensures server setup precedes loader use.
import { loadQuery, setServerClient } from "./loader";

/** Reads Sanity content on the server without exposing the optional token. */
const serverClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
  token: process.env.SANITY_API_READ_TOKEN,
  stega: {
    // Keep stega off until Phase 3 visual editing / draft preview.
    enabled: false,
    studioUrl,
  },
});

/** Connects server-side query loading to the private Sanity client. */
setServerClient(serverClient);

export { loadQuery };
