declare namespace fabric {
  export interface Canvas {
    contextTop: CanvasRenderingContext2D;
    lowerCanvasEl: HTMLElement;
    _currentTransform: unknown;
    _centerObject: (obj: fabric.Object, center: fabric.Point) => fabric.Canvas;
  }

  export interface Control {
    rotate: number;
  }

  function ControlMouseEventHandler(
    eventData: MouseEvent,
    transformData: Transform,
    x: number,
    y: number
  ): boolean;
  function ControlStringHandler(
    eventData: MouseEvent,
    control: fabric.Control,
    fabricObject: fabric.Object
  ): string;
  export const controlsUtils: {
    rotationWithSnapping: ControlMouseEventHandler;
    scalingEqually: ControlMouseEventHandler;
    scalingYOrSkewingX: ControlMouseEventHandler;
    scalingXOrSkewingY: ControlMouseEventHandler;

    scaleCursorStyleHandler: ControlStringHandler;
    scaleSkewCursorStyleHandler: ControlStringHandler;
    scaleOrSkewActionName: ControlStringHandler;
    rotationStyleHandler: ControlStringHandler;
  };
}
