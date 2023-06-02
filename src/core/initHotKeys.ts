/*
 * @Author: 秦少卫
 * @Date: 2022-12-07 23:50:05
 * @LastEditors: bamzc
 * @LastEditTime: 2023-06-02 16:56:50
 * @Description: 快捷键功能
 */

import hotkeys from 'hotkeys-js';
// import { cloneDeep } from 'lodash-es';
import { v4 as uuid } from 'uuid';
// import { Message } from 'view-design';

import type { fabric } from 'fabric';

const keyNames = {
  lrdu: 'left,right,down,up', // 左右上下
  backspace: 'backspace', // backspace键盘
  ctrlz: 'ctrl+z',
  ctrlc: 'ctrl+c',
  ctrlv: 'ctrl+v',
};

function copyElement(editor: any, canvas: fabric.Canvas) {
  let copyEl: fabric.Object | null = null;

  // 复制
  hotkeys(keyNames.ctrlc, () => {
    const activeObject = canvas.getActiveObjects();
    if (activeObject.length === 0) return;
    editor.copyObj((_copyEl: fabric.Object) => {
      copyEl = _copyEl;
    });
  });
  // 粘贴
  hotkeys(keyNames.ctrlv, () => {
    // if (!copyEl) return Message.warning('暂无复制内容');
    if (copyEl) {
      editor.pasteObj(copyEl);
    }
  });
}

function initHotkeys(editor: any, canvas: fabric.Canvas) {
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
