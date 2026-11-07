import type { CanvasDimensions } from "./types";

export function resizeCanvas(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
): CanvasDimensions {
  const pixelRatio = window.devicePixelRatio || 1;

  canvas.width = Math.round(width * pixelRatio);
  canvas.height = Math.round(height * pixelRatio);

  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;

  return {
    width,
    height,
    pixelRatio,
  };
}

export function setupCanvasContext(context: CanvasRenderingContext2D, pixelRatio: number): void {
  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
}
