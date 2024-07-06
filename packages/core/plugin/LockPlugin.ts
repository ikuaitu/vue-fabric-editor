/*
 * @Author: 秦少卫
 * @Date: 2024-07-04 14:27:05
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-07-06 17:49:01
 * @Description: 锁定文件
 */
import { fabric } from 'fabric';
import type Editor from '../Editor';
import { SelectMode } from '../eventType';

export default class LockPlugin implements IPluginTempl {
  static pluginName = 'LockPlugin';
  static apis = ['lock', 'unLock'];
  lockAttrs: string[];
  constructor(public canvas: fabric.Canvas, public editor: Editor) {
    this.lockAttrs = [
      'lockMovementX',
      'lockMovementY',
      'lockRotation',
      'lockScalingX',
      'lockScalingY',
    ];
  }

  hookImportAfter() {
    this.canvas.forEachObject((obj) => {
      if (obj.hasControls === false && obj.selectable === false) {
        this.canvas.setActiveObject(obj);
        this.lock();
      }
    });
    return Promise.resolve();
  }

  lock() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      activeObject.hasControls = false;
      activeObject.selectable = false;
      activeObject.evented = false;
      // 修改默认属性
      this.lockAttrs.forEach((key) => {
        activeObject[key] = true;
      });
      this.canvas.discardActiveObject().renderAll();
    }
  }

  unLock() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      activeObject.hasControls = true;
      activeObject.selectable = true;
      activeObject.evented = true;
      // 修改默认属性
      this.lockAttrs.forEach((key) => {
        activeObject[key] = false;
      });
      this.canvas.discardActiveObject().renderAll();
    }
  }

  contextMenu() {
    const selectedMode = this.editor.getSelectMode();
    const activeObject = this.canvas.getActiveObject();
    if (selectedMode === SelectMode.ONE && activeObject) {
      if (activeObject.selectable) {
        return [{ text: '锁定', hotkey: '', onclick: () => this.lock() }];
      } else {
        return [{ text: '解锁', hotkey: '', onclick: () => this.unLock() }];
      }
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}
