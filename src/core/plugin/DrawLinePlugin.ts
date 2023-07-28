/*
 * @Author: 秦少卫
 * @Date: 2023-06-21 22:09:36
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-06-22 16:07:52
 * @Description: file content
 */

import { v4 as uuid } from 'uuid';
import { fabric } from 'fabric';
import Arrow from '@/core/objects/Arrow';
import Editor from '../core';
type IEditor = Editor;

class DrawLinePlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'DrawLinePlugin';
  static apis = ['setArrow', 'setMode'];
  isDrawingLineMode: boolean;
  isArrow: boolean;
  lineToDraw: any;
  pointer: any;
  pointerPoints: any;
  isDrawingLine: boolean;
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;

    this.isDrawingLine = false;
    this.isDrawingLineMode = false;
    this.isArrow = false;
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

      const NodeHandler = this.isArrow ? Arrow : fabric.Line;
      this.lineToDraw = new NodeHandler(this.pointerPoints, {
        strokeWidth: 2,
        stroke: '#000000',
        id: uuid(),
      });

      this.lineToDraw.selectable = false;
      this.lineToDraw.evented = false;
      this.lineToDraw.strokeUniform = true;
      canvas.add(this.lineToDraw);
    });

    canvas.on('mouse:move', (o) => {
      if (!this.isDrawingLine) return;
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
        angle = parseInt(((angle + 7.5) % 360) / 15) * 15;

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

  setArrow(params: any) {
    this.isArrow = params;
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
