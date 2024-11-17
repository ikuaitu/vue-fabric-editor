/*
 * @Author: George
 * @Date: 2024-10-29 11:11:11
 * @LastEditors: George
 * @LastEditTime: 2024-10-29 11:11:11
 * @Description: 鼠标中键点击事件插件
 */

import { fabric } from 'fabric';
import type { IEditor, IPluginTempl } from '@kuaitu/core';

class MiddleMousePlugin implements IPluginTempl {
  static pluginName = 'MiddleMousePlugin';
  workspaceEl!: HTMLElement;

  constructor(public canvas: fabric.Canvas, public editor: IEditor) {
    this.init();
  }

  private init() {
    const workspaceEl = document.querySelector('#workspace') as HTMLElement;
    if (!workspaceEl) {
      throw new Error('element #workspace is missing, plz check!');
    }
    this.workspaceEl = workspaceEl;
    this.initListener();
  }

  private handleMouseUp = (e: MouseEvent) => e.button === 1 && this.canvas.fire('mouse:up', { e });

  private handleMouseDown = (e: MouseEvent) =>
    e.button === 1 && this.canvas.fire('mouse:down', { e });

  /**
   * @desc 初始化鼠标中键监听事件
   */
  private initListener() {
    this.workspaceEl.addEventListener('mouseup', this.handleMouseUp);
    this.workspaceEl.addEventListener('mousedown', this.handleMouseDown);
  }

  destroy() {
    this.workspaceEl.removeEventListener('mouseup', this.handleMouseUp);
    this.workspaceEl.removeEventListener('mousedown', this.handleMouseDown);
    console.log('pluginDestroy');
  }
}

export default MiddleMousePlugin;
