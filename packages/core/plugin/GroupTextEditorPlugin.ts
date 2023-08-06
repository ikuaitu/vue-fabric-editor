/*
 * @Author: 秦少卫
 * @Date: 2023-06-22 16:11:40
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-06-22 16:14:55
 * @Description: 组内文字编辑
 */

import { fabric } from 'fabric';
import Editor from '../core';
import { v4 as uuid } from 'uuid';
type IEditor = Editor;

class GroupTextEditorPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'GroupTextEditorPlugin';
  isDown = false;
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this._init();
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
  _unGroup() {
    const ids: string[] = [];
    const activeObj = this.canvas.getActiveObject() as fabric.Group;
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

  destroy() {
    console.log('pluginDestroy');
  }
}

export default GroupTextEditorPlugin;
