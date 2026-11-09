import type { DrawingTool, Pixel, WorldPosition } from "@/types/world.types";

import { PixelStore } from "./pixel-store";

export class DrawingEngine {
  private previousPosition: WorldPosition | null = null;

  constructor(private readonly pixelStore: PixelStore) {}

  start(position: WorldPosition, tool: DrawingTool, color: string): Pixel[] {
    this.previousPosition = position;

    return this.apply(position, tool, color);
  }

  move(position: WorldPosition, tool: DrawingTool, color: string): Pixel[] {
    if (!this.previousPosition) {
      return this.start(position, tool, color);
    }

    const points = this.interpolate(this.previousPosition, position);

    this.previousPosition = position;

    return points.flatMap((point) => this.apply(point, tool, color));
  }

  end(): void {
    this.previousPosition = null;
  }

  private apply(position: WorldPosition, tool: DrawingTool, color: string): Pixel[] {
    if (position.x < 0 || position.y < 0) {
      return [];
    }

    if (tool === "eraser") {
      const deleted = this.pixelStore.delete(position);

      return deleted ? [{ ...position, color: "transparent" }] : [];
    }

    const pixel: Pixel = {
      ...position,
      color,
    };

    this.pixelStore.set(pixel);

    return [pixel];
  }

  private interpolate(start: WorldPosition, end: WorldPosition): WorldPosition[] {
    const points: WorldPosition[] = [];

    let x = start.x;
    let y = start.y;

    const dx = Math.abs(end.x - start.x);
    const dy = Math.abs(end.y - start.y);

    const sx = start.x < end.x ? 1 : -1;
    const sy = start.y < end.y ? 1 : -1;

    let error = dx - dy;

    while (x !== end.x || y !== end.y) {
      const doubledError = 2 * error;

      if (doubledError > -dy) {
        error -= dy;
        x += sx;
      }

      if (doubledError < dx) {
        error += dx;
        y += sy;
      }

      points.push({ x, y });
    }

    return points;
  }
}
