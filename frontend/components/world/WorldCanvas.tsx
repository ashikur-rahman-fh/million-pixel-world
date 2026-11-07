"use client";

import { useEffect, useRef } from "react";

import { WORLD_CONFIG } from "@/config/world.config";

import { CanvasRenderer } from "./canvas/CanvasRenderer";
import { resizeCanvas, setupCanvasContext } from "./canvas/canvas-utils";

import type { GridDimensions } from "./canvas/types";

export function WorldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;

    if (!canvas || !container) return;

    const context = canvas.getContext("2d", {
      alpha: false,
    });

    if (!context) return;

    const renderer = new CanvasRenderer(context);

    const render = () => {
      const width = container.clientWidth;

      if (width === 0) return;

      const columns = Math.floor(width / WORLD_CONFIG.cellSize);

      const rows = Math.ceil(WORLD_CONFIG.totalCells / columns);

      const dimensions: GridDimensions = {
        columns,
        rows,
        width,
        height: rows * WORLD_CONFIG.cellSize,
      };

      const canvasDimensions = resizeCanvas(canvas, dimensions.width, dimensions.height);

      setupCanvasContext(context, canvasDimensions.pixelRatio);

      renderer.render(dimensions);
    };

    const observer = new ResizeObserver(render);

    observer.observe(container);

    render();

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="canvas-container">
      <canvas ref={canvasRef} className="block" />
    </div>
  );
}
