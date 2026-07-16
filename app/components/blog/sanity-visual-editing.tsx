import { VisualEditing } from "@sanity/visual-editing/react-router";
import { useEffect, useMemo, useState } from "react";
import { DisablePreviewMode } from "@/components/blog/disable-preview-mode";
import { client } from "@/sanity/client";
import { studioUrl } from "@/sanity/env";
import { useLiveMode } from "@/sanity/loader";

/** Connects live preview + overlays while the preview cookie is active. */
export function SanityVisualEditing() {
  const [ready, setReady] = useState(false);

  // Live mode needs a stega-aware browser client pointed at Studio.
  const liveClient = useMemo(
    () =>
      client.withConfig({
        stega: {
          enabled: true,
          studioUrl: studioUrl || "http://localhost:3333",
        },
      }),
    []
  );

  useLiveMode({ client: liveClient });

  useEffect(() => {
    setReady(true);
  }, []);

  if (!ready) {
    return null;
  }

  return (
    <>
      <VisualEditing />
      <DisablePreviewMode />
    </>
  );
}
