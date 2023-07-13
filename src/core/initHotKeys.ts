/*
 * @Author: 秦少卫
 * @Date: 2022-12-07 23:50:05
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-06-04 10:42:02
 * @Description: 快捷键功能
 */

import hotkeys from 'hotkeys-js';
// import { cloneDeep } from 'lodash-es';
// import { v4 as uuid } from 'uuid';
// import { Message } from 'view-design';
import vfe from 'vfe';
import type { fabric } from 'fabric';

const keyNames = {
  lrdu: 'left,right,down,up', // 左右上下
  backspace: 'backspace', // backspace键盘
  ctrlz: 'ctrl+z',
  ctrlc: 'ctrl+c',
  ctrlv: 'ctrl+v',
};

function copyElement(editor: vfe.ICanvas, canvas: fabric.Canvas) {
  let copyEl: fabric.ActiveSelection | fabric.Object | null;

  // 复制
  hotkeys(keyNames.ctrlc, () => {
    const activeObject = canvas.getActiveObject();
    copyEl = activeObject;
  });
  // 粘贴
  hotkeys(keyNames.ctrlv, () => {
    if (copyEl) {
      editor.clone(copyEl);
    }
  });
}

function initHotkeys(canvas: fabric.Canvas, editor: vfe.ICanvas) {
  // 删除快捷键
  hotkeys(keyNames.backspace, () => {
    const activeObject = canvas.getActiveObjects();
    if (activeObject) {
      activeObject.map((item) => canvas.remove(item));
      canvas.requestRenderAll();
      canvas.discardActiveObject();
    }
  });

  // 移动快捷键
  hotkeys(keyNames.lrdu, (event, handler) => {
    const activeObject = canvas.getActiveObject();
    if (!activeObject) return;
    switch (handler.key) {
      case 'left':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left - 1);
        break;
      case 'right':
        if (activeObject.left === undefined) return;
        activeObject.set('left', activeObject.left + 1);
        break;
      case 'down':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top + 1);
        break;
      case 'up':
        if (activeObject.top === undefined) return;
        activeObject.set('top', activeObject.top - 1);
        break;
      default:
    }
    canvas.renderAll();
  });

  // 复制粘贴
  copyElement(editor, canvas);
}

export default initHotkeys;
export { keyNames, hotkeys };
