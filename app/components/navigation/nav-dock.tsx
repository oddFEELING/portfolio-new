import { useSidebar } from "@/components/ui/sidebar";

/** Left OS-style glyph pad that toggles the app sidebar. */
export function NavDock({ className }: { className?: string } = {}) {
  const { toggleSidebar, open, openMobile, isMobile } = useSidebar();
  const expanded = isMobile ? openMobile : open;
  const label = expanded ? "CLOSE NAV" : "OPEN NAV";

  return (
    <button
      aria-expanded={expanded}
      aria-label={expanded ? "Close navigation" : "Open navigation"}
      className={
        className ??
        "nav-attn-text group flex shrink-0 flex-col items-center gap-3 border-[#FF9800]/30 border-r px-2 py-3 transition-colors duration-300 hover:bg-[#FF9800]/10 sm:px-3"
      }
      onClick={toggleSidebar}
      type="button"
    >
      {/* Decorative traffic lights — not window controls */}
      <span aria-hidden="true" className="flex gap-1">
        <span className="size-1.5 rounded-full bg-[#FF5F57]" />
        <span className="size-1.5 rounded-full bg-[#FEBC2E]" />
        <span className="size-1.5 rounded-full bg-[#28C840]" />
      </span>

      <span
        aria-hidden="true"
        className="flex size-6 items-center justify-center border border-[#FF9800] font-mono text-[#FF9800] text-sm leading-none"
      >
        ≡
      </span>

      <span className="rotate-180 font-mono text-[0.65rem] text-[#FF9800] uppercase tracking-[0.3em] [writing-mode:vertical-rl] sm:text-xs">
        {label}
      </span>
    </button>
  );
}
