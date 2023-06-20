/*
 * @Author: 秦少卫
 * @Date: 2023-06-20 13:06:31
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-06-20 13:12:02
 * @Description: 历史记录插件
 */

import { fabric } from 'fabric';
import Editor from '../core';
type IEditor = Editor;
// import { v4 as uuid } from 'uuid';

class HistoryPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'HistoryPlugin';
  public hotkeys: string[] = ['ctrl+z'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  _init() {
    this.canvas.on({
      'object:added': this._save,
      'object:modified': this._save,
      'selection:updated': this._save,
    });
  }

  _save() {}

  _renderCanvas() {
    // const { canvas } = this;
    // if (!canvas) return;
    // pause();
    // canvas.clear();
    // canvas.loadFromJSON(source.value, () => {
    //   canvas.c.renderAll();
    //   resume();
    // });
  }
  // 快捷键扩展回调
  hotkeyEvent(eventName: string, e: any) {
    if (e.type === 'keydown') {
      const { canvas } = this;
      const activeObject = canvas.getActiveObject();
      if (!activeObject) return;
      switch (eventName) {
        case 'left':
          if (activeObject.left === undefined) return;
          activeObject.set('left', activeObject.left - 1);
          break;
        case 'right':
          if (activeObject.left === undefined) return;
          activeObject.set('left', activeObject.left + 1);
          break;
        case 'down':
          if (activeObject.top === undefined) return;
          activeObject.set('top', activeObject.top + 1);
          break;
        case 'up':
          if (activeObject.top === undefined) return;
          activeObject.set('top', activeObject.top - 1);
          break;
        default:
      }
      canvas.renderAll();
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default HistoryPlugin;
