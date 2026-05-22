import type React from "react";
import { useEffect, useRef } from "react";

interface NoiseProps {
  patternRefreshInterval?: number;
  patternAlpha?: number;
}

/**
 * Animated film-grain overlay (adapted from reactbits.dev/animations/noise).
 * Fills its nearest positioned ancestor — wrap it in a `relative
 * overflow-hidden` container.
 */
const Noise: React.FC<NoiseProps> = ({
  patternRefreshInterval = 2,
  patternAlpha = 15,
}) => {
  const grainRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = grainRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) {
      return;
    }

    const canvasSize = 1024;
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    let frame = 0;
    let animationId: number;

    const drawGrain = () => {
      const imageData = ctx.createImageData(canvasSize, canvasSize);
      const { data } = imageData;
      for (let i = 0; i < data.length; i += 4) {
        const value = Math.random() * 255;
        data[i] = value;
        data[i + 1] = value;
        data[i + 2] = value;
        data[i + 3] = patternAlpha;
      }
      ctx.putImageData(imageData, 0, 0);
    };

    const loop = () => {
      if (frame % patternRefreshInterval === 0) {
        drawGrain();
      }
      frame += 1;
      animationId = window.requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.cancelAnimationFrame(animationId);
    };
  }, [patternRefreshInterval, patternAlpha]);

  return (
    <canvas
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 h-full w-full"
      ref={grainRef}
      style={{ imageRendering: "pixelated" }}
    />
  );
};

export default Noise;
