import { WORLD_CONFIG } from "@/config/world.config";
import type { ScreenPosition, WorldPosition } from "@/types/world.types";

const CELL_SIZE = WORLD_CONFIG.cellSize;

export function screenToWorld(screen: ScreenPosition, cameraY: number): WorldPosition {
  return {
    x: Math.floor(screen.x / CELL_SIZE),
    // prettier-ignore
    y: Math.floor(cameraY + (screen.y / CELL_SIZE)),
  };
}

export function worldToScreen(world: WorldPosition, cameraY: number): ScreenPosition {
  return {
    x: world.x * CELL_SIZE,
    y: (world.y - cameraY) * CELL_SIZE,
  };
}

export function getVisibleWorldBounds(width: number, height: number, cameraY: number) {
  return {
    minX: 0,
    maxX: Math.ceil(width / CELL_SIZE),
    minY: Math.max(0, Math.floor(cameraY)),
    // prettier-ignore
    maxY: Math.ceil(cameraY + (height / CELL_SIZE)),
  };
}
