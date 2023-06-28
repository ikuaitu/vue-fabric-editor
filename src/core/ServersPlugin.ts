/*
 * @Author: 秦少卫
 * @Date: 2023-06-20 12:52:09
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-06-28 12:30:14
 * @Description: 内部插件
 */

import { selectFiles } from '@/utils/utils';

import { fabric } from 'fabric';
import Editor from '../core';
type IEditor = Editor;
// import { v4 as uuid } from 'uuid';

class ServersPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'ServersPlugin';
  static apis = ['insert', 'insertSvgFile', 'getJson', 'dragAddItem'];
  // public hotkeys: string[] = ['left', 'right', 'down', 'up'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  insert() {
    selectFiles({ accept: '.json' }).then((files) => {
      const [file] = files;
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        this.insertSvgFile(reader.result);
      };
    });
  }

  insertSvgFile(jsonFile) {
    this.editor.hooksEntity.hookImportBefore.callAsync(jsonFile, () => {
      this.canvas.loadFromJSON(jsonFile, () => {
        this.canvas.renderAll();
        this.editor.hooksEntity.hookImportAfter.callAsync(jsonFile, () => {
          this.canvas.renderAll();
        });
      });
    });
  }

  getJson() {
    return this.canvas.toJSON(['id', 'gradientAngle', 'selectable', 'hasControls']);
  }

  /**
   * @description: 拖拽添加到画布
   * @param {Event} event
   * @param {Object} item
   */
  dragAddItem(event: DragEvent, item: fabric.Object) {
    const { left, top } = this.canvas.getSelectionElement().getBoundingClientRect();
    if (event.x < left || event.y < top || item.width === undefined) return;

    const point = {
      x: event.x - left,
      y: event.y - top,
    };
    const pointerVpt = this.canvas.restorePointerVpt(point);
    item.left = pointerVpt.x - item.width / 2;
    item.top = pointerVpt.y;
    this.canvas.add(item);
    this.canvas.requestRenderAll();
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default ServersPlugin;
