import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';
import type { IEditor, IPluginTempl } from '@kuaitu/core';

type IPlugin = Pick<FreeDrawPlugin, 'startDraw' | 'endDraw'>;

declare module '@kuaitu/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IEditor extends IPlugin {}
}

type DrawOptions = {
  width: number;
};

export default class FreeDrawPlugin implements IPluginTempl {
  static pluginName = 'FreeDrawPlugin';
  static apis = ['startDraw', 'endDraw'];
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {}

  _bindEvent() {
    this.canvas.on('path:created', this._createdHandler);
  }

  _unbindEvent() {
    this.canvas.off('path:created', this._createdHandler);
  }

  _createdHandler = (opt: any) => {
    opt.path.set('id', uuid());
  };

  startDraw(options: DrawOptions) {
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush = new fabric.PencilBrush(this.canvas);
    this.canvas.freeDrawingBrush.width = options.width;
    this._bindEvent();
  }
  endDraw() {
    if (this.canvas.isDrawingMode) {
      this.canvas.isDrawingMode = false;
      this._unbindEvent();
      return;
    }
  }
}
