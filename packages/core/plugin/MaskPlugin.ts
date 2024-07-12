/*
 * @Author: 秦少卫
 * @Date: 2023-06-27 12:26:41
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-30 20:00:37
 * @Description: 画布区域插件
 */

import { fabric } from 'fabric';
import Editor from '../Editor';
type IEditor = Editor;

class MaskPlugin implements IPluginTempl {
  static pluginName = 'MaskPlugin';
  static apis = ['setCoverMask'];
  coverMask: null | fabric.Rect = null;
  workspace: null | fabric.Rect = null;
  workspaceEl!: HTMLElement;
  hackFlag = false;

  constructor(public canvas: fabric.Canvas, public editor: IEditor) {
    this.init();
  }

  private init() {
    const workspaceEl = document.querySelector('#workspace') as HTMLElement;
    if (!workspaceEl) {
      throw new Error('element #workspace is missing, plz check!');
    }
    this.workspaceEl = workspaceEl;
    this.initMask();
  }

  // 返回workspace对象
  getWorkspase() {
    return this.canvas.getObjects().find((item) => item.id === 'workspace') as fabric.Rect;
  }

  setCoverMask(hack = false) {
    if (!this.coverMask || !this.workspace) {
      return;
    }
    const center = this.canvas.getCenter();
    const zoom = this.canvas.getZoom();
    let zoomToPointNumber = zoom;
    if (hack) {
      // 比较hack的方法，判断为fabric内部的数据更新问题
      zoomToPointNumber += 0.0000001 * (this.hackFlag ? 1 : -1);
      this.hackFlag = !this.hackFlag;
    }

    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomToPointNumber);
    if (zoom) {
      const { workspaceEl } = this;
      const width = workspaceEl.offsetWidth;
      const height = workspaceEl.offsetHeight;
      const cWidth = width / zoom;
      const cHeight = height / zoom;
      this.coverMask.width = cWidth;
      this.coverMask.height = cHeight;
      this.coverMask.left = (this.workspace.left || 0) + (this.workspace.width! - cWidth) / 2;
      this.coverMask.top = (this.workspace.top || 0) + (this.workspace.height! - cHeight) / 2;
      this.workspace.clone((clone: fabric.Rect) => {
        clone.left = -clone.width! / 2;
        clone.top = -clone.height! / 2;
        clone.inverted = true;
        this.coverMask!.clipPath = clone;
        this.canvas.requestRenderAll();
      });
    }
  }

  initMask(needBindLoadJSON = true) {
    this.workspace = this.getWorkspase();
    if (!this.workspace) {
      throw new Error('MaskPlugin must be used after WorkspacePlugin!');
    }
    const coverMask = new fabric.Rect({
      fill: 'rgba(0,0,0,0.7)',
      id: 'coverMask',
      strokeWidth: 0,
    });
    coverMask.set('selectable', false);
    coverMask.set('hasControls', false);
    coverMask.set('evented', false);
    coverMask.hoverCursor = 'default';
    this.canvas.on('object:added', () => {
      coverMask.bringToFront();
    });
    this.canvas.clipPath = undefined;
    this.canvas.add(coverMask);
    this.coverMask = coverMask;
    this.setCoverMask();
    // 适配模板和psd的loadjson，在加载完成后再入mask
    needBindLoadJSON && this.editor.on('loadJson', () => this.initMask(false));
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default MaskPlugin;
