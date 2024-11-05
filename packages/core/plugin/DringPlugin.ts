/*
 * @Author: 秦少卫
 * @Date: 2023-05-19 08:31:34
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-10 17:33:11
 * @Description: 拖拽插件
 */

import { IEditor, IPluginTempl } from '@kuaitu/core';

type IPlugin = Pick<DringPlugin, 'startDring' | 'endDring'>;

declare module '@kuaitu/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IEditor extends IPlugin {}
}

export class DringPlugin implements IPluginTempl {
  defautOption = {};
  static pluginName = 'DringPlugin';
  static events = ['startDring', 'endDring'];
  static apis = ['startDring', 'endDring'];
  hotkeys: string[] = ['space'];
  dragMode = false;
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {
    this.dragMode = false;
    this.init();
  }
  init() {
    this._initDring();
  }

  startDring() {
    this.dragMode = true;
    this.canvas.setCursor('grab');
    this.editor.emit('startDring');
    this.canvas.renderAll();
  }
  endDring() {
    this.dragMode = false;
    this.canvas.setCursor('default');
    this.canvas.isDragging = false;
    this.editor.emit('endDring');
    this.canvas.renderAll();
  }

  // 拖拽模式;
  _initDring() {
    const This = this;
    this.canvas.on('mouse:down', function (this: ExtCanvas, opt) {
      const evt = opt.e;
      // evt.button === 1 为鼠标中键的判断
      if (evt.altKey || This.dragMode || evt.button === 1) {
        This.canvas.setCursor('grabbing');
        This.canvas.discardActiveObject();
        This._setDring();
        this.selection = false;
        this.isDragging = true;
        this.lastPosX = evt.clientX;
        this.lastPosY = evt.clientY;
        this.requestRenderAll();
      }
    });

    this.canvas.on('mouse:move', function (this: ExtCanvas, opt) {
      This.dragMode && This.canvas.setCursor('grab');
      if (this.isDragging) {
        This.canvas.discardActiveObject();
        This.canvas.setCursor('grabbing');
        const { e } = opt;
        if (!this.viewportTransform) return;
        const vpt = this.viewportTransform;
        vpt[4] += e.clientX - this.lastPosX;
        vpt[5] += e.clientY - this.lastPosY;
        this.lastPosX = e.clientX;
        this.lastPosY = e.clientY;
        this.requestRenderAll();
      }
    });

    this.canvas.on('mouse:up', function (this: ExtCanvas) {
      if (!this.viewportTransform) return;
      this.setViewportTransform(this.viewportTransform);
      this.isDragging = false;
      this.selection = true;
      this.getObjects().forEach((obj) => {
        if (obj.id !== 'workspace' && obj.hasControls) {
          obj.selectable = true;
        }
      });
      This.dragMode && This.canvas.setCursor('grab');
      this.requestRenderAll();
    });
  }

  _setDring() {
    this.canvas.selection = false;
    this.canvas.getObjects().forEach((obj) => {
      obj.selectable = false;
    });
    this.canvas.requestRenderAll();
  }

  destroy() {
    console.log('pluginDestroy');
  }

  // 快捷键扩展回调
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  hotkeyEvent(eventName: string, e: KeyboardEvent) {
    if (e.code === 'Space' && e.type === 'keydown') {
      if (!this.dragMode) {
        this.startDring();
      }
    }
    if (e.code === 'Space' && e.type === 'keyup') {
      this.endDring();
    }
  }
}

declare global {
  export type ExtCanvas = fabric.Canvas & {
    isDragging: boolean;
    lastPosX: number;
    lastPosY: number;
  };
}

export default DringPlugin;
