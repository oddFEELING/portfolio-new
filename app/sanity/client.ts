import { createClient } from "@sanity/client";
import { apiVersion, dataset, projectId } from "./env";

/** Publishable CDN client for browser-safe helpers such as image URLs. */
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});
