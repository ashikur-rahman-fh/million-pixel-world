"use client";

import { useState } from "react";

import { CanvasSurface } from "./canvas/CanvasSurface";
import { WorldHeader } from "./WorldHeader";
import { WorldToolbar } from "./WorldToolbar";

import { useWorldCanvas } from "@/hooks/use-world-canvas";

import type { DrawingSettings } from "@/types/world.types";

const INITIAL_SETTINGS: DrawingSettings = {
  tool: "pencil",
  color: "#ff0000",
};

export function WorldCanvas() {
  const [settings, setSettings] = useState<DrawingSettings>(INITIAL_SETTINGS);

  const { canvasRef, viewportRow } = useWorldCanvas(settings);

  return (
    <main className="world-container">
      <WorldHeader viewportRow={viewportRow} />

      <div className="world-viewport">
        <CanvasSurface ref={canvasRef} />

        <WorldToolbar settings={settings} onSettingsChange={setSettings} />
      </div>
    </main>
  );
}
