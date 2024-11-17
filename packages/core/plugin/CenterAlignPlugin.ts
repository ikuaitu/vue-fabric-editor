/*
 * @Author: 秦少卫
 * @Date: 2023-06-15 22:49:42
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2024-11-03 20:39:43
 * @Description: 居中对齐插件
 */

import { fabric } from 'fabric';
import type { IEditor, IPluginTempl } from '@kuaitu/core';

type IPlugin = Pick<CenterAlignPlugin, 'centerH' | 'center' | 'position' | 'centerV'>;

declare module '@kuaitu/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IEditor extends IPlugin {}
}

class CenterAlignPlugin implements IPluginTempl {
  static pluginName = 'CenterAlignPlugin';
  static apis = ['centerH', 'center', 'position', 'centerV'];
  // public hotkeys: string[] = ['space'];
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {}

  center(workspace: fabric.Rect, object: fabric.Object) {
    const center = workspace.getCenterPoint();
    return this.canvas._centerObject(object, center);
  }

  centerV(workspace: fabric.Rect, object: fabric.Object) {
    return this.canvas._centerObject(
      object,
      new fabric.Point(object.getCenterPoint().x, workspace.getCenterPoint().y)
    );
  }

  centerH(workspace: fabric.Rect, object: fabric.Object) {
    return this.canvas._centerObject(
      object,
      new fabric.Point(workspace.getCenterPoint().x, object.getCenterPoint().y)
    );
  }

  position(name: 'centerH' | 'center' | 'centerV') {
    const anignType = ['centerH', 'center', 'centerV'];
    const activeObject = this.canvas.getActiveObject();
    if (anignType.includes(name) && activeObject) {
      const defaultWorkspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
      if (defaultWorkspace) {
        this[name](defaultWorkspace, activeObject);
      }
      this.canvas.renderAll();
    }
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      return [
        {
          text: '水平垂直居中',
          hotkey: '',
          disabled: false,
          onclick: () => this.position('center'),
        },
      ];
    }
  }
  destroy() {
    console.log('pluginDestroy');
  }
}

export default CenterAlignPlugin;
