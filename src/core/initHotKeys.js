/*
 * @Author: 秦少卫
 * @Date: 2022-12-07 23:50:05
 * @LastEditors: June
 * @LastEditTime: 2023-02-10 16:37:36
 * @Description: 快捷键功能
 */

import hotkeys from 'hotkeys-js';
// import { cloneDeep } from 'lodash-es';
import { v4 as uuid } from 'uuid';
import { Message } from 'view-design';

const keyNames = {
  lrdu: 'left,right,down,up', // 左右上下
  backspace: 'backspace', // backspace键盘
  ctrlz: 'ctrl+z',
  ctrlc: 'ctrl+c',
  ctrlv: 'ctrl+v',
};

function copyElement(canvas) {
  let copyEl = null;

  // 复制
  hotkeys(keyNames.ctrlc, () => {
    const activeObject = canvas.getActiveObjects();
    if (activeObject.length === 0) return;
    canvas.getActiveObject().clone((_copyEl) => {
      canvas.discardActiveObject();
      _copyEl.set({
        left: _copyEl.left + 20,
        top: _copyEl.top + 20,
        evented: true,
        id: uuid(),
      });
      copyEl = _copyEl;
      Message.success('复制成功');
    });
  });
  // 粘贴
  hotkeys(keyNames.ctrlv, () => {
    if (!copyEl) return Message.warning('暂无复制内容');
    canvas.add(copyEl);
    canvas.setActiveObject(copyEl);
  });
}

function initHotkeys(canvas) {
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
    if (activeObject) {
      switch (handler.key) {
        case 'left':
          activeObject.set('left', activeObject.left - 1);
          break;
        case 'right':
          activeObject.set('left', activeObject.left + 1);
          break;
        case 'down':
          activeObject.set('top', activeObject.top + 1);
          break;
        case 'up':
          activeObject.set('top', activeObject.top - 1);
          break;
        default:
      }
      canvas.renderAll();
    }
  });

  // 复制粘贴
  copyElement(canvas);
}

export default initHotkeys;
export { keyNames, hotkeys };
