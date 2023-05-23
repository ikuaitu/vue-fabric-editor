/*
 * @Author: 秦少卫
 * @Date: 2023-02-03 23:29:34
 * @LastEditors: 白召策
 * @LastEditTime: 2023-05-23 10:50:28
 * @Description: 核心入口文件
 */
import EventEmitter from 'events';
// import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';

// 对齐辅助线
import initAligningGuidelines from '@/core/initAligningGuidelines';
import initControlsRotate from '@/core/initControlsRotate';
import InitCenterAlign from '@/core/initCenterAlign';
import initHotkeys from '@/core/initHotKeys';
import initControls from '@/core/initControls';
import initRuler from '@/core/ruler';
import EditorGroupText from '@/core/EditorGroupText';
import type CanvasRuler from '@/core/ruler/ruler';
import type EditorWorkspace from '@/core/EditorWorkspace';

import type { fabric } from 'fabric';

class Editor extends EventEmitter {
  canvas: fabric.Canvas;
  editorWorkspace: EditorWorkspace | null;
  centerAlign: InitCenterAlign;
  ruler: CanvasRuler;
  constructor(canvas: fabric.Canvas) {
    super();

    this.canvas = canvas;
    this.editorWorkspace = null;

    initAligningGuidelines(canvas);
    initHotkeys(canvas);
    initControls(canvas);
    initControlsRotate(canvas);
    new EditorGroupText(canvas);
    this.centerAlign = new InitCenterAlign(canvas);
    this.ruler = initRuler(canvas);
  }


  pasteObj(cloned: fabric.Object) {
    const canvas = this.canvas;
    // 间距设置
    const grid = 10;
    // 再次进行克隆，处理选择多个对象的情况
    cloned.clone((clonedObj: fabric.Object) => {
      canvas.discardActiveObject();
      if (clonedObj.left === undefined || clonedObj.top === undefined) return;
      // 设置位置信息
      clonedObj.set({
        left: clonedObj.left + grid,
        top: clonedObj.top + grid,
        evented: true,
        id: uuid(),
      });
      if (clonedObj.type === 'activeSelection') {
        // 将克隆的画布重新赋值
        clonedObj.canvas = canvas;
        // eslint-disable-next-line
        clonedObj.forEachObject((obj: fabric.Object) => {
          canvas.add(obj);
        });
        // 解决不可选择问题
        clonedObj.setCoords();
      } else {
        canvas.add(clonedObj);
      }
      if (cloned.left === undefined || cloned.top === undefined) return;
      cloned.top += grid;
      cloned.left += grid;
      canvas.setActiveObject(clonedObj);
      canvas.requestRenderAll();
    });
  }

  clone() {
    const activeObject = this.canvas.getActiveObject();
    activeObject?.clone((cloned: fabric.Object) => {
      this.pasteObj(cloned);
    });
  }

  // 拆分组
  unGroup() {
    const activeObject = this.canvas.getActiveObject() as fabric.Group;
    if (!activeObject) return;
    // 先获取当前选中的对象，然后打散
    activeObject.toActiveSelection();
    activeObject.getObjects().forEach((item: fabric.Object) => {
      item.set('id', uuid());
    });
    this.canvas.discardActiveObject().renderAll();
  }

  group() {
    // 组合元素
    const activeObj = this.canvas.getActiveObject() as fabric.ActiveSelection;
    if (!activeObj) return;
    const activegroup = activeObj.toGroup();
    const objectsInGroup = activegroup.getObjects();
    activegroup.clone((newgroup: fabric.Group) => {
      newgroup.set('id', uuid());
      this.canvas.remove(activegroup);
      objectsInGroup.forEach((object) => {
        this.canvas.remove(object);
      });
      this.canvas.add(newgroup);
      this.canvas.setActiveObject(newgroup);
    });
  }

  up() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.bringForward();
      this.canvas.renderAll();
      this._workspaceSendToBack();
    }
  }

  upTop() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.bringToFront();
      this.canvas.renderAll();
      this._workspaceSendToBack();
    }
  }

  down() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.sendBackwards();
      this.canvas.renderAll();
      this._workspaceSendToBack();
    }
  }

  downTop() {
    const actives = this.canvas.getActiveObjects();
    if (actives && actives.length === 1) {
      const activeObject = this.canvas.getActiveObjects()[0];
      activeObject && activeObject.sendToBack();
      this.canvas.renderAll();
      this._workspaceSendToBack();
    }
  }

  getWorkspace() {
    return this.canvas.getObjects().find((item) => item.id === 'workspace');
  }

  _workspaceSendToBack() {
    const workspace = this.getWorkspace();
    workspace && workspace.sendToBack();
  }

  getJson() {
    return this.canvas.toJSON(['id', 'gradientAngle', 'selectable', 'hasControls']);
  }

  /**
   * @description: 拖拽添加到画布
   * @param {Event} event
   * @param {Object} item
   */
  dragAddItem(event: DragEvent, item: fabric.Object) {
    const { left, top } = this.canvas.getSelectionElement().getBoundingClientRect();
    if (event.x < left || event.y < top || item.width === undefined) return;

    const point = {
      x: event.x - left,
      y: event.y - top,
    };
    const pointerVpt = this.canvas.restorePointerVpt(point);
    item.left = pointerVpt.x - item.width / 2;
    item.top = pointerVpt.y;
    this.canvas.add(item);
    this.canvas.requestRenderAll();
  }
}

export default Editor;
