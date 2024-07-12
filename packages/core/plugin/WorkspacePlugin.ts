/*
 * @Author: 秦少卫
 * @Date: 2023-06-27 12:26:41
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-30 20:00:37
 * @Description: 画布区域插件
 */

import { fabric } from 'fabric';
import Editor from '../Editor';
import { throttle } from 'lodash-es';
type IEditor = Editor;

class WorkspacePlugin implements IPluginTempl {
  static pluginName = 'WorkspacePlugin';
  static events = ['sizeChange', 'zoomChange'];
  static apis = [
    'big',
    'small',
    'auto',
    'one',
    'setSize',
    'getWorkspase',
    'setWorkspaseBg',
    'setCenterFromObject',
  ];
  workspaceEl!: HTMLElement;
  workspace: null | fabric.Rect;
  resizeObserver!: ResizeObserver;
  coverMask: null | fabric.Rect = null;
  option: any;
  zoomRatio: number;
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {
    this.workspace = null;
    this.init({
      width: 900,
      height: 2000,
    });
    this.zoomRatio = 0.85;
  }

  init(option: { width: number; height: number }) {
    const workspaceEl = document.querySelector('#workspace') as HTMLElement;
    if (!workspaceEl) {
      throw new Error('element #workspace is missing, plz check!');
    }
    this.workspaceEl = workspaceEl;
    this.workspace = null;
    this.option = option;
    this._initBackground();
    this._initWorkspace();
    this._initResizeObserve();
    this._bindWheel();
  }

  hookImportAfter() {
    return new Promise((resolve) => {
      const workspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
      if (workspace) {
        workspace.set('selectable', false);
        workspace.set('hasControls', false);
        workspace.set('evented', false);
        this.setSize(workspace.width, workspace.height);
      }
      resolve('');
    });
  }

  hookSaveAfter() {
    return new Promise((resolve) => {
      this.auto();
      resolve(true);
    });
  }

  // 初始化背景
  _initBackground() {
    this.canvas.backgroundImage = '';
    this.canvas.setWidth(this.workspaceEl.offsetWidth);
    this.canvas.setHeight(this.workspaceEl.offsetHeight);
  }

  // 初始化画布
  _initWorkspace() {
    const { width, height } = this.option;
    const workspace = new fabric.Rect({
      fill: 'rgba(255,255,255,1)',
      width,
      height,
      id: 'workspace',
      strokeWidth: 0,
    });
    workspace.set('selectable', false);
    workspace.set('hasControls', false);
    workspace.hoverCursor = 'default';
    this.canvas.add(workspace);
    this.canvas.renderAll();

    this.workspace = workspace;
    if (this.canvas.clearHistory) {
      this.canvas.clearHistory();
    }
    this.auto();
  }

  // 返回workspace对象
  getWorkspase() {
    return this.canvas.getObjects().find((item) => item.id === 'workspace') as fabric.Rect;
  }

  /**
   * 设置画布中心到指定对象中心点上
   * @param {Object} obj 指定的对象
   */
  setCenterFromObject(obj: fabric.Rect) {
    const { canvas } = this;
    const objCenter = obj.getCenterPoint();
    const viewportTransform = canvas.viewportTransform;
    if (canvas.width === undefined || canvas.height === undefined || !viewportTransform) return;
    viewportTransform[4] = canvas.width / 2 - objCenter.x * viewportTransform[0];
    viewportTransform[5] = canvas.height / 2 - objCenter.y * viewportTransform[3];
    canvas.setViewportTransform(viewportTransform);
    canvas.renderAll();
  }

