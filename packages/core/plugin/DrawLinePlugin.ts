/*
 * @Author: 秦少卫
 * @Date: 2023-06-21 22:09:36
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-10 17:33:05
 * @Description: file content
 */

import { v4 as uuid } from 'uuid';
import { fabric } from 'fabric';
import Arrow from '../objects/Arrow';
import ThinTailArrow from '../objects/ThinTailArrow';
import Editor from '../Editor';
type IEditor = Editor;

class DrawLinePlugin implements IPluginTempl {
  static pluginName = 'DrawLinePlugin';
  static apis = ['setLineType', 'setMode'];
  isDrawingLineMode: boolean;
  lineType: string;
  lineToDraw: any;
  pointer: any;
  pointerPoints: any;
  isDrawingLine: boolean;
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {
    this.isDrawingLine = false;
    this.isDrawingLineMode = false;
    this.lineType = '';
    this.lineToDraw = null;
    this.pointer = null;
    this.pointerPoints = null;
    this.init();
  }

  init() {
    const { canvas } = this;
    canvas.on('mouse:down', (o) => {
      if (!this.isDrawingLineMode) return;
      canvas.discardActiveObject();
      canvas.getObjects().forEach((obj) => {
        obj.selectable = false;
        obj.hasControls = false;
      });
      canvas.requestRenderAll();
      this.isDrawingLine = true;
      this.pointer = canvas.getPointer(o.e);
      this.pointerPoints = [this.pointer.x, this.pointer.y, this.pointer.x, this.pointer.y];
      let NodeHandler;
      let opts: any = {
        strokeWidth: 2,
        stroke: '#000000',
        id: uuid(),
      };
      switch (this.lineType) {
        case 'line':
          NodeHandler = fabric.Line;
          break;
        case 'arrow':
          NodeHandler = Arrow;
          break;
        case 'thinTailArrow':
          NodeHandler = ThinTailArrow;
          opts = {
            strokeWidth: 2,
            stroke: '#ff0000',
            fill: '#ff0000',
            id: uuid(),
          };
          break;
        default:
          break;
      }
      if (!NodeHandler) throw new Error('Draw failed: invalid lineType.');

      this.lineToDraw = new NodeHandler(this.pointerPoints, opts);

      this.lineToDraw.selectable = false;
      this.lineToDraw.evented = false;
      this.lineToDraw.strokeUniform = true;
      canvas.add(this.lineToDraw);
    });

    canvas.on('mouse:move', (o) => {
      if (!this.isDrawingLine || !['line', 'arrow', 'thinTailArrow'].includes(this.lineType))
        return;
      canvas.discardActiveObject();
      const activeObject = canvas.getActiveObject();
      if (activeObject) return;
      this.pointer = canvas.getPointer(o.e);

      if (o.e.shiftKey) {
        // calc angle
        const startX = this.pointerPoints[0];
        const startY = this.pointerPoints[1];
        const x2 = this.pointer.x - startX;
        const y2 = this.pointer.y - startY;
        const r = Math.sqrt(x2 * x2 + y2 * y2);
        let angle = (Math.atan2(y2, x2) / Math.PI) * 180;
        angle = ~~(((angle + 7.5) % 360) / 15) * 15;

        const cosx = r * Math.cos((angle * Math.PI) / 180);
        const sinx = r * Math.sin((angle * Math.PI) / 180);

        this.lineToDraw.set({
          x2: cosx + startX,
          y2: sinx + startY,
        });
      } else {
        this.lineToDraw.set({
          x2: this.pointer.x,
          y2: this.pointer.y,
        });
      }

      canvas.renderAll();
    });

    canvas.on('mouse:up', () => {
      if (!this.isDrawingLine) return;
      this.lineToDraw.setCoords();
      this.isDrawingLine = false;
      canvas.discardActiveObject();
    });
  }

  setLineType(params: any) {
    this.lineType = params;
  }

  setMode(params: any) {
    this.isDrawingLineMode = params;
    if (!this.isDrawingLineMode) {
      this.endRest();
    }
  }

  endRest() {
    this.canvas.getObjects().forEach((obj) => {
      if (obj.id !== 'workspace') {
        obj.selectable = true;
        obj.hasControls = true;
      }
    });
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default DrawLinePlugin;
