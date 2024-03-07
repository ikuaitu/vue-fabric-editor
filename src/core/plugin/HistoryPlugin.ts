/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: 秦少卫
 * @Date: 2023-06-20 13:06:31
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-02-20 13:33:29
 * @Description: 历史记录插件
 */
type extendCanvas = {
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  historyUndo: any[];
  historyRedo: any[];
};

import 'fabric-history';
import { fabric } from 'fabric';
import Editor from '../core';
import { ref } from 'vue';
import { useRefHistory } from '@vueuse/core';
type IEditor = Editor;

class HistoryPlugin {
  public canvas: fabric.Canvas & extendCanvas;
  public editor: IEditor;
  static pluginName = 'HistoryPlugin';
  static apis = ['undo', 'redo', 'getHistory', 'canUndo', 'canRedo'];
  static events = ['historyInitSuccess'];
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

    window.addEventListener('beforeunload', (e) => {
      console.log(this.canUndo(), this.canRedo());
      if (history.length > 0) {
        (e || window.event).returnValue = '确认离开';
      }
    });
  }

  // 导入模板之后，清理 History 缓存
  hookImportAfter() {
    this.canvas.clearHistory();
  }

  getHistory() {
    return this.canvas.historyUndo;
  }

  undo() {
    this.canvas.undo();
  }

  redo() {
    this.canvas.redo();
  }
  canUndo() {
    return this.canvas.historyUndo.length;
  }
  canRedo() {
    return this.canvas.historyRedo.length;
  }

  // renderCanvas = () => {
  //   this.history.pause();
  //   this.canvas.clear();
  //   this.canvas.loadFromJSON(this.history.source.value, () => {
  //     this.canvas.renderAll();
  //     this.history.resume();
  //   });
  // };

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
