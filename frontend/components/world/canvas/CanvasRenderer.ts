import { WORLD_CONFIG } from "@/config/world.config";

import type { GridDimensions } from "./types";

export class CanvasRenderer {
  private context: CanvasRenderingContext2D;

  constructor(context: CanvasRenderingContext2D) {
    this.context = context;
  }

  public render(dimensions: GridDimensions): void {
    this.clear(dimensions);
    this.drawBackground(dimensions);
    this.drawGrid(dimensions);
  }

  private clear(dimensions: GridDimensions): void {
    this.context.clearRect(0, 0, dimensions.width, dimensions.height);
  }

  private drawBackground(dimensions: GridDimensions): void {
    const { context } = this;

    context.fillStyle = WORLD_CONFIG.colors.background;

    context.fillRect(0, 0, dimensions.width, dimensions.height);
  }

  private drawGrid(dimensions: GridDimensions): void {
    const { context } = this;
    const cellSize = WORLD_CONFIG.cellSize;

    context.beginPath();

    context.strokeStyle = WORLD_CONFIG.colors.grid;
    context.lineWidth = 1;

    for (let i = 0; i <= dimensions.columns; i++) {
      // prettier-ignore
      const x = (i * cellSize) + 0.5;

      context.moveTo(x, 0);
      context.lineTo(x, dimensions.height);
    }

    // Horizontal lines
    for (let i = 0; i <= dimensions.rows; i++) {
      const y = i * cellSize + 0.5;

      context.moveTo(0, y);
      context.lineTo(dimensions.width, y);
    }

    context.stroke();
  }
}
