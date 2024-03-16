/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: 秦少卫
 * @Date: 2023-06-20 13:06:31
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-02-20 13:33:29
 * @Description: 历史记录插件
 */
import { fabric } from 'fabric';
import Editor from '../core';
import 'fabric-history';

type IEditor = Editor;
type extendCanvas = {
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  historyUndo: any[];
  historyRedo: any[];
};

class HistoryPlugin {
  public canvas: fabric.Canvas & extendCanvas;
  public editor: IEditor;
  static pluginName = 'HistoryPlugin';
  static apis = ['undo', 'redo'];
  static events = ['historyUpdate'];
  public hotkeys: string[] = ['ctrl+z', 'ctrl+shift+z', '⌘+z', '⌘+shift+z'];
  constructor(canvas: fabric.Canvas & extendCanvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this._init();
  }

  _init() {
    this.canvas.getObjects().forEach((item) => {
      this.canvas.add(item);
    });
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
    this.canvas.clearHistory();
    this.historyUpdate();
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
  hotkeyEvent(eventName: string, e: any) {
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
