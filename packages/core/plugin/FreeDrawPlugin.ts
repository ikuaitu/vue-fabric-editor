import { fabric } from 'fabric';
import Editor from '../Editor';

type IEditor = Editor;

type DrawOptions = {
  width: number;
};

export default class FreeDrawPlugin {
  static pluginName = 'FreeDrawPlugin';
  static apis = ['startDraw', 'endDraw'];
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {}

  startDraw(options: DrawOptions) {
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.width = options.width;
  }
  endDraw() {
    if (this.canvas.isDrawingMode) {
      this.canvas.isDrawingMode = false;
      return;
    }
  }
}
