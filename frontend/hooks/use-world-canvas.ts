"use client";

import { useEffect, useRef, useState } from "react";

import { screenToWorld } from "@/lib/world/coordinates";
import { WorldEngine } from "@/lib/world/world-engine";

import type { DrawingSettings } from "@/types/world.types";

export function useWorldCanvas(settings: DrawingSettings) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const settingsRef = useRef(settings);

  // eslint-disable-next-line react-hooks/refs
  settingsRef.current = settings;

  const drawingRef = useRef(false);
  const paintedRef = useRef(new Set<string>());

  const [viewportRow, setViewportRow] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const engine = new WorldEngine();

    let animationFrame = 0;

    function render() {
      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        const dpr = window.devicePixelRatio || 1;

        const width = canvas!.clientWidth;
        const height = canvas!.clientHeight;

        const pixelWidth = Math.round(width * dpr);
        const pixelHeight = Math.round(height * dpr);

        if (canvas!.width !== pixelWidth || canvas!.height !== pixelHeight) {
          canvas!.width = pixelWidth;
          canvas!.height = pixelHeight;
        }

        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

        engine.renderer.render(ctx!, {
          width,
          height,
        });
      });
    }

    function getWorldPosition(e: PointerEvent) {
      const rect = canvas!.getBoundingClientRect();

      return screenToWorld(
        {
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        },
        engine.camera.position.y,
      );
    }

    function logPixels(pixels: { x: number; y: number }[]) {
      for (const pixel of pixels) {
        const key = `${pixel.x}:${pixel.y}`;

        if (paintedRef.current.has(key)) continue;

        paintedRef.current.add(key);

        console.log(
          settingsRef.current.tool === "eraser"
            ? `Erased pixel: x=${pixel.x}, y=${pixel.y}`
            : `Drawn pixel: x=${pixel.x}, y=${pixel.y}`,
        );
      }
    }

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;

      drawingRef.current = true;
      paintedRef.current.clear();

      canvas!.setPointerCapture(e.pointerId);

      const position = getWorldPosition(e);
      const currentSettings = settingsRef.current;

      const pixels = engine.drawing.start(position, currentSettings.tool, currentSettings.color);

      logPixels(pixels);
      render();
    }

    function onPointerMove(e: PointerEvent) {
      if (!drawingRef.current) return;

      const position = getWorldPosition(e);
      const currentSettings = settingsRef.current;

      const pixels = engine.drawing.move(position, currentSettings.tool, currentSettings.color);

      logPixels(pixels);
      render();
    }

    function stopDrawing() {
      if (!drawingRef.current) return;

      drawingRef.current = false;
      engine.drawing.end();
      paintedRef.current.clear();
    }

    function onWheel(e: WheelEvent) {
      e.preventDefault();

      let delta = e.deltaY;

      if (e.deltaMode === WheelEvent.DOM_DELTA_LINE) {
        delta *= 16;
      } else if (e.deltaMode === WheelEvent.DOM_DELTA_PAGE) {
        delta *= canvas!.clientHeight;
      }

      engine.camera.scroll(delta);

      setViewportRow(engine.camera.currentRow);
      render();
    }

    const resizeObserver = new ResizeObserver(render);

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointercancel", stopDrawing);
    canvas.addEventListener("lostpointercapture", stopDrawing);

    canvas.addEventListener("wheel", onWheel, {
      passive: false,
    });

    resizeObserver.observe(canvas);

    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();

      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", stopDrawing);
      canvas.removeEventListener("pointercancel", stopDrawing);
      canvas.removeEventListener("lostpointercapture", stopDrawing);
      canvas.removeEventListener("wheel", onWheel);

      engine.drawing.end();
    };
  }, []);

  return {
    canvasRef,
    viewportRow,
  };
}
