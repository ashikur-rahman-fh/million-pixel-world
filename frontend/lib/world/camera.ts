import { WORLD_CONFIG } from "@/config/world.config";
import type { CameraState } from "@/types/world.types";

export class WorldCamera {
  private state: CameraState = {
    y: 0,
  };

  get position(): CameraState {
    return this.state;
  }

  scroll(deltaPixels: number): void {
    // prettier-ignore
    this.state.y = Math.max(0, this.state.y + (deltaPixels / WORLD_CONFIG.cellSize));
  }

  move(deltaPixels: number): void {
    this.scroll(deltaPixels);
  }

  get currentRow(): number {
    return Math.floor(this.state.y) + 1;
  }

  reset(): void {
    this.state.y = 0;
  }
}
