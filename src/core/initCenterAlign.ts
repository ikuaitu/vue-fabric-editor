/*
 * @Author: 秦少卫
 * @Date: 2023-02-05 10:30:39
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-09 13:19:02
 * @Description: 居中方式
 */

import type { fabric } from 'fabric';

class CenterAlign {
  canvas: fabric.Canvas;
  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
  }

  position(name: keyof fabric.Object) {
    const anignType = ['centerH', 'center', 'centerV'];
    const activeObject = this.canvas.getActiveObject();
    if (anignType.includes(name) && activeObject) {
      activeObject[name]();
      this.canvas.renderAll();
    }
  }
}

export default CenterAlign;
