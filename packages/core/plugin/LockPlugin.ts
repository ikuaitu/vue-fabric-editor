/*
 * @Author: 秦少卫
 * @Date: 2024-07-04 14:27:05
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-07-22 10:11:29
 * @Description: 锁定文件
 */
import { fabric } from 'fabric';
import { SelectEvent, SelectMode } from '../eventType';
import type { IEditor, IPluginTempl } from '@kuaitu/core';
import lockImg from '../assets/lock.svg?url';
// import lockImg from '../assets/rotateicon.svg?url';
// import unlockImg from '../assets/unlock.svg?url'

type IPlugin = Pick<LockPlugin, 'lock' | 'unLock'>;

declare module '@kuaitu/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IEditor extends IPlugin {}
}

enum ItypeKey {
  lockMovementX = 'lockMovementX',
  lockMovementY = 'lockMovementY',
  lockRotation = 'lockRotation',
  lockScalingX = 'lockScalingX',
  lockScalingY = 'lockScalingY',
}

enum IControlKey {
  bl = 'bl',
  br = 'br',
  mb = 'mb',
  ml = 'ml',
  mr = 'mr',
  mt = 'mt',
  tl = 'tl',
  tr = 'tr',
  mtr = 'mtr',
  lock = 'lock',
}

export default class LockPlugin implements IPluginTempl {
  static pluginName = 'LockPlugin';
  static apis = ['lock', 'unLock'];
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {
    this.init();
  }

  init() {
    const imgEl = document.createElement('img');
    imgEl.src = lockImg;
    const that = this;
    function renderIcon(
      ctx: CanvasRenderingContext2D,
      left: number,
      top: number,
      styleOverride: any,
      fabricObject: fabric.Object
    ) {
      const iconWith = 25;
      ctx.save();
      ctx.translate(left, top);
      const angle = fabricObject.angle as number;
      ctx.rotate(fabric.util.degreesToRadians(angle));
      ctx.drawImage(imgEl, -iconWith / 2, -iconWith / 2, iconWith, iconWith);
      ctx.restore();
    }

    function unLockObject(eventData: any, transform: any): boolean {
      that.unLock();
      return true;
    }

    fabric.Object.prototype.controls.lock = new fabric.Control({
      x: 0.5,
      y: 0.5,
      offsetY: 0,
      cursorStyle: 'pointer',
      mouseUpHandler: unLockObject,
      render: renderIcon,
    });

    fabric.Textbox.prototype.controls.lock = new fabric.Control({
      x: 0.5,
      y: 0.5,
      offsetY: 0,
      cursorStyle: 'pointer',
      mouseUpHandler: unLockObject,
      render: renderIcon,
    });
    this.canvas.on('selection:created', () => this.renderCornerByActiveObj());
    this.canvas.on('selection:updated', () => this.renderCornerByActiveObj());

    // 鼠标框选不能多选锁定元素
    (fabric.Canvas.prototype as any)._groupSelectedObjects = function (e: any) {
      const group = this._collectObjects(e);
      let aGroup;

      for (let i = group.length - 1; i >= 0; i--) {
        if (group[i].lockMovementX) {
          group.splice(i, 1);
        }
      }

      // do not create group for 1 element only
      if (group.length === 1) {
        this.setActiveObject(group[0], e);
      } else if (group.length > 1) {
        aGroup = new fabric.ActiveSelection(group.reverse(), {
          canvas: this,
        });
        this.setActiveObject(aGroup, e);
      }
    };

    // shift+左键点选不能多选锁定元素
    (fabric.Canvas.prototype as any)._handleGrouping = function (e: any, target: fabric.Object) {
      const activeObject = this._activeObject;
      // avoid multi select when shift click on a corner
      if (activeObject.__corner) {
        return;
      }

      if (target.lockMovementX) return;
      if (activeObject.lockMovementX) return;

      if (target === activeObject) {
        // if it's a group, find target again, using activeGroup objects
        target = this.findTarget(e, true);
        // if even object is not found or we are on activeObjectCorner, bail out
        if (!target || !target.selectable) {
          return;
        }
        if (target.lockMovementX) return;
      }
      if (activeObject && activeObject.type === 'activeSelection') {
        this._updateActiveSelection(target, e);
      } else {
        this._createActiveSelection(target, e);
      }
    };
  }

  controlCornersVisible(obj: fabric.Object) {
    const isLocked = obj.lockMovementX;
    Object.values(IControlKey).forEach((key: IControlKey) => {
      if (key === IControlKey.lock) {
        obj.setControlVisible(key, isLocked);
      } else {
        obj.setControlVisible(key, !isLocked);
      }
    });
  }

  renderCornerByActiveObj() {
    const actives = this.canvas
      .getActiveObjects()
      .filter((item) => !(item instanceof fabric.GuideLine));
    if (actives && actives.length === 1) {
      const active = actives[0];
      this.controlCornersVisible(active);
    } else if (actives && actives.length > 1) {
      const active = this.canvas.getActiveObject();
      if (active) {
        this.controlCornersVisible(active);
      }
    }
  }

  hookImportAfter() {
    this.canvas.forEachObject((obj: fabric.Object) => {
      if (obj.hasControls === false && obj.selectable === false) {
        this.canvas.setActiveObject(obj);
        this.lock();
      }
    });
    return Promise.resolve();
  }

  lock() {
    const activeObject = this.canvas.getActiveObject() as fabric.Object;
    if (activeObject) {
      // 修改默认属性
      Object.values(ItypeKey).forEach((key: ItypeKey) => {
        activeObject[key] = true;
      });
      this.controlCornersVisible(activeObject);
      this.canvas.renderAll();
      this.editor.emit(SelectEvent.ONE, [activeObject]);
    }
  }

  unLock() {
    const activeObject = this.canvas.getActiveObject() as fabric.Object;
    if (activeObject) {
      activeObject.hasControls = true;
      activeObject.selectable = true;
      activeObject.evented = true;
      // 修改默认属性
      Object.values(ItypeKey).forEach((key: ItypeKey) => {
        activeObject[key] = false;
      });
      this.controlCornersVisible(activeObject);
      this.canvas.renderAll();
      this.editor.emit(SelectEvent.ONE, [activeObject]);
    }
  }

  contextMenu() {
    const selectedMode = this.editor.getSelectMode();
    const activeObject = this.canvas.getActiveObject();
    if (selectedMode === SelectMode.ONE && activeObject) {
      if (activeObject.selectable) {
        return [{ text: '锁定', hotkey: '', onclick: () => this.lock() }];
      } else {
        return [{ text: '解锁', hotkey: '', onclick: () => this.unLock() }];
      }
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}
