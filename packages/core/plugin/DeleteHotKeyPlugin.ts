/*
 * @Author: 秦少卫
 * @Date: 2023-06-20 12:57:35
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-10 17:33:02
 * @Description: 删除快捷键
 */

import { fabric } from 'fabric';
import Editor from '../Editor';
type IEditor = Editor;
// import { v4 as uuid } from 'uuid';

class DeleteHotKeyPlugin implements IPluginTempl {
  static pluginName = 'DeleteHotKeyPlugin';
  static apis = ['del'];
  hotkeys: string[] = ['backspace'];
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {}

  // 快捷键扩展回调
  hotkeyEvent(eventName: string, e: KeyboardEvent) {
    if (e.type === 'keydown' && eventName === 'backspace') {
      this.del();
    }
  }

  del() {
    const { canvas } = this;
    const activeObject = canvas.getActiveObjects();
    if (activeObject) {
      activeObject.map((item) => canvas.remove(item));
      canvas.requestRenderAll();
      canvas.discardActiveObject();
    }
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      return [null, { text: '删除', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.del() }];
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default DeleteHotKeyPlugin;
