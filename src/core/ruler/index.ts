import type { Canvas } from 'fabric/fabric-impl';
import CanvasRuler, { RulerOptions } from './ruler';

function initRuler(canvas: Canvas, options?: RulerOptions) {
  new CanvasRuler({
    canvas,
    ...options,
  });
}

export default initRuler;
