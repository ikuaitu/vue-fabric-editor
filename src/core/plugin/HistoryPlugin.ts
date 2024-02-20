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
import { ref } from 'vue';
import { useRefHistory } from '@vueuse/core';
type IEditor = Editor;

class HistoryPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'HistoryPlugin';
  static apis = ['undo', 'redo', 'getHistory'];
  static events = ['historyInitSuccess'];
  public hotkeys: string[] = ['ctrl+z', 'ctrl+shift+z', '⌘+z', '⌘+shift+z'];
  history: any;
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;

    this._init();
  }

  _init() {
    this.history = useRefHistory(ref(), {
      capacity: 50,
    });
    this.canvas.on({
      'object:added': (event: fabric.IEvent) => this._save(event),
      'object:modified': (event: fabric.IEvent) => this._save(event),
      'selection:updated': (event: fabric.IEvent) => this._save(event),
    });
    window.addEventListener('beforeunload', function (e) {
      if (history.length > 0) {
        (e || window.event).returnValue = '确认离开';
      }
    });
  }

  // 导入模板之后，清理 History 缓存
  hookImportAfter() {
    this.history.clear();
  }

  getHistory() {
    return this.history;
  }
  _save(event: fabric.IEvent) {
    // 过滤选择元素事件
    const isSelect = event.action === undefined && event.e;
    if (isSelect || !this.canvas) return;
    const workspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
    if (!workspace) {
      return;
    }
    if (this.history.isTracking.value) {
      this.history.source.value = this.editor.getJson();
    }
  }

  undo() {
    if (this.history.canUndo.value) {
      this.history.undo();
      this.renderCanvas();
    }
  }

  redo() {
    this.history.redo();
    this.renderCanvas();
  }

  renderCanvas = () => {
    this.history.pause();
    this.canvas.clear();
    this.canvas.loadFromJSON(this.history.source.value, () => {
      this.canvas.renderAll();
      this.history.resume();
    });
  };

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
