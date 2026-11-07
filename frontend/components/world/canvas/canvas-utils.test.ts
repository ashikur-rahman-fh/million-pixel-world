import { describe, expect, it, vi, afterEach } from "vitest";
import { resizeCanvas, setupCanvasContext } from "./canvas-utils";

describe("canvas-utils", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("resizeCanvas", () => {
    it("should resize canvas according to device pixel ratio", () => {
      vi.stubGlobal("window", {
        devicePixelRatio: 2,
      });

      const canvas = {
        width: 0,
        height: 0,
        style: {},
      } as HTMLCanvasElement;

      const result = resizeCanvas(canvas, 800, 600);

      expect(canvas.width).toBe(1600);
      expect(canvas.height).toBe(1200);
      expect(canvas.style.width).toBe("800px");
      expect(canvas.style.height).toBe("600px");

      expect(result).toEqual({
        width: 800,
        height: 600,
        pixelRatio: 2,
      });
    });

    it("should use pixel ratio 1 when device pixel ratio is unavailable", () => {
      vi.stubGlobal("window", {
        devicePixelRatio: undefined,
      });

      const canvas = {
        width: 0,
        height: 0,
        style: {},
      } as HTMLCanvasElement;

      const result = resizeCanvas(canvas, 800, 600);

      expect(canvas.width).toBe(800);
      expect(canvas.height).toBe(600);
      expect(result.pixelRatio).toBe(1);
    });
  });

  describe("setupCanvasContext", () => {
    it("should configure the canvas pixel ratio", () => {
      const context = {
        setTransform: vi.fn(),
      } as unknown as CanvasRenderingContext2D;

      setupCanvasContext(context, 2);

      expect(context.setTransform).toHaveBeenCalledWith(2, 0, 0, 2, 0, 0);
    });
  });
});
