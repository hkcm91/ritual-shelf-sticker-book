
export interface Position2D {
  x: number;
  y: number;
}

export interface TransformState {
  scale: number;
  position2D: Position2D;
  rotation: number;
}

export interface TransformBoundaries {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

export interface TransformControlsProps {
  activeShelfId: string;
  position: number;
  initialScale?: number;
  initialPosition?: Position2D;
  initialRotation?: number;
  onTransformChange?: (transform: TransformState) => void;
  min?: number;
  max?: number;
}
