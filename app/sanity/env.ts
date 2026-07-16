/** Browser-safe Sanity config — publishable values only. */
export const projectId = import.meta.env.VITE_SANITY_PROJECT_ID as string;
export const dataset = import.meta.env.VITE_SANITY_DATASET as string;
export const apiVersion =
  (import.meta.env.VITE_SANITY_API_VERSION as string | undefined) ??
  "2026-02-01";
export const studioUrl = import.meta.env.VITE_SANITY_STUDIO_URL as
  | string
  | undefined;
