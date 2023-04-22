/*
/*
 * @Author: 秦少卫
 * @Date: 2023-04-20 02:15:09
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-20 14:01:44
 * @Description: 编辑组内文字
 */

import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';

class EditorGroupText {
  canvas: fabric.Canvas;
  isDown: boolean;
  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this._init();
    this.isDown = false;
  }

  // 组内文本输入
  _init() {
    this.canvas.on('mouse:down', (opt) => {
      this.isDown = true;
      if (opt.target && opt.target.type === 'group') {
        const textObject = this._getGroupTextObj(opt) as fabric.IText;
        if (textObject) {
          this._bedingEditingEvent(textObject, opt);
          this.canvas.setActiveObject(textObject);
          textObject.enterEditing();
        } else {
          this.canvas.setActiveObject(opt.target);
        }
      }
    });

    this.canvas.on('mouse:up', () => {
      this.isDown = false;
    });

    this.canvas.on('mouse:move', (opt) => {
      if (this.isDown && opt.target && opt.target.type === 'group') {
        const textObject = this._getGroupTextObj(opt);
        if (textObject) {
          // todo bug 文字编辑结束后，点击组内其他元素可单独拖动
        }
      }
    });
  }

  // 获取点击区域内的组内文字元素
  _getGroupTextObj(opt: fabric.IEvent<MouseEvent>) {
    const pointer = this.canvas.getPointer(opt.e, true);
    const clickObj = this.canvas._searchPossibleTargets(opt.target?._objects, pointer);
    if (clickObj && this.isText(clickObj)) {
      return clickObj;
    }
    return false;
  }

  // 绑定编辑取消事件
  _bedingEditingEvent(textObject: fabric.IText, opt: fabric.IEvent<MouseEvent>) {
    if (!opt.target) return;
    const left = opt.target.left;
    const top = opt.target.top;
    const ids = this._unGroup() || [];

    const resetGroup = () => {
      console.log(0);
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
      console.log(111);
    };
    // 绑定取消事件
    textObject.on('editing:exited', resetGroup);
  }

  // 拆分组合并返回ID
  _unGroup() {
    const ids: string[] = [];
    const activeObj = this.canvas.getActiveObject() as fabric.Group;
    if (!activeObj) return;
    activeObj.toActiveSelection();
    activeObj.getObjects().forEach((item) => {
      const id = uuid();
      ids.push(id);
      item.set('id', id);
    });
    return ids;
  }

  isText(obj: fabric.Object) {
    return obj.type && ['i-text', 'text', 'textbox'].includes(obj.type);
  }
}

export default EditorGroupText;
