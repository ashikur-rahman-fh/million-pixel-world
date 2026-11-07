export interface WorldPosition {
  x: number;
  y: number;
}

export interface ScreenPosition {
  x: number;
  y: number;
}

export interface CameraState {
  y: number;
}

export interface Pixel extends WorldPosition {
  color: string;
}

export interface ViewportSize {
  width: number;
  height: number;
}

export interface VisibleWorldBounds {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}
