import { IconRefresh } from "@tabler/icons-react";
import { motion } from "motion/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useTheme, type Theme } from "@/components/providers/theme.provider";
import { cn } from "@/lib/utils";

/** Session flag — hero intro plays once per browser tab session. */
export const LANDING_HERO_STORAGE_KEY = "portfolio-landing-hero-seen";
/** Last painted frame time so remounts can restore the watermark pose. */
const LANDING_HERO_END_KEY = "portfolio-landing-hero-end";
/** Light-mode walk-in clip. */
const VIDEO_SRC_LIGHT = "/intro_loading_video.webm";
/** Dark-mode walk-in clip. */
const VIDEO_SRC_DARK = "/intro_loading_video_dark.webm";
/** Seconds into the clip when hero copy fades in (also settles the layout). */
const TEXT_REVEAL_AT = 4;
/** Seconds into the clip when the contrast scrim starts fading in. */
const SCRIM_REVEAL_AT = 4;
/** Seconds into the clip when the video starts fading to a watermark. */
const WATERMARK_AT = 4;
/** Fade duration for the hero copy reveal. */
const TEXT_FADE_MS = 700;
/** Fade duration for the contrast scrim reveal. */
const SCRIM_FADE_MS = 700;
/** How faint the frozen final frame sits once playback ends. */
const WATERMARK_OPACITY = 0.1;
/** Fade duration into the watermark state. */
const WATERMARK_FADE_MS = 1200;
/** Scrim opacity once the video has settled as a watermark. */
const SCRIM_WATERMARK_OPACITY = 0.35;
/** Duration for the hero expand → grid-cell layout morph. */
export const LANDING_LAYOUT_MS = 900;
/** Shared easing for landing layout / reveal motion. */
export const LANDING_EASE = [0.22, 1, 0.36, 1] as [
  number,
  number,
  number,
  number,
];

type Mode = "checking" | "play" | "static";
type ResolvedTheme = "light" | "dark";

type LandingHeroContextValue = {
  replay: () => void;
};

const LandingHeroContext = createContext<LandingHeroContextValue | null>(null);

type LandingHeroProps = {
  children: ReactNode;
  /** Fires when the hero should occupy its final grid cell (and siblings may appear). */
  onSettledChange?: (settled: boolean) => void;
};

