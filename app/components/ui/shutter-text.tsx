import { AnimatePresence, motion, useInView } from "motion/react";
import type { HTMLAttributes } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

/**
 * ShutterText (adapted from jolyui.dev/docs/components/text-animations/shutter-text).
 * Adaptations: imports from `motion/react` (the renamed framer-motion shipped
 * as the `motion` package); slice layers use the project's orange accent
 * (#FF9800) and `text-muted-foreground` instead of indigo/emerald.
 */

interface ShutterTextProps extends HTMLAttributes<HTMLDivElement> {
  text?: string;
  trigger?: "auto" | "scroll" | "click" | "hover";
}

export function ShutterText({
  text = "IMMERSE",
  trigger = "auto",
  className = "",
  ...props
}: ShutterTextProps) {
  const [count, setCount] = useState(0);
  const [animating, setAnimating] = useState(trigger === "auto");
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: false, amount: 0.5 });
  const characters = text.split("");

  useEffect(() => {
    if (trigger === "scroll" && isInView) {
      setAnimating(true);
      setCount((c) => c + 1);
    }
    if (trigger === "scroll" && !isInView) {
      setAnimating(false);
    }
  }, [trigger, isInView]);

  useEffect(() => {
    if (trigger === "auto") {
      setAnimating(true);
      setCount((c) => c + 1);
    }
  }, [trigger]);

  const handleClick = useCallback(() => {
    if (trigger === "click") {
      setAnimating(true);
      setCount((c) => c + 1);
    }
  }, [trigger]);

  const handleMouseEnter = useCallback(() => {
    if (trigger === "hover") {
      setAnimating(true);
      setCount((c) => c + 1);
    }
  }, [trigger]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === "hover") {
      setAnimating(false);
    }
  }, [trigger]);

  return (
    <div
      className={`relative inline-flex flex-wrap items-center justify-center ${className}`}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={ref}
      role="button"
      tabIndex={0}
      {...props}
    >
      <AnimatePresence mode="wait">
        {animating ? (
          <motion.span
            className="flex flex-wrap items-center justify-center"
            key={count}
          >
            {characters.map((char, i) => (
              <span
                className="relative inline-block overflow-hidden px-[0.1vw]"
                key={`${char}-${i}`}
              >
                <motion.span
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  className="inline-block font-semibold leading-none tracking-tighter"
                  initial={{ opacity: 0, filter: "blur(10px)" }}
                  transition={{ delay: i * 0.04 + 0.3, duration: 0.8 }}
                >
                  {char === " " ? " " : char}
                </motion.span>

                <motion.span
                  animate={{ x: "100%", opacity: [0, 1, 0] }}
                  className="pointer-events-none absolute inset-0 z-10 inline-block font-semibold text-[#FF9800] leading-none"
                  initial={{ x: "-100%", opacity: 0 }}
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 35%, 0 35%)" }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.04,
                    ease: "easeInOut",
                  }}
                >
                  {char === " " ? " " : char}
                </motion.span>

                <motion.span
                  animate={{ x: "-100%", opacity: [0, 1, 0] }}
                  className="pointer-events-none absolute inset-0 z-10 inline-block font-semibold text-muted-foreground leading-none"
                  initial={{ x: "100%", opacity: 0 }}
                  style={{
                    clipPath: "polygon(0 35%, 100% 35%, 100% 65%, 0 65%)",
                  }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.04 + 0.1,
                    ease: "easeInOut",
                  }}
                >
                  {char === " " ? " " : char}
                </motion.span>

                <motion.span
                  animate={{ x: "100%", opacity: [0, 1, 0] }}
                  className="pointer-events-none absolute inset-0 z-10 inline-block font-semibold text-[#FF9800] leading-none"
                  initial={{ x: "-100%", opacity: 0 }}
                  style={{
                    clipPath: "polygon(0 65%, 100% 65%, 100% 100%, 0 100%)",
                  }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.04 + 0.2,
                    ease: "easeInOut",
                  }}
                >
                  {char === " " ? " " : char}
                </motion.span>
              </span>
            ))}
          </motion.span>
        ) : (
          <span className="flex flex-wrap items-center justify-center">
            {characters.map((char, i) => (
              <span
                className="relative inline-block overflow-hidden px-[0.1vw]"
                key={`${char}-${i}`}
              >
                <span className="inline-block font-semibold leading-none tracking-tighter">
                  {char === " " ? " " : char}
                </span>
              </span>
            ))}
          </span>
        )}
      </AnimatePresence>
    </div>
  );
}
