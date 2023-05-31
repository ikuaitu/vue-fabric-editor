/*
/*
 * @Author: 秦少卫
 * @Date: 2023-04-20 02:15:09
 * @LastEditors: 白召策
 * @LastEditTime: 2023-05-31 11:38:33
 * @Description: 编辑组内文字
 */

import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';

class EditorGroup {
  canvas: fabric.Canvas;
  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this._init();
  }

  // 组内文本输入
  _init() {
    this.canvas.on('mouse:down', (opt) => {
      if (opt.target && opt.target.type === 'group') {
        const clickObj = this._getGroupObj(opt);
        if (!clickObj) return;
        clickObj.selectable = true;
        clickObj.hasControls = false;
        this.canvas.setActiveObject(clickObj);
      }
    });

    this.canvas.on('mouse:dblclick', (opt) => {
      if (opt.target && opt.target.type === 'group') {
        const clickObj = this._getGroupObj(opt);
        if (!clickObj) return;
        clickObj.selectable = true;
        clickObj.hasControls = false;
        if (this.isText(clickObj)) {
          this._bedingEditingEvent(clickObj, opt);
          this.canvas.setActiveObject(clickObj);
          clickObj.enterEditing();
          return;
        }
      }
    });
  }

  // 获取点击区域内的组内元素
  _getGroupObj(opt: fabric.IEvent<MouseEvent>) {
    const pointer = this.canvas.getPointer(opt.e, true);
    const clickObj = this.canvas._searchPossibleTargets(opt.target?._objects, pointer);
    return clickObj;
  }

  // 绑定编辑取消事件
  _bedingEditingEvent(textObject: fabric.IText, opt: fabric.IEvent<MouseEvent>) {
    if (!opt.target) return;
    const left = opt.target.left;
    const top = opt.target.top;
    const ids = this._unGroup(opt.target) || [];

    const resetGroup = () => {
      const groupArr = this.canvas.getObjects().filter((item) => item.id && ids.includes(item.id));
      // 删除元素
      groupArr.forEach((item) => this.canvas.remove(item));
      // 生成新组
      const group = new fabric.Group([...groupArr]);
      group.set('left', left);
      group.set('top', top);
      group.set('id', uuid());
      textObject.off('editing:exited', resetGroup);
      this.canvas.add(group);
      this.canvas.discardActiveObject().renderAll();
    };
    // 绑定取消事件
    textObject.on('editing:exited', resetGroup);
  }

  // 拆分组合并返回ID
  _unGroup(activeObj: fabric.Group) {
    const ids: string[] = [];
    if (!activeObj) return;
    activeObj.getObjects().forEach((item) => {
      const id = uuid();
      ids.push(id);
      item.set('id', id);
    });
    activeObj.toActiveSelection();
    return ids;
  }

  isText(obj: fabric.Object) {
    return obj.type && ['i-text', 'text', 'textbox'].includes(obj.type);
  }
}

export default EditorGroup;
