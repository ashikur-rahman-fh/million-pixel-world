import { WorldCamera } from "./camera";
import { PixelStore } from "./pixel-store";
import { DrawingEngine } from "./drawing-engine";
import { WorldRenderer } from "./renderer";

export class WorldEngine {
  readonly camera: WorldCamera;
  readonly pixelStore: PixelStore;
  readonly drawing: DrawingEngine;
  readonly renderer: WorldRenderer;

  constructor() {
    this.camera = new WorldCamera();
    this.pixelStore = new PixelStore();

    this.drawing = new DrawingEngine(this.pixelStore);

    this.renderer = new WorldRenderer(this.pixelStore, this.camera);
  }
}
