declare namespace fabric {
  export interface Canvas {
    contextTop: CanvasRenderingContext2D;
    _currentTransform: unknown;
  }

  export interface Control {
    rotate: number;
  }

  export const controlsUtils: {
    rotationWithSnapping: (
      eventData: MouseEvent,
      transformData: fabric.Transform,
      x: number,
      y: number
    ) => boolean;
  };
}
