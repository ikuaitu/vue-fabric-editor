/*
 * @Author: 秦少卫
 * @Date: 2023-06-22 16:19:46
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-07-22 10:21:05
 * @Description: 组对齐插件
 */

import { fabric } from 'fabric';
import type { IEditor, IPluginTempl } from '@kuaitu/core';

type IPlugin = Pick<
  GroupAlignPlugin,
  'left' | 'right' | 'xcenter' | 'ycenter' | 'top' | 'bottom' | 'xequation' | 'yequation'
>;

declare module '@kuaitu/core' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface IEditor extends IPlugin {}
}

class GroupAlignPlugin implements IPluginTempl {
  static pluginName = 'GroupAlignPlugin';
  static apis = ['left', 'right', 'xcenter', 'ycenter', 'top', 'bottom', 'xequation', 'yequation'];
  // public hotkeys: string[] = ['space'];
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {}

  left() {
    const { canvas } = this;

    const activeObject = canvas.getActiveObject();
    const selectObjects = canvas.getActiveObjects();
    if (activeObject) {
      const { left = 0 } = activeObject;
      canvas.discardActiveObject();
      selectObjects.forEach((item) => {
        const bounding = item.getBoundingRect(true);
        item.set({
          left: left - bounding.left + Number(item.left),
        });
        item.setCoords();
      });
      const activeSelection = new fabric.ActiveSelection(selectObjects, {
        canvas: canvas,
      });
      canvas.setActiveObject(activeSelection);
      canvas.requestRenderAll();
    }
  }

  right() {
    const { canvas } = this;

    const activeObject = canvas.getActiveObject();
    const selectObjects = canvas.getActiveObjects();
    if (activeObject) {
      const { left = 0, width = 0 } = activeObject;
      canvas.discardActiveObject();
      selectObjects.forEach((item) => {
        const bounding = item.getBoundingRect(true);
        item.set({
          left: left + width - (bounding.left + bounding.width) + Number(item.left),
        });
      });
      const activeSelection = new fabric.ActiveSelection(selectObjects, {
        canvas: canvas,
      });
      canvas.setActiveObject(activeSelection);
      canvas.requestRenderAll();
    }
  }

  xcenter() {
    const { canvas } = this;

    const activeObject = canvas.getActiveObject();
    const selectObjects = canvas.getActiveObjects();
    if (activeObject) {
      const { left = 0, width = 0 } = activeObject;
      canvas.discardActiveObject();
      selectObjects.forEach((item) => {
        const bounding = item.getBoundingRect(true);
        item.set({
          left: left + width / 2 - (bounding.left + bounding.width / 2) + Number(item.left),
        });
      });
      const activeSelection = new fabric.ActiveSelection(selectObjects, {
        canvas: canvas,
      });
      canvas.setActiveObject(activeSelection);
      canvas.requestRenderAll();
    }
  }

  ycenter() {
    const { canvas } = this;

    const activeObject = canvas.getActiveObject();
    const selectObjects = canvas.getActiveObjects();
    if (activeObject) {
      const { top = 0, height = 0 } = activeObject;
      canvas.discardActiveObject();
      selectObjects.forEach((item) => {
        const bounding = item.getBoundingRect(true);
        item.set({
          top: top + height / 2 - (bounding.top + bounding.height / 2) + Number(item.top),
        });
      });
      const activeSelection = new fabric.ActiveSelection(selectObjects, {
        canvas: canvas,
      });
      canvas.setActiveObject(activeSelection);
      canvas.requestRenderAll();
    }
  }

  top() {
    const { canvas } = this;

    const activeObject = canvas.getActiveObject();
    const selectObjects = canvas.getActiveObjects();
    if (activeObject) {
      const { top = 0 } = activeObject;
      canvas.discardActiveObject();
      selectObjects.forEach((item) => {
        const bounding = item.getBoundingRect(true);
        item.set({
          top: top - bounding.top + Number(item.top),
        });
      });
      const activeSelection = new fabric.ActiveSelection(selectObjects, {
        canvas: canvas,
      });
      canvas.setActiveObject(activeSelection);
      canvas.requestRenderAll();
    }
  }

  bottom() {
    const { canvas } = this;

    const activeObject = canvas.getActiveObject();
    const selectObjects = canvas.getActiveObjects();
    if (activeObject) {
      const { top = 0, height = 0 } = activeObject;
      canvas.discardActiveObject();
      selectObjects.forEach((item) => {
        const bounding = item.getBoundingRect(true);
        item.set({
          top: top + height - (bounding.top + bounding.height) + Number(item.top),
        });
      });
      const activeSelection = new fabric.ActiveSelection(selectObjects, {
        canvas: canvas,
      });
      canvas.setActiveObject(activeSelection);
      canvas.requestRenderAll();
    }
  }

