import type { loadQuery } from "@sanity/react-loader";
import { createCookieSessionStorage } from "react-router";

/** Session cookie that marks the browser as being in Sanity preview mode. */
const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      httpOnly: true,
      name: "__sanity_preview",
      path: "/",
      // Localhost Studio ↔ app are same-site; production iframe needs None.
      sameSite: import.meta.env.DEV ? "lax" : "none",
      secrets: [
        process.env.SANITY_PREVIEW_SESSION_SECRET ||
          "dev-only-change-me-preview-session",
      ],
      secure: !import.meta.env.DEV,
    },
  });

type LoadQueryOptions = NonNullable<Parameters<typeof loadQuery>[2]>;

/** Reads preview cookie state and builds loadQuery options for this request. */
export async function getPreviewData(request: Request): Promise<{
  preview: boolean;
  options: LoadQueryOptions;
}> {
  const session = await getSession(request.headers.get("Cookie"));
  const preview = Boolean(session.get("previewMode"));

  if (!preview) {
    return {
      preview: false,
      options: {
        perspective: "published",
        stega: false,
      },
    };
  }

  const perspectiveValue = session.get("perspective");
  let perspective: LoadQueryOptions["perspective"] = "drafts";
  if (typeof perspectiveValue === "string" && perspectiveValue.length > 0) {
    perspective = perspectiveValue.includes(",")
      ? perspectiveValue.split(",")
      : perspectiveValue;
  }

  return {
    preview: true,
    options: {
      perspective,
      stega: true,
    },
  };
}

export { commitSession, destroySession, getSession };
