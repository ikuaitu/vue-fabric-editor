import type { Canvas } from 'fabric/fabric-impl';
import CanvasRuler from './ruler';
import { fabric } from 'fabric';

function initRuler(_canvas: Canvas) {
  const ruler = new CanvasRuler({
    canvas: _canvas,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _canvas.on('after:render', (e: any) => {
    // 避免多次渲染
    if (!e.ctx) return;
    ruler.render();
  });

  fabric.util.object.extend(_canvas, {
    ruler,
  });
}

export default initRuler;
