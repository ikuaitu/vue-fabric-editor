/*
 * @Author: 秦少卫
 * @Date: 2023-06-15 22:49:42
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-06-27 23:10:47
 * @Description: 居中对齐插件
 */

import { fabric } from 'fabric';
import Editor from '../core';
type IEditor = Editor;

class CenterAlignPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'CenterAlignPlugin';
  static apis = ['centerH', 'center', 'position', 'centerV'];
  // public hotkeys: string[] = ['space'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  center(workspace: fabric.Rect, object: fabric.Object) {
    const center = workspace.getCenterPoint();
    return this.canvas._centerObject(object, center);
  }

  centerV(workspace: fabric.Rect, object: fabric.Object) {
    return this.canvas._centerObject(
      object,
      new fabric.Point(object.getCenterPoint().x, workspace.getCenterPoint().y)
    );
  }

  centerH(workspace: fabric.Rect, object: fabric.Object) {
    return this.canvas._centerObject(
      object,
      new fabric.Point(workspace.getCenterPoint().x, object.getCenterPoint().y)
    );
  }

  position(name: 'centerH' | 'center' | 'centerV') {
    const anignType = ['centerH', 'center', 'centerV'];
    const activeObject = this.canvas.getActiveObject();
    if (anignType.includes(name) && activeObject) {
      const defaultWorkspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
      if (defaultWorkspace) {
        console.log(this[name]);
        this[name](defaultWorkspace, activeObject);
      }
      this.canvas.renderAll();
    }
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      return [
        {
          text: '水平垂直居中',
          hotkey: 'Ctrl+V',
          disabled: false,
          onclick: () => this.position('center'),
        },
      ];
    }
  }
  destroy() {
    console.log('pluginDestroy');
  }
}

export default CenterAlignPlugin;
