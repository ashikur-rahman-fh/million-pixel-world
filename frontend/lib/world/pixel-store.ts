import { WORLD_CONFIG } from "@/config/world.config";
import type { Pixel, VisibleWorldBounds, WorldPosition } from "@/types/world.types";

export class PixelStore {
  private readonly chunks = new Map<string, Map<number, Pixel>>();

  private getChunkCoordinates(position: WorldPosition) {
    const size = WORLD_CONFIG.chunkSize;

    return {
      chunkX: Math.floor(position.x / size),
      chunkY: Math.floor(position.y / size),
      localX: position.x % size,
      localY: position.y % size,
    };
  }

  private getChunkKey(chunkX: number, chunkY: number) {
    return `${chunkX}:${chunkY}`;
  }

  private getLocalIndex(localX: number, localY: number) {
    // prettier-ignore
    const localIndex = (localY * WORLD_CONFIG.chunkSize) + localX;
    return localIndex;
  }

  set(pixel: Pixel): void {
    if (
      !Number.isSafeInteger(pixel.x) ||
      !Number.isSafeInteger(pixel.y) ||
      pixel.x < 0 ||
      pixel.y < 0
    ) {
      return;
    }

    const { chunkX, chunkY, localX, localY } = this.getChunkCoordinates(pixel);

    const key = this.getChunkKey(chunkX, chunkY);

    let chunk = this.chunks.get(key);

    if (!chunk) {
      chunk = new Map();
      this.chunks.set(key, chunk);
    }

    chunk.set(this.getLocalIndex(localX, localY), pixel);
  }

  delete(position: WorldPosition): boolean {
    if (position.x < 0 || position.y < 0) {
      return false;
    }

    const { chunkX, chunkY, localX, localY } = this.getChunkCoordinates(position);

    const key = this.getChunkKey(chunkX, chunkY);
    const chunk = this.chunks.get(key);

    if (!chunk) return false;

    const deleted = chunk.delete(this.getLocalIndex(localX, localY));

    if (chunk.size === 0) {
      this.chunks.delete(key);
    }

    return deleted;
  }

  getVisible(bounds: VisibleWorldBounds): Pixel[] {
    const size = WORLD_CONFIG.chunkSize;
    const visible: Pixel[] = [];

    const minChunkX = Math.floor(bounds.minX / size);
    const maxChunkX = Math.floor(Math.max(bounds.minX, bounds.maxX - 1) / size);

    const minChunkY = Math.floor(bounds.minY / size);
    const maxChunkY = Math.floor(Math.max(bounds.minY, bounds.maxY - 1) / size);

    for (let cy = minChunkY; cy <= maxChunkY; cy++) {
      for (let cx = minChunkX; cx <= maxChunkX; cx++) {
        const chunk = this.chunks.get(this.getChunkKey(cx, cy));

        if (!chunk) continue;

        for (const pixel of chunk.values()) {
          if (
            pixel.x >= bounds.minX &&
            pixel.x < bounds.maxX &&
            pixel.y >= bounds.minY &&
            pixel.y < bounds.maxY
          ) {
            visible.push(pixel);
          }
        }
      }
    }

    return visible;
  }

  clear(): void {
    this.chunks.clear();
  }

  get chunkCount(): number {
    return this.chunks.size;
  }
}