  // 初始化监听器
  _initResizeObserve() {
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        this.auto();
      }, 50)
    );
    this.resizeObserver = resizeObserver;
    this.resizeObserver.observe(this.workspaceEl);
  }

  setSize(width: number | undefined, height: number | undefined) {
    this._initBackground();
    this.option.width = width;
    this.option.height = height;
    // 重新设置workspace
    this.workspace = this.canvas
      .getObjects()
      .find((item) => item.id === 'workspace') as fabric.Rect;
    this.workspace.set('width', width);
    this.workspace.set('height', height);
    this.editor.emit('sizeChange', this.workspace.width, this.workspace.height);
    this.auto();
  }

  setCoverMask(hack = false) {
    if (!this.coverMask || !this.workspace) {
      return;
    }
    const center = this.canvas.getCenter();
    const zoom = this.canvas.getZoom();
    this.canvas.zoomToPoint(
      new fabric.Point(center.left, center.top),
      hack ? zoom - 0.0000001 : zoom // 比较hack的方法，判断为fabric内部的数据更新问题
    );
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
        this.coverMask!.objectCaching = false;
        this.coverMask!.clipPath = clone;
        this.canvas.requestRenderAll();
      });
    }
  }

  clipPath() {
    if (this.coverMask) {
      return;
    }
    // 超出画布不展示
    this.workspace?.clone((cloned: fabric.Rect) => {
      this.canvas.clipPath = cloned;
      this.canvas.requestRenderAll();
    });
  }

  maskEnable(needBindLoadJSON = true) {
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
    needBindLoadJSON && this.editor.on('loadJson', () => this.maskEnable(false));
  }

  setZoomAuto(scale: number, cb?: (left?: number, top?: number) => void) {
    const { workspaceEl } = this;
    const width = workspaceEl.offsetWidth;
    const height = workspaceEl.offsetHeight;
    this.canvas.setWidth(width);
    this.canvas.setHeight(height);
    const center = this.canvas.getCenter();
    this.canvas.setViewportTransform(fabric.iMatrix.concat());
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), scale);
    if (!this.workspace) return;
    this.setCenterFromObject(this.workspace);
    // console.log(this.editor, this.canvas)
    // this.editor &&  this.editor?.workspaceMaskToggle();

    if (cb) cb(this.workspace.left, this.workspace.top);
  }

  _getScale() {
    return fabric.util.findScaleToFit(this.getWorkspase(), {
      width: this.workspaceEl.offsetWidth,
      height: this.workspaceEl.offsetHeight,
    });
  }

  // 放大
  big() {
    let zoomRatio = this.canvas.getZoom();
    zoomRatio += 0.05;
    const center = this.canvas.getCenter();
    this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoomRatio);
  }

  // 缩小
  small() {
    let zoomRatio = this.canvas.getZoom();
    zoomRatio -= 0.05;
    const center = this.canvas.getCenter();
    this.canvas.zoomToPoint(
      new fabric.Point(center.left, center.top),
      zoomRatio < 0 ? 0.01 : zoomRatio
    );
  }

  // 自动缩放
  auto() {
    const scale = this._getScale();
    this.setZoomAuto(scale * this.zoomRatio);
  }

  // 1:1 放大
  one() {
    this.setZoomAuto(1 * this.zoomRatio);
    this.canvas.requestRenderAll();
  }

  setWorkspaseBg(color: string) {
    const workspase = this.getWorkspase();
    workspase?.set('fill', color);
  }

  _bindWheel() {
    this.canvas.on('mouse:wheel', (opt) => {
      const delta = opt.e.deltaY;
      let zoom = this.canvas.getZoom();
      zoom *= 0.999 ** delta;
      if (zoom > 20) zoom = 20;
      if (zoom < 0.01) zoom = 0.01;
      const center = this.canvas.getCenter();
      this.canvas.zoomToPoint(new fabric.Point(center.left, center.top), zoom);

      // this.editor && this.editor?.workspaceMaskToggle()

      opt.e.preventDefault();
      opt.e.stopPropagation();
    });
  }

  clipPathOrRefreshMask() {
    if (this.editor.getPlugin('MaskPlugin')) {
      this.editor.setCoverMask(true);
    } else {
      // 超出画布不展示
      this.workspace?.clone((cloned: fabric.Rect) => {
        this.canvas.clipPath = cloned;
        this.canvas.requestRenderAll();
      });
    }
  }

  destroy() {
    this.resizeObserver.disconnect();
    this.canvas.off();
    console.log('pluginDestroy');
  }
}

export default WorkspacePlugin;
