import { WORLD_CONFIG } from "@/config/world.config";
import { worldToScreen, getVisibleWorldBounds } from "./coordinates";
import type { ViewportSize } from "@/types/world.types";
import { PixelStore } from "./pixel-store";
import { WorldCamera } from "./camera";

export class WorldRenderer {
  constructor(
    private readonly pixelStore: PixelStore,
    private readonly camera: WorldCamera,
  ) {}

  render(ctx: CanvasRenderingContext2D, viewport: ViewportSize): void {
    const { width, height } = viewport;
    const cellSize = WORLD_CONFIG.cellSize;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = WORLD_CONFIG.viewport.background;
    ctx.fillRect(0, 0, width, height);

    const bounds = getVisibleWorldBounds(width, height, this.camera.position.y);

    // Draw only pixels in visible chunks.
    const visiblePixels = this.pixelStore.getVisible(bounds);

    for (const pixel of visiblePixels) {
      const screen = worldToScreen(pixel, this.camera.position.y);

      ctx.fillStyle = pixel.color;
      ctx.fillRect(screen.x, screen.y, cellSize, cellSize);
    }

    this.drawGrid(ctx, viewport);
  }

  private drawGrid(ctx: CanvasRenderingContext2D, viewport: ViewportSize): void {
    const { width, height } = viewport;
    const cellSize = WORLD_CONFIG.cellSize;

    const offsetY = -(this.camera.position.y % 1) * cellSize;

    ctx.beginPath();
    ctx.strokeStyle = WORLD_CONFIG.grid.color;
    ctx.lineWidth = WORLD_CONFIG.grid.lineWidth;

    for (let x = 0; x <= width; x += cellSize) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, height);
    }

    for (let y = offsetY; y <= height; y += cellSize) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(width, y + 0.5);
    }

    ctx.stroke();
  }
}
