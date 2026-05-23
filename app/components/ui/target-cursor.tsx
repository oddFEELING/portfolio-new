import { gsap } from "gsap";
import type React from "react";
import { useCallback, useEffect, useMemo, useRef } from "react";

/**
 * TargetCursor (from reactbits.dev/animations/target-cursor).
 * Adapted: the original `./TargetCursor.css` import is replaced with inline
 * styles + Tailwind classes; the `.target-cursor-corner` class is kept
 * because the component selects the corners with `querySelectorAll`.
 */

export interface TargetCursorProps {
  targetSelector?: string;
  spinDuration?: number;
  hideDefaultCursor?: boolean;
  hoverDuration?: number;
  parallaxOn?: boolean;
}

const TargetCursor: React.FC<TargetCursorProps> = ({
  targetSelector = ".cursor-target",
  spinDuration = 2,
  hideDefaultCursor = true,
  hoverDuration = 0.2,
  parallaxOn = true,
}) => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const cornersRef = useRef<NodeListOf<HTMLDivElement> | null>(null);
  const spinTl = useRef<gsap.core.Timeline | null>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  const isActiveRef = useRef(false);
  const targetCornerPositionsRef = useRef<{ x: number; y: number }[] | null>(
    null
  );
  const tickerFnRef = useRef<(() => void) | null>(null);
  const activeStrengthRef = useRef({ current: 0 });

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }
    const hasTouchScreen =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.innerWidth <= 768;
    const operaAgent =
      (window as Window & { opera?: string }).opera ?? "";
    const userAgent = navigator.userAgent || navigator.vendor || operaAgent;
    const mobileRegex =
      /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    const isMobileUserAgent = mobileRegex.test(userAgent.toLowerCase());
    return (hasTouchScreen && isSmallScreen) || isMobileUserAgent;
  }, []);

  const constants = useMemo(() => ({ borderWidth: 3, cornerSize: 12 }), []);

  const moveCursor = useCallback((x: number, y: number) => {
    if (!cursorRef.current) {
      return;
    }
    gsap.to(cursorRef.current, { x, y, duration: 0.1, ease: "power3.out" });
  }, []);

  useEffect(() => {
    if (isMobile || !cursorRef.current) {
      return;
    }

    const originalCursor = document.body.style.cursor;
    if (hideDefaultCursor) {
      document.body.style.cursor = "none";
    }

    const cursor = cursorRef.current;
    cornersRef.current = cursor.querySelectorAll<HTMLDivElement>(
      ".target-cursor-corner"
    );

    let activeTarget: Element | null = null;
    let currentLeaveHandler: (() => void) | null = null;
    let resumeTimeout: ReturnType<typeof setTimeout> | null = null;

    const cleanupTarget = (target: Element) => {
      if (currentLeaveHandler) {
        target.removeEventListener("mouseleave", currentLeaveHandler);
      }
      currentLeaveHandler = null;
    };

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
    });

    const createSpinTimeline = () => {
      if (spinTl.current) {
        spinTl.current.kill();
      }
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursor, {
          rotation: "+=360",
          duration: spinDuration,
          ease: "none",
        });
    };

    createSpinTimeline();

    const tickerFn = () => {
      if (
        !(
          targetCornerPositionsRef.current &&
          cursorRef.current &&
          cornersRef.current
        )
      ) {
        return;
      }
      const strength = activeStrengthRef.current.current;
      if (strength === 0) {
        return;
      }
      const cursorX = gsap.getProperty(cursorRef.current, "x") as number;
      const cursorY = gsap.getProperty(cursorRef.current, "y") as number;
      const corners = Array.from(cornersRef.current);
      corners.forEach((corner, i) => {
        const currentX = gsap.getProperty(corner, "x") as number;
        const currentY = gsap.getProperty(corner, "y") as number;
        const positions = targetCornerPositionsRef.current;
        if (!positions) {
          return;
        }
        const targetX = positions[i].x - cursorX;
        const targetY = positions[i].y - cursorY;
        const finalX = currentX + (targetX - currentX) * strength;
        const finalY = currentY + (targetY - currentY) * strength;
        const duration =
          strength >= 0.99 ? (parallaxOn ? 0.2 : 0) : 0.05;
        gsap.to(corner, {
          x: finalX,
          y: finalY,
          duration,
          ease: duration === 0 ? "none" : "power1.out",
          overwrite: "auto",
        });
      });
    };

    tickerFnRef.current = tickerFn;

    const moveHandler = (e: MouseEvent) => moveCursor(e.clientX, e.clientY);
    window.addEventListener("mousemove", moveHandler);

    const scrollHandler = () => {
      if (!(activeTarget && cursorRef.current)) {
        return;
      }
      const mouseX = gsap.getProperty(cursorRef.current, "x") as number;
      const mouseY = gsap.getProperty(cursorRef.current, "y") as number;
      const elementUnderMouse = document.elementFromPoint(mouseX, mouseY);
      const isStillOverTarget =
        elementUnderMouse &&
        (elementUnderMouse === activeTarget ||
          elementUnderMouse.closest(targetSelector) === activeTarget);
      if (!isStillOverTarget) {
        currentLeaveHandler?.();
      }
    };
    window.addEventListener("scroll", scrollHandler, { passive: true });

    const mouseDownHandler = () => {
      if (!dotRef.current) {
        return;
      }
      gsap.to(dotRef.current, { scale: 0.7, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 0.9, duration: 0.2 });
    };

    const mouseUpHandler = () => {
      if (!dotRef.current) {
        return;
      }
      gsap.to(dotRef.current, { scale: 1, duration: 0.3 });
      gsap.to(cursorRef.current, { scale: 1, duration: 0.2 });
    };

    window.addEventListener("mousedown", mouseDownHandler);
    window.addEventListener("mouseup", mouseUpHandler);

    const enterHandler = (e: MouseEvent) => {
      const directTarget = e.target as Element;
      const allTargets: Element[] = [];
      let current: Element | null = directTarget;
      while (current && current !== document.body) {
        if (current.matches(targetSelector)) {
          allTargets.push(current);
        }
        current = current.parentElement;
      }
      const target = allTargets[0] || null;
      if (!(target && cursorRef.current && cornersRef.current)) {
        return;
      }
      if (activeTarget === target) {
        return;
      }
      if (activeTarget) {
        cleanupTarget(activeTarget);
      }
      if (resumeTimeout) {
        clearTimeout(resumeTimeout);
        resumeTimeout = null;
      }

      activeTarget = target;
      const corners = Array.from(cornersRef.current);
      for (const corner of corners) {
        gsap.killTweensOf(corner);
      }
      gsap.killTweensOf(cursorRef.current, "rotation");
      spinTl.current?.pause();
      gsap.set(cursorRef.current, { rotation: 0 });

      const rect = target.getBoundingClientRect();
      const { borderWidth, cornerSize } = constants;
      const cursorX = gsap.getProperty(cursorRef.current, "x") as number;
      const cursorY = gsap.getProperty(cursorRef.current, "y") as number;

      targetCornerPositionsRef.current = [
        { x: rect.left - borderWidth, y: rect.top - borderWidth },
        {
          x: rect.right + borderWidth - cornerSize,
          y: rect.top - borderWidth,
        },
        {
          x: rect.right + borderWidth - cornerSize,
          y: rect.bottom + borderWidth - cornerSize,
        },
        {
          x: rect.left - borderWidth,
          y: rect.bottom + borderWidth - cornerSize,
        },
      ];

      isActiveRef.current = true;
      if (tickerFnRef.current) {
        gsap.ticker.add(tickerFnRef.current);
      }

      gsap.to(activeStrengthRef.current, {
        current: 1,
        duration: hoverDuration,
        ease: "power2.out",
      });

      corners.forEach((corner, i) => {
        const positions = targetCornerPositionsRef.current;
        if (!positions) {
          return;
        }
        gsap.to(corner, {
          x: positions[i].x - cursorX,
          y: positions[i].y - cursorY,
          duration: 0.2,
          ease: "power2.out",
        });
      });

      const leaveHandler = () => {
        if (tickerFnRef.current) {
          gsap.ticker.remove(tickerFnRef.current);
        }
        isActiveRef.current = false;
        targetCornerPositionsRef.current = null;
        gsap.set(activeStrengthRef.current, { current: 0, overwrite: true });
        activeTarget = null;
        if (cornersRef.current) {
          const leaveCorners = Array.from(cornersRef.current);
          gsap.killTweensOf(leaveCorners);
          const { cornerSize: cs } = constants;
          const positions = [
            { x: -cs * 1.5, y: -cs * 1.5 },
            { x: cs * 0.5, y: -cs * 1.5 },
            { x: cs * 0.5, y: cs * 0.5 },
            { x: -cs * 1.5, y: cs * 0.5 },
          ];
          const tl = gsap.timeline();
          leaveCorners.forEach((corner, idx) => {
            tl.to(
              corner,
              {
                x: positions[idx].x,
                y: positions[idx].y,
                duration: 0.3,
                ease: "power3.out",
              },
              0
            );
          });
        }
        resumeTimeout = setTimeout(() => {
          if (!activeTarget && cursorRef.current && spinTl.current) {
            const currentRotation = gsap.getProperty(
              cursorRef.current,
              "rotation"
            ) as number;
            const normalizedRotation = currentRotation % 360;
            spinTl.current.kill();
            spinTl.current = gsap
              .timeline({ repeat: -1 })
              .to(cursorRef.current, {
                rotation: "+=360",
                duration: spinDuration,
                ease: "none",
              });
            gsap.to(cursorRef.current, {
              rotation: normalizedRotation + 360,
              duration: spinDuration * (1 - normalizedRotation / 360),
              ease: "none",
              onComplete: () => {
                spinTl.current?.restart();
              },
            });
          }
          resumeTimeout = null;
        }, 50);
        cleanupTarget(target);
      };
      currentLeaveHandler = leaveHandler;
      target.addEventListener("mouseleave", leaveHandler);
    };

    window.addEventListener("mouseover", enterHandler as EventListener);

    return () => {
      if (tickerFnRef.current) {
        gsap.ticker.remove(tickerFnRef.current);
      }
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseover", enterHandler as EventListener);
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("mousedown", mouseDownHandler);
      window.removeEventListener("mouseup", mouseUpHandler);
      if (activeTarget) {
        cleanupTarget(activeTarget);
      }
      spinTl.current?.kill();
      document.body.style.cursor = originalCursor;
      isActiveRef.current = false;
      targetCornerPositionsRef.current = null;
      activeStrengthRef.current.current = 0;
    };
  }, [
    targetSelector,
    spinDuration,
    moveCursor,
    constants,
    hideDefaultCursor,
    isMobile,
    hoverDuration,
    parallaxOn,
  ]);

  useEffect(() => {
    if (isMobile || !(cursorRef.current && spinTl.current)) {
      return;
    }
    if (spinTl.current.isActive()) {
      spinTl.current.kill();
      spinTl.current = gsap
        .timeline({ repeat: -1 })
        .to(cursorRef.current, {
          rotation: "+=360",
          duration: spinDuration,
          ease: "none",
        });
    }
  }, [spinDuration, isMobile]);

  if (isMobile) {
    return null;
  }

  const cornerBase: React.CSSProperties = {
    position: "absolute",
    left: "50%",
    top: "50%",
    width: 12,
    height: 12,
    border: "3px solid var(--muted-foreground)",
    opacity: 0.7,
    willChange: "transform",
  };

  return (
    <div
      className="pointer-events-none fixed top-0 left-0 z-[9999]"
      ref={cursorRef}
      style={{ width: 0, height: 0, transform: "translate(-50%,-50%)" }}
    >
      <div
        ref={dotRef}
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          width: 4,
          height: 4,
          background: "var(--muted-foreground)",
          opacity: 0.7,
          borderRadius: "50%",
          transform: "translate(-50%,-50%)",
          willChange: "transform",
        }}
      />
      <div
        className="target-cursor-corner"
        style={{
          ...cornerBase,
          borderRight: "none",
          borderBottom: "none",
          transform: "translate(-150%,-150%)",
        }}
      />
      <div
        className="target-cursor-corner"
        style={{
          ...cornerBase,
          borderLeft: "none",
          borderBottom: "none",
          transform: "translate(50%,-150%)",
        }}
      />
      <div
        className="target-cursor-corner"
        style={{
          ...cornerBase,
          borderLeft: "none",
          borderTop: "none",
          transform: "translate(50%,50%)",
        }}
      />
      <div
        className="target-cursor-corner"
        style={{
          ...cornerBase,
          borderRight: "none",
          borderTop: "none",
          transform: "translate(-150%,50%)",
        }}
      />
    </div>
  );
};

export default TargetCursor;
