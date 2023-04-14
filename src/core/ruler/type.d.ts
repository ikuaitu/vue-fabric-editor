/* eslint-disable @typescript-eslint/no-explicit-any */
import type CanvasRuler, { Rect } from './ruler';

declare module 'fabric/fabric-impl' {
  export interface Canvas {
    _setupCurrentTransform(e: Event, target: fabric.Object, alreadySelected: boolean): void;
  }

  export interface IObservable<T> {
    on(
      eventName: 'guideline:moving' | 'guideline:mouseup',
      handler: (event: { target: GuideLine; e: IEvent<WheelEvent> }) => void
    ): T;
  }

  export interface IGuideLineOptions extends ILineOptions {
    axis: 'horizontal' | 'vertical';
  }

  export interface IGuideLineClassOptions extends IGuideLineOptions {
    canvas: {
      setActiveObject(
        object: fabric.Object | IGuideLineClassOptions,
        e?: Event | IEvent<MouseEvent>
      ): Canvas;
      remove<T>(...object: (fabric.Object | IGuideLineClassOptions)[]): T;
    } & Canvas;
    activeOn: 'down' | 'up';
    initialize(xy: number, objObjects: IGuideLineOptions): void;
    callSuper(methodName: string, ...args: unknown[]): any;
    getBoundingRect(absolute?: boolean, calculate?: boolean): Rect;
    on(eventName: EventName, handler: (e: IEvent<MouseEvent>) => void): T;
    fire<T>(eventName: string, options?: any): T;
    isPointOnRuler(e: MouseEvent): 'horizontal' | 'vertical' | false;
    bringToFront(): fabric.Object;
    isHorizontal(): boolean;
  }

  export interface GuideLine extends Line, IGuideLineClassOptions {}

  export class GuideLine extends Line {
    constructor(xy: number, objObjects?: IGuideLineOptions);
    static fromObject(object: any, callback: any): void;
  }

  export interface StaticCanvas {
    ruler: InstanceType<typeof CanvasRuler>;
  }
}
