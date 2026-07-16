import { createQueryStore } from "@sanity/react-loader";

/** Shares an SSR query store while deferring the browser client to live mode. */
export const { loadQuery, setServerClient, useQuery, useLiveMode } =
  createQueryStore({
    client: false,
    ssr: true,
  });
