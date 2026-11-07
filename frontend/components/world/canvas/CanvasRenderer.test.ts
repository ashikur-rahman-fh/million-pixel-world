import { beforeEach, describe, expect, it, vi } from "vitest";
import { WORLD_CONFIG } from "@/config/world.config";
import { CanvasRenderer } from "./CanvasRenderer";
import type { GridDimensions } from "./types";

describe("CanvasRenderer", () => {
  let context: CanvasRenderingContext2D;
  let renderer: CanvasRenderer;

  const dimensions: GridDimensions = {
    columns: 10,
    rows: 5,
    width: 100,
    height: 50,
  };

  beforeEach(() => {
    context = {
      clearRect: vi.fn(),
      fillRect: vi.fn(),
      beginPath: vi.fn(),
      moveTo: vi.fn(),
      lineTo: vi.fn(),
      stroke: vi.fn(),
      fillStyle: "",
      strokeStyle: "",
      lineWidth: 0,
    } as unknown as CanvasRenderingContext2D;

    renderer = new CanvasRenderer(context);
  });

  it("should clear the canvas", () => {
    renderer.render(dimensions);

    expect(context.clearRect).toHaveBeenCalledWith(0, 0, 100, 50);
  });

  it("should draw the background", () => {
    renderer.render(dimensions);

    expect(context.fillStyle).toBe(WORLD_CONFIG.colors.background);
    expect(context.fillRect).toHaveBeenCalledWith(0, 0, 100, 50);
  });

  it("should draw the correct number of vertical grid lines", () => {
    renderer.render(dimensions);

    const calls = vi.mocked(context.moveTo).mock.calls;
    const verticalLines = calls.slice(0, 11);

    expect(verticalLines).toHaveLength(11);

    // prettier-ignore
    expect(verticalLines).toEqual(
      Array.from({ length: 11 }, (_, i) => [(i * WORLD_CONFIG.cellSize) + 0.5, 0]),
    );
  });

  it("should draw the correct number of horizontal grid lines", () => {
    renderer.render(dimensions);

    const calls = vi.mocked(context.moveTo).mock.calls;
    const horizontalLines = calls.slice(11);

    expect(horizontalLines).toHaveLength(6);

    // prettier-ignore
    expect(horizontalLines).toEqual(
      Array.from({ length: 6 }, (_, i) => [0, (i * WORLD_CONFIG.cellSize) + 0.5]),
    );
  });

  it("should use the configured grid color", () => {
    renderer.render(dimensions);

    expect(context.strokeStyle).toBe(WORLD_CONFIG.colors.grid);
  });

  it("should stroke the grid once", () => {
    renderer.render(dimensions);

    expect(context.stroke).toHaveBeenCalledTimes(1);
  });
});
