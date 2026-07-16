import { useEffect, useState } from "react";

/** Exit control shown only when previewing outside the Presentation iframe. */
export function DisablePreviewMode() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    setShow(window === window.parent && !window.opener);
  }, []);

  if (!show) {
    return null;
  }

  return (
    <a
      className="fixed right-4 bottom-4 z-50 border border-[#FF9800]/40 bg-background px-3 py-2 font-mono text-[#FF9800] text-xs uppercase tracking-wider shadow-sm"
      href="/api/preview-mode/disable?redirect=/blog"
    >
      Disable preview
    </a>
  );
}