  xequation() {
    const { canvas } = this;
    const activeObject = canvas.getActiveObject() as fabric.ActiveSelection;
    // width属性不准确，需要坐标换算
    function getItemWidth(item: fabric.Object) {
      let x1 = Infinity,
        x2 = -Infinity;
      for (const key in item.aCoords) {
        if (item.aCoords[key].x < x1) {
          x1 = item.aCoords[key].x;
        }
        if (item.aCoords[key].x > x2) {
          x2 = item.aCoords[key].x;
        }
      }
      return x2 - x1;
    }

    // 获取所有元素高度
    function getAllItemHeight() {
      let count = 0;
      if (activeObject) {
        activeObject.forEachObject((item: fabric.Object) => {
          count += getItemWidth(item);
        });
      }

      return count;
    }
    // 获取平均间距
    function spacWidth() {
      const count = getAllItemHeight();
      if (activeObject) {
        const allSpac = Number(activeObject.width) - count;
        return allSpac / (activeObject._objects.length - 1);
      }
    }

    // 获取当前元素之前所有元素的高度
    function getItemLeft(i: number) {
      if (i === 0) return 0;
      let width = 0;
      if (activeObject) {
        for (let index = 0; index < i; index++) {
          width += getItemWidth(activeObject._objects[index]);
        }
      }

      return width;
    }
    if (activeObject && activeObject.type === 'activeSelection') {
      const activeSelection = activeObject;
      // 排序
      activeSelection._objects.sort((a, b) => a.left - b.left);

      // 平均间距计算
      const itemSpac = spacWidth() as number;
      // 组原点高度
      const yHeight = Number(activeObject.width) / 2;

      activeObject.forEachObject((item: fabric.Object, i: number) => {
        // 获取当前元素之前所有元素的高度
        const preHeight = getItemLeft(i);
        // 顶部距离 间距 * 索引 + 之前元素高度 - 原点高度
        const top = itemSpac * i + preHeight - yHeight;
        item.set('left', top);
      });
    }

    const objecs = canvas.getActiveObjects();
    canvas.discardActiveObject();
    objecs.forEach((item: fabric.Object) => {
      let x = Infinity;
      for (const key in item.aCoords) {
        if (item.aCoords[key].x < x) {
          x = item.aCoords[key].x;
        }
      }
      item.set('left', 2 * item.left - x);
    });

    const sel = new fabric.ActiveSelection(objecs, {
      canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
  }

  yequation() {
    const { canvas } = this;
    const activeObject = (canvas.getActiveObject() as fabric.ActiveSelection) || {
      top: 0,
      height: 0,
    };
    // width属性不准确，需要坐标换算
    function getItemHeight(item: fabric.Object) {
      let y1 = Infinity,
        y2 = -Infinity;
      for (const key in item.aCoords) {
        if (item.aCoords[key].y < y1) {
          y1 = item.aCoords[key].y;
        }
        if (item.aCoords[key].y > y2) {
          y2 = item.aCoords[key].y;
        }
      }
      return y2 - y1;
    }
    // 获取所有元素高度
    function getAllItemHeight() {
      let count = 0;
      activeObject.forEachObject((item: fabric.Object) => {
        count += getItemHeight(item);
      });
      return count;
    }
    // 获取平均间距
    function spacHeight() {
      const count = getAllItemHeight();
      const allSpac = activeObject.height - count;
      return allSpac / (activeObject._objects.length - 1);
    }

    // 获取当前元素之前所有元素的高度
    function getItemTop(i: number) {
      if (i === 0) return 0;
      let height = 0;
      for (let index = 0; index < i; index++) {
        height += getItemHeight(activeObject._objects[index]);
      }
      return height;
    }

    if (activeObject && activeObject.type === 'activeSelection') {
      const activeSelection = activeObject;
      // 排序
      activeSelection._objects.sort((a, b) => a.top - b.top);

      // 平均间距计算
      const itemSpac = spacHeight();
      // 组原点高度
      const yHeight = Number(activeObject.height) / 2;

      activeObject.forEachObject((item: fabric.Object, i: number) => {
        // 获取当前元素之前所有元素的高度
        const preHeight = getItemTop(i);
        // 顶部距离 间距 * 索引 + 之前元素高度 - 原点高度
        const top = itemSpac * i + preHeight - yHeight;
        item.set('top', top);
      });
    }

    const objecs = canvas.getActiveObjects();
    canvas.discardActiveObject();
    objecs.forEach((item) => {
      let y = Infinity;
      for (const key in item.aCoords) {
        if (item.aCoords[key].y < y) {
          y = item.aCoords[key].y;
        }
      }
      item.set('top', 2 * item.top - y);
    });

    const sel = new fabric.ActiveSelection(objecs, {
      canvas: canvas,
    });
    canvas.setActiveObject(sel);
    canvas.requestRenderAll();
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default GroupAlignPlugin;
