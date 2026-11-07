"use client";

import { forwardRef } from "react";

interface CanvasSurfaceProps {
  className?: string;
}

export const CanvasSurface = forwardRef<HTMLCanvasElement, CanvasSurfaceProps>(
  function CanvasSurface({ className }, ref) {
    return (
      <canvas
        ref={ref}
        className={className}
        aria-label="Interactive pixel world. Click and drag to draw."
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          touchAction: "none",
          cursor: "crosshair",
        }}
      />
    );
  },
);
