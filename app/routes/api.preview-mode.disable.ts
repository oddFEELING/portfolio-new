import { destroySession, getSession } from "@/sanity/session.server";
import type { Route } from "./+types/api.preview-mode.disable";

/** Clears the Sanity preview session cookie and redirects back to the site. */
export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const redirectTo = url.searchParams.get("redirect") || "/blog";
  const session = await getSession(request.headers.get("Cookie"));

  return new Response(null, {
    status: 307,
    headers: {
      Location: redirectTo,
      "Set-Cookie": await destroySession(session),
    },
  });
}
