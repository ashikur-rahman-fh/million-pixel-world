"use client";

import { CanvasSurface } from "./canvas/CanvasSurface";
import { WorldHeader } from "./WorldHeader";
import { useWorldCanvas } from "@/hooks/use-world-canvas";

export function WorldCanvas() {
  const { canvasRef, viewportRow } = useWorldCanvas();

  return (
    <div className="world-container flex-1 relative flex flex-col">
      <div className="world-viewport relative">
        <WorldHeader viewportRow={viewportRow} />
        <CanvasSurface ref={canvasRef} />
      </div>
    </div>
  );
}
