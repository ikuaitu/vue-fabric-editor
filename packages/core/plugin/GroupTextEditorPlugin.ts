/*
 * @Author: 秦少卫
 * @Date: 2023-06-22 16:11:40
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-10 17:33:22
 * @Description: 组内文字编辑
 */

import { fabric } from 'fabric';
import Editor from '../Editor';
import { isGroup } from '../utils/utils';
import { v4 as uuid } from 'uuid';
type IEditor = Editor;

class GroupTextEditorPlugin implements IPluginTempl {
  static pluginName = 'GroupTextEditorPlugin';
  isDown = false;
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {
    this._init();
  }

  // 组内文本输入
  _init() {
    this.canvas.on('mouse:down', (opt) => {
      this.isDown = true;
      // 重置选中controls
      if (
        opt.target &&
        !opt.target.lockMovementX &&
        !opt.target.lockMovementY &&
        !opt.target.lockRotation &&
        !opt.target.lockScalingX &&
        !opt.target.lockScalingY
      ) {
        opt.target.hasControls = true;
      }
    });

    this.canvas.on('mouse:up', () => {
      this.isDown = false;
    });

    this.canvas.on('mouse:dblclick', (opt) => {
      if (isGroup(opt.target)) {
        const selectedObject = this._getGroupObj(opt) as fabric.IText;
        if (!selectedObject) return;
        selectedObject.selectable = true;
        // 由于组内的元素，双击以后会导致controls偏移，因此隐藏他
        if (selectedObject.hasControls) {
          selectedObject.hasControls = false;
        }
        if (this.isText(selectedObject)) {
          this._bedingTextEditingEvent(selectedObject, opt.target);
          return;
        }
        this.canvas.setActiveObject(selectedObject);
        this.canvas.renderAll();
      }
    });
  }

  // 获取点击区域内的组内文字元素
  _getGroupTextObj(opt: fabric.IEvent<MouseEvent>) {
    const pointer = this.canvas.getPointer(opt.e, true);
    if (!isGroup(opt.target)) return false;
    const clickObj = this.canvas._searchPossibleTargets(opt.target._objects, pointer);
    if (clickObj && this.isText(clickObj)) {
      return clickObj;
    }
    return false;
  }

  _getGroupObj(opt: fabric.IEvent<MouseEvent>) {
    const pointer = this.canvas.getPointer(opt.e, true);
    if (!isGroup(opt.target)) return false;
    const clickObj = this.canvas._searchPossibleTargets(opt.target._objects, pointer);
    return clickObj;
  }

  // 通过组合重新组装来编辑文字，可能会耗性能。
  _bedingTextEditingEvent(textObject: fabric.IText, groupObj: fabric.Group) {
    const textObjectJSON = textObject.toObject();

    const groupMatrix: number[] = groupObj.calcTransformMatrix();

    const a: number = groupMatrix[0];
    const b: number = groupMatrix[1];
    const c: number = groupMatrix[2];
    const d: number = groupMatrix[3];
    const e: number = groupMatrix[4];
    const f: number = groupMatrix[5];

    const newX = a * (textObject.left ?? 0) + c * (textObject.top ?? 0) + e;
    const newY = b * (textObject.left ?? 0) + d * (textObject.top ?? 0) + f;

    const tempText = new (textObject.constructor as typeof fabric.IText)(textObject.text ?? '', {
      ...textObjectJSON,
      scaleX: textObjectJSON.scaleX * a,
      scaleY: textObjectJSON.scaleY * a,
      textAlign: textObject.textAlign,
      left: newX,
      top: newY,
      styles: textObject.styles,
      groupCopyed: textObject.group,
    });
    tempText.id = uuid();
    textObject.visible = false;
    groupObj.addWithUpdate();
    tempText.visible = true;
    tempText.selectable = true;
    tempText.hasControls = false;
    tempText.editable = true;
    this.canvas.add(tempText);
    this.canvas.setActiveObject(tempText);
    tempText.enterEditing();
    tempText.selectAll();

    tempText.on('editing:exited', () => {
      // 进入编辑模式时触发
      textObject.set({
        text: tempText.text,
        visible: true,
      });
      groupObj.addWithUpdate();
      tempText.visible = false;
      this.canvas.remove(tempText);
      this.canvas.setActiveObject(groupObj);
    });
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
