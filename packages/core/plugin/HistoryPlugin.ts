/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: 秦少卫
 * @Date: 2023-06-20 13:06:31
 * @LastEditors: George GeorgeSmith163@163.com
 * @LastEditTime: 2024-10-15 09:35:35
 * @Description: 历史记录插件
 */
import { fabric } from 'fabric';
import '../utils/fabric-history.js';
import type { IEditor, IPluginTempl } from '@kuaitu/core';

type IPlugin = Pick<HistoryPlugin, 'undo' | 'redo' | 'historyUpdate'>;

declare module '@kuaitu/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IEditor extends IPlugin {}
}

type callback = () => void;
type extendCanvas = {
  undo: (callback?: callback) => void;
  redo: (callback?: callback) => void;
  clearHistory: () => void;
  historyStack: any[];
  historyIndex: number;
};

class HistoryPlugin implements IPluginTempl {
  static pluginName = 'HistoryPlugin';
  static apis = ['undo', 'redo', 'historyUpdate'];
  static events = [];
  hotkeys: string[] = ['ctrl+z', 'ctrl+shift+z', '⌘+z', '⌘+shift+z'];
  constructor(public canvas: fabric.Canvas & extendCanvas, public editor: IEditor) {
    fabric.Canvas.prototype._historyNext = () => {
      return this.editor.getJson();
    };
    this._init();
  }

  _init() {
    this.canvas.on('history:append', () => {
      this.historyUpdate();
    });
    window.addEventListener('beforeunload', (e) => {
      if (this.canvas.historyStack.length > 0) {
        (e || window.event).returnValue = '确认离开';
      }
    });
  }

  historyUpdate() {
    const { historyStack, historyIndex } = this.canvas;
    this.editor.emit('historyUpdate', historyIndex, historyStack.length - historyIndex);
  }

  // 导入模板之后，清理 History 缓存
  hookImportAfter() {
    this.canvas.clearHistory(true);
    this.historyUpdate();
    return Promise.resolve();
  }

  undo() {
    this.canvas.undo();
    this.historyUpdate();
  }

  redo() {
    this.canvas.redo();
    this.historyUpdate();
  }

  // 快捷键扩展回调
  hotkeyEvent(eventName: string, e: KeyboardEvent) {
    if (e.type === 'keydown') {
      switch (eventName) {
        case 'ctrl+z':
        case '⌘+z':
          this.undo();
          break;
        case 'ctrl+shift+z':
        case '⌘+shift+z':
          this.redo();
          break;
      }
    }
  }
}

export default HistoryPlugin;
