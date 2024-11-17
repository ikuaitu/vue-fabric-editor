/*
 * @Author: 秦少卫
 * @Date: 2023-06-20 12:57:35
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2024-11-03 20:38:33
 * @Description: 删除快捷键
 */

import { fabric } from 'fabric';
import type { IEditor, IPluginTempl } from '@kuaitu/core';

type IPlugin = Pick<DeleteHotKeyPlugin, 'del'>;

declare module '@kuaitu/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IEditor extends IPlugin {}
}

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
      return [
        null,
        { text: '删除', hotkey: 'Backspace', disabled: false, onclick: () => this.del() },
      ];
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default DeleteHotKeyPlugin;
