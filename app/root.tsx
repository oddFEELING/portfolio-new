import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useRouteLoaderData,
} from "react-router";

import type { Route } from "./+types/root";
import "./app.css";
import { SanityVisualEditing } from "./components/blog/sanity-visual-editing";
import AppProvider from "./components/providers/app.provider";
import { SeoJsonLd } from "./components/seo-json-ld";
import { buildMeta, SITE } from "./lib/seo";
import { getPreviewData } from "./sanity/session.server";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
  // Preload the share image so social crawlers and LCP benefit.
  { rel: "preload", href: SITE.ogImage, as: "image", type: "image/webp" },
];

/** Exposes preview mode so overlays can mount only for content editors. */
export async function loader({ request }: Route.LoaderArgs) {
  const { preview } = await getPreviewData(request);
  return { preview };
}

/** Site-wide defaults; route `meta` exports refine title/description/canonical. */
export function meta(_: Route.MetaArgs) {
  return buildMeta({
    title: SITE.title,
    description: SITE.description,
    path: "/",
    type: "profile",
  });
}

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html className="dark" lang="en-GB">
      <head>
        <meta charSet="utf-8" />
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <Meta />
        <Links />
        <SeoJsonLd />
      </head>
      <body>
        <AppProvider>
          {children}
          <ScrollRestoration />
          <Scripts />
        </AppProvider>
      </body>
    </html>
  );
}

export default function App() {
  const data = useRouteLoaderData<typeof loader>("root");
  const preview = data?.preview ?? false;

  return (
    <>
      <Outlet />
      {preview ? <SanityVisualEditing /> : null}
    </>
  );
}

const NOT_FOUND_STATUS = 404;
const NOT_FOUND_MESSAGE = "404";
const DEFAULT_DETAILS = "The requested page could not be found.";
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === NOT_FOUND_STATUS ? NOT_FOUND_MESSAGE : "Error";
    details =
      error.status === NOT_FOUND_STATUS
        ? DEFAULT_DETAILS
        : error.statusText || DEFAULT_DETAILS;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="container mx-auto p-4 pt-16">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full overflow-x-auto p-4">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
