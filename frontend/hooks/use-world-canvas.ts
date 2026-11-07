"use client";

import { useEffect, useRef, useState } from "react";

import { WORLD_CONFIG } from "@/config/world.config";
import { screenToWorld } from "@/lib/world/coordinates";
import { WorldEngine } from "@/lib/world/world-engine";

export function useWorldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<WorldEngine | null>(null);

  const drawingRef = useRef(false);
  const paintedRef = useRef(new Set<string>());

  const [viewportRow, setViewportRow] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) return;

    const engine = new WorldEngine();
    engineRef.current = engine;

    let animationFrame = 0;

    function render() {
      cancelAnimationFrame(animationFrame);

      animationFrame = requestAnimationFrame(() => {
        if (!canvas || !ctx) return;

        const dpr = window.devicePixelRatio || 1;

        const width = canvas.clientWidth;
        const height = canvas.clientHeight;

        const pixelWidth = Math.round(width * dpr);
        const pixelHeight = Math.round(height * dpr);

        if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
          canvas.width = pixelWidth;
          canvas.height = pixelHeight;
        }

        ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

        engine.renderer.render(ctx!, {
          width,
          height,
        });
      });
    }

    function updateViewportRow() {
      setViewportRow(engine.camera.currentRow);
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

        console.log(`Drawn pixel: x=${pixel.x}, y=${pixel.y}`);
      }
    }

    function onPointerDown(e: PointerEvent) {
      if (e.button !== 0) return;

      drawingRef.current = true;
      paintedRef.current.clear();

      canvas!.setPointerCapture(e.pointerId);

      const position = getWorldPosition(e);

      const pixels = engine.drawing.start(position, WORLD_CONFIG.drawing.defaultColor);

      logPixels(pixels);
      render();
    }

    function onPointerMove(e: PointerEvent) {
      if (!drawingRef.current) return;

      const position = getWorldPosition(e);

      const pixels = engine.drawing.move(position, WORLD_CONFIG.drawing.defaultColor);

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

      updateViewportRow();
      render();
    }

    const resizeObserver = new ResizeObserver(() => {
      render();
    });

    canvas.addEventListener("pointerdown", onPointerDown);
    canvas.addEventListener("pointermove", onPointerMove);
    canvas.addEventListener("pointerup", stopDrawing);
    canvas.addEventListener("pointercancel", stopDrawing);

    canvas.addEventListener("wheel", onWheel, {
      passive: false,
    });

    canvas.addEventListener("lostpointercapture", stopDrawing);

    resizeObserver.observe(canvas);

    render();

    return () => {
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();

      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", stopDrawing);
      canvas.removeEventListener("pointercancel", stopDrawing);
      canvas.removeEventListener("wheel", onWheel);
      canvas.removeEventListener("lostpointercapture", stopDrawing);

      engineRef.current = null;
    };
  }, []);

  return {
    canvasRef,
    viewportRow,
  };
}
