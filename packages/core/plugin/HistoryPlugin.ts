/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: 秦少卫
 * @Date: 2023-06-20 13:06:31
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-07-12 21:35:16
 * @Description: 历史记录插件
 */
import { fabric } from 'fabric';
import Editor from '../Editor';
import '../utils/fabric-history.js';

type IEditor = Editor;
type extendCanvas = {
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  historyUndo: any[];
  historyRedo: any[];
};

class HistoryPlugin implements IPluginTempl {
  static pluginName = 'HistoryPlugin';
  static apis = ['undo', 'redo'];
  static events = ['historyUpdate'];
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
      if (this.canvas.historyUndo.length > 0) {
        (e || window.event).returnValue = '确认离开';
      }
    });
  }

  historyUpdate() {
    const { historyUndo, historyRedo } = this.canvas;
    this.editor.emit('historyUpdate', historyUndo.length, historyRedo.length);
  }

  // 导入模板之后，清理 History 缓存
  hookImportAfter() {
    this.canvas.clearHistory(true);
    this.historyUpdate();
    return Promise.resolve();
  }

  undo() {
    // if (this.canvas.historyUndo.length === 1) {
    //   // this.canvas.clearUndo();
    //   // this.editor.clear();
    // }
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
