import type { Pixel, WorldPosition } from "@/types/world.types";
import { PixelStore } from "./pixel-store";

export class DrawingEngine {
  private previousPosition: WorldPosition | null = null;

  constructor(private readonly pixelStore: PixelStore) {}

  start(position: WorldPosition, color: string): Pixel[] {
    this.previousPosition = position;

    return this.paint(position, color);
  }

  move(position: WorldPosition, color: string): Pixel[] {
    if (!this.previousPosition) {
      return this.start(position, color);
    }

    const points = this.interpolate(this.previousPosition, position);

    this.previousPosition = position;

    return points.flatMap((point) => this.paint(point, color));
  }

  end(): void {
    this.previousPosition = null;
  }

  private paint(position: WorldPosition, color: string): Pixel[] {
    if (position.x < 0 || position.y < 0) {
      return [];
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