/** Whether this tab session has already finished the landing intro. */
export function hasSeenLandingHero() {
  if (typeof window === "undefined") {
    return false;
  }
  try {
    return sessionStorage.getItem(LANDING_HERO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

type IntroBootState = {
  mode: Mode;
  showText: boolean;
  showScrim: boolean;
  isWatermark: boolean;
};

/** Resolve first-paint intro state so return visits never re-run the layout morph. */
function getIntroBootState(): IntroBootState {
  if (typeof window === "undefined") {
    return {
      mode: "checking",
      showText: false,
      showScrim: false,
      isWatermark: false,
    };
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  const alreadySeen = hasSeenLandingHero();

  if (prefersReducedMotion || alreadySeen) {
    return {
      mode: "static",
      showText: true,
      showScrim: true,
      isWatermark: true,
    };
  }

  return {
    mode: "play",
    showText: false,
    showScrim: false,
    isWatermark: false,
  };
}

/** Resolve stored theme (including system) to light or dark. */
function resolveTheme(theme: Theme): ResolvedTheme {
  if (theme === "light" || theme === "dark") {
    return theme;
  }
  if (typeof window === "undefined") {
    return "dark";
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

/** Pick the matching WebM for the resolved theme. */
function videoSrcFor(theme: ResolvedTheme) {
  return theme === "dark" ? VIDEO_SRC_DARK : VIDEO_SRC_LIGHT;
}

/** Hero control that restarts the walk-in clip from the beginning. */
export function HeroReplayButton({ className }: { className?: string }) {
  const ctx = useContext(LandingHeroContext);
  if (!ctx) {
    return null;
  }

  return (
    <span
      className={cn(
        "cursor-pointer rounded-md border bg-background p-2 text-muted-foreground transition-colors hover:border-muted-foreground hover:bg-muted hover:text-primary",
        className
      )}
      onClick={ctx.replay}
      role="button"
      tabIndex={0}
      title="Replay intro"
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          ctx.replay();
        }
      }}
    >
      <IconRefresh size={22} stroke={1.5} />
    </span>
  );
}

/**
 * Landing hero shell: plays the intro WebM full-bleed, then at 4s morphs into
 * its grid cell as copy, scrim, and watermark fade in together. Theme swaps
 * mid-play keep the same timestamp.
 */
export function LandingHero({ children, onSettledChange }: LandingHeroProps) {
  const { theme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const bootRef = useRef<IntroBootState | null>(null);
  if (bootRef.current === null) {
    bootRef.current = getIntroBootState();
  }
  const boot = bootRef.current;

  const [mode, setMode] = useState<Mode>(boot.mode);
  const [showText, setShowText] = useState(boot.showText);
  const [showScrim, setShowScrim] = useState(boot.showScrim);
  const [isWatermark, setIsWatermark] = useState(boot.isWatermark);
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(() =>
    resolveTheme(theme)
  );
  // Guards against double-marking the session on timeupdate spam.
  const revealedRef = useRef(boot.showText);
  // Guards against repeatedly triggering the scrim fade.
  const scrimRevealedRef = useRef(boot.showScrim);
  // Guards against repeatedly triggering the watermark fade.
  const watermarkedRef = useRef(boot.isWatermark);
  // Tracks the last applied src so theme swaps can seek instead of restarting.
  const activeSrcRef = useRef<string | null>(null);
  // Layout morph only for first-play / replay — never on remount after seen.
  const allowLayoutMotionRef = useRef(boot.mode === "play");
  // Removes pending freeze listeners if the clip is swapped mid-wait.
  const freezeCleanupRef = useRef<(() => void) | null>(null);

  // Hero fills the grid until copy reveals, then collapses into its cell.
  const settled = showText;

  // Tell the page when siblings can enter the grid.
  useEffect(() => {
    onSettledChange?.(settled);
  }, [settled, onSettledChange]);

  // Keep resolved theme in sync when the user toggles (or system preference flips).
  useEffect(() => {
    setResolvedTheme(resolveTheme(theme));

    if (theme !== "system") {
      return;
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => setResolvedTheme(resolveTheme("system"));
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [theme]);

  // Load / swap the theme clip, preserving playhead when possible.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || mode === "checking") {
      return;
    }

    const nextSrc = videoSrcFor(resolvedTheme);
    const previousSrc = activeSrcRef.current;
    const isSwap = previousSrc !== null && previousSrc !== nextSrc;
    const resumeTime = isSwap ? video.currentTime : 0;
    const wasPlaying =
      isSwap && mode === "play" && !video.paused && !video.ended;

    /** Pause on the last painted frame (exact duration often blanks in browsers). */
    const freezeAtEnd = () => {
      video.pause();
      freezeCleanupRef.current?.();
      freezeCleanupRef.current = null;

      const seek = () => {
        const saved = Number(sessionStorage.getItem(LANDING_HERO_END_KEY));
        let end = Number.NaN;

        if (Number.isFinite(saved) && saved > 0) {
          end = saved;
        } else if (video.seekable.length > 0) {
          end = video.seekable.end(video.seekable.length - 1);
        } else if (Number.isFinite(video.duration) && video.duration > 0) {
          end = video.duration;
        }

        if (!Number.isFinite(end) || end <= 0) {
          return false;
        }

        // Nudge before the true end so the final frame stays painted.
        video.currentTime = Math.max(0, end - 0.05);
        freezeCleanupRef.current?.();
        freezeCleanupRef.current = null;
        return true;
      };

      if (seek()) {
        return;
      }

      const onMeta = () => {
        seek();
      };
      video.addEventListener("loadedmetadata", onMeta);
      video.addEventListener("durationchange", onMeta);
      video.addEventListener("canplay", onMeta);
      freezeCleanupRef.current = () => {
        video.removeEventListener("loadedmetadata", onMeta);
        video.removeEventListener("durationchange", onMeta);
        video.removeEventListener("canplay", onMeta);
      };
    };

    const applyPosition = () => {
      if (mode === "static") {
        freezeAtEnd();
        return;
      }

      // Mid-play theme swap: continue from the previous timestamp.
      if (isSwap) {
        const clamped = Math.min(
          resumeTime,
          Number.isFinite(video.duration) ? video.duration : resumeTime
        );
        video.currentTime = clamped;
        if (wasPlaying || mode === "play") {
          void video.play().catch(() => {
            // Autoplay can fail after a src swap; ignore and wait for user gesture.
          });
        }
        return;
      }

      if (mode === "play") {
        void video.play().catch(() => {
          // First play may be blocked; muted + playsInline usually allows it.
        });
      }
    };

    activeSrcRef.current = nextSrc;

    // New theme clip — load it, then seek / resume.
    if (previousSrc !== nextSrc) {
      video.src = nextSrc;
      video.load();
      video.addEventListener("loadeddata", applyPosition, { once: true });
      return () => {
        video.removeEventListener("loadeddata", applyPosition);
        freezeCleanupRef.current?.();
        freezeCleanupRef.current = null;
      };
    }

    applyPosition();
    return () => {
      freezeCleanupRef.current?.();
      freezeCleanupRef.current = null;
    };
  }, [mode, resolvedTheme]);

  // Restart the walk-in from 0 and re-expand before the timeline runs again.
  const replay = useCallback(() => {
    revealedRef.current = false;
    scrimRevealedRef.current = false;
    watermarkedRef.current = false;
    allowLayoutMotionRef.current = true;
    setShowScrim(false);
    setShowText(false);
    setIsWatermark(false);
    setMode("play");

    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.currentTime = 0;
    void video.play().catch(() => {
      // Click is a user gesture, so play should usually succeed.
    });
  }, []);

  // At 4s: copy + layout settle, scrim, and watermark fade all fire together.
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || mode !== "play") {
      return;
    }

    if (!scrimRevealedRef.current && video.currentTime >= SCRIM_REVEAL_AT) {
      scrimRevealedRef.current = true;
      setShowScrim(true);
    }

    if (!revealedRef.current && video.currentTime >= TEXT_REVEAL_AT) {
      revealedRef.current = true;
      setShowText(true);
      sessionStorage.setItem(LANDING_HERO_STORAGE_KEY, "1");
    }

    if (video.currentTime >= WATERMARK_AT) {
      // Keep the latest frame so remounts restore the final pose, not mid-walk.
      sessionStorage.setItem(LANDING_HERO_END_KEY, String(video.currentTime));
      if (!watermarkedRef.current) {
        watermarkedRef.current = true;
        setIsWatermark(true);
      }
    }
  };

  // Freeze on the final frame once playback finishes.
  const handleEnded = () => {
    const video = videoRef.current;
    if (video && Number.isFinite(video.currentTime) && video.currentTime > 0) {
      sessionStorage.setItem(LANDING_HERO_END_KEY, String(video.currentTime));
    } else if (video && Number.isFinite(video.duration) && video.duration > 0) {
      sessionStorage.setItem(LANDING_HERO_END_KEY, String(video.duration));
    }
    sessionStorage.setItem(LANDING_HERO_STORAGE_KEY, "1");
    setShowScrim(true);
    setShowText(true);
    setIsWatermark(true);
    setMode("static");
  };

  return (
    <LandingHeroContext.Provider value={{ replay }}>
      <motion.header
        className={cn(
          "landing-section relative flex w-full flex-col justify-center gap-5 overflow-hidden border px-4 py-14 md:min-h-0 md:gap-4 md:p-6",
          settled
            ? "md:col-span-4 md:row-span-2"
            : "min-h-[70vh] md:col-span-6 md:row-span-3 md:min-h-0"
        )}
        layout={allowLayoutMotionRef.current}
        transition={{
          layout: {
            duration: allowLayoutMotionRef.current
              ? LANDING_LAYOUT_MS / 1000
              : 0,
            ease: LANDING_EASE,
          },
        }}
      >
        {/* Theme-matched walk-in clip; fades to a watermark once playback ends. */}
        {mode !== "checking" && (
          <motion.video
            ref={videoRef}
            animate={{ opacity: isWatermark ? WATERMARK_OPACITY : 1 }}
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
            initial={false}
            muted
            playsInline
            preload="auto"
            transition={{
              duration: WATERMARK_FADE_MS / 1000,
              ease: LANDING_EASE,
            }}
            onEnded={handleEnded}
            onTimeUpdate={handleTimeUpdate}
          />
        )}

        {/* Soft corner vignette — eases with the watermark so edges stay subtle. */}
        <motion.div
          animate={{ opacity: isWatermark ? WATERMARK_OPACITY : 1 }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
          initial={false}
          style={{
            background: [
              "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.08) 100%)",
              "linear-gradient(to top left, transparent 60%, rgba(0,0,0,0.06) 100%)",
              "linear-gradient(to top right, transparent 60%, rgba(0,0,0,0.06) 100%)",
              "linear-gradient(to bottom left, transparent 60%, rgba(0,0,0,0.06) 100%)",
              "linear-gradient(to bottom right, transparent 60%, rgba(0,0,0,0.06) 100%)",
            ].join(", "),
          }}
          transition={{
            duration: WATERMARK_FADE_MS / 1000,
            ease: LANDING_EASE,
          }}
        />

        {/* Theme scrim — fades in 1s before the copy, then softens for watermark. */}
        <motion.div
          animate={{
            opacity: showScrim
              ? isWatermark
                ? SCRIM_WATERMARK_OPACITY
                : 1
              : 0,
          }}
          aria-hidden="true"
          className={
            resolvedTheme === "light"
              ? "pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-white/90 via-white/55 to-transparent md:via-white/45"
              : "pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-black/90 via-black/55 to-transparent md:via-black/45"
          }
          initial={false}
          transition={{
            duration: isWatermark
              ? WATERMARK_FADE_MS / 1000
              : SCRIM_FADE_MS / 1000,
            ease: LANDING_EASE,
          }}
        />

        {/* Copy sits above the video and fades in at the reveal mark. */}
        <motion.div
          animate={{ opacity: showText ? 1 : 0 }}
          className="relative z-10 flex w-full flex-col gap-5 md:gap-4"
          initial={false}
          style={{ pointerEvents: showText ? "auto" : "none" }}
          transition={{ duration: TEXT_FADE_MS / 1000, ease: LANDING_EASE }}
        >
          {children}
        </motion.div>
      </motion.header>
    </LandingHeroContext.Provider>
  );
}
