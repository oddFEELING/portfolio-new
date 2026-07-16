import type { ClientPerspective } from "@sanity/client";
import { createClient } from "@sanity/client";
import { validatePreviewUrl } from "@sanity/preview-url-secret";
import { apiVersion, dataset, projectId } from "@/sanity/env";
import { commitSession, getSession } from "@/sanity/session.server";
import type { Route } from "./+types/api.preview-mode.enable";

/** Enables Sanity preview mode after validating a Presentation secret. */
export async function loader({ request }: Route.LoaderArgs) {
  const token = process.env.SANITY_API_READ_TOKEN;

  if (!token) {
    throw new Response(
      "SANITY_API_READ_TOKEN is not set. Add a Viewer token to .env.",
      { status: 500 }
    );
  }

  const clientWithToken = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token,
  });

  const { isValid, redirectTo = "/blog" } = await validatePreviewUrl(
    clientWithToken,
    request.url
  );

  if (!isValid) {
    return new Response("Invalid preview URL", { status: 401 });
  }

  const session = await getSession(request.headers.get("Cookie"));
  session.set("previewMode", true);

  const url = new URL(request.url);
  const perspectiveParam = url.searchParams.get("sanity-preview-perspective");
  const perspective = (perspectiveParam || "drafts") as ClientPerspective;
  session.set("perspective", perspective);

  return new Response(null, {
    status: 307,
    headers: {
      Location: redirectTo,
      "Set-Cookie": await commitSession(session),
    },
  });
}
