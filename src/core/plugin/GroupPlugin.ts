/*
 * @Author: 秦少卫
 * @Date: 2023-06-20 13:21:10
 * @LastEditors: bamzc
 * @LastEditTime: 2023-08-07 17:08:21
 * @Description: 组合拆分组合插件
 */

import { fabric } from 'fabric';
import Editor from '../core';
import { v4 as uuid } from 'uuid';
type IEditor = Editor;

class GroupPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'GroupPlugin';
  static apis = ['unGroup', 'group'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  // 拆分组
  unGroup() {
    const activeObject = this.canvas.getActiveObject() as fabric.Group;
    if (!activeObject) return;
    const canvas = this.canvas;
    // 获取拆分组之前的所有对象
    const allObjects = canvas.getObjects();

    const activeObjects = activeObject.getObjects();
    // 先获取当前选中的对象，然后打散
    activeObject.toActiveSelection();

    const newAllObjectsNotActive: fabric.Object[] = [];

    // 遍历打散重新组合的所有对象，并且过滤掉组合内的对象
    canvas.getObjects().map((element: fabric.Object) => {
      if (activeObjects.some((item) => item.id === element.id)) {
        return;
      }
      newAllObjectsNotActive.push(element);
    });
    let activeObjectIndex = 0;

    // 找到原来所有对象中，组合对象的位置
    allObjects.some((item, i) => {
      if (item.id === activeObject.id) {
        activeObjectIndex = i;
      }
    });

    if (activeObjectIndex === 0) {
      newAllObjectsNotActive.concat(activeObjects);
    } else {
      // 从原位置进行组合拆分，避免自动将拆分的组合置顶处理
      // Array.prototype.splice.apply(
      //   newAllObjectsNotActive,
      //   [activeObjectIndex, 0].concat(activeObjects)
      // );
      newAllObjectsNotActive.splice(activeObjectIndex, 0, ...activeObjects);
    }

    // 重新将所有的元素对象进行排序
    canvas._objects = newAllObjectsNotActive;
    canvas.discardActiveObject().renderAll();
  }

  group() {
    // 组合元素
    const activeObj = this.canvas.getActiveObject() as fabric.ActiveSelection;
    if (!activeObj) return;
    const canvas = this.canvas;
    // 获取组合之前的所有对象
    const allObjects = canvas.getObjects();
    const activegroup = activeObj.toGroup();

    const objectsInGroup = activegroup.getObjects();

    let needIndex = -1;

    // 找到原来所有对象中，组合里面对象位置最高的那一个
    allObjects.some((item, i) => {
      if (objectsInGroup.some((obj) => obj.id === item.id)) {
        needIndex = i;
      }
    });

    // 找到原来所有对象中，组合里面对象的所有位置
    const oldGroupsPos: fabric.Object[] = [];
    allObjects.map((item) => {
      if (objectsInGroup.some((obj) => obj.id === item.id)) {
        oldGroupsPos.push(item);
      }
    });

    console.log('元素排序前', allObjects, needIndex);

    activegroup.set('id', uuid());
    activegroup._objects = oldGroupsPos;
    objectsInGroup.forEach((object) => {
      this.canvas.remove(object);
    });
    this.canvas.remove(activegroup);
    canvas.add(activegroup);
    canvas.setActiveObject(activegroup);

    const newAllObjectsNotActive: fabric.Object[] = [];

    canvas.getObjects().map((element: fabric.Object) => {
      if (activegroup.id === element.id) {
        return;
      }
      newAllObjectsNotActive.push(element);
    });
    needIndex = needIndex === -1 ? 0 : needIndex - (objectsInGroup.length - 1);
    // 从未组合之前，需要组合的元素，并且其中位置最高的元素，从这个位置进行组合插入
    if (needIndex === 0) {
      newAllObjectsNotActive.push(activegroup);
    } else {
      newAllObjectsNotActive.splice(needIndex, 0, activegroup);
    }
    console.log('元素排序后', newAllObjectsNotActive, needIndex);
    // 重新将所有的元素对象进行排序
    canvas._objects = newAllObjectsNotActive;
    canvas.renderAll();
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject();
    console.log(activeObject, '111');
    if (activeObject && activeObject.type === 'group') {
      return [
        { text: '拆分组合', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.unGroup() },
      ];
    }

    if (this.canvas.getActiveObjects().length > 1) {
      return [{ text: '组合', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.group() }];
    }
  }
  destroy() {
    console.log('pluginDestroy');
  }
}

export default GroupPlugin;
