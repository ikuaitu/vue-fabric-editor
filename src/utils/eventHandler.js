/*
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-09 13:17:11
 * @Description: 自定义事件
 */

import EventEmitter from 'events';
import { fabric } from 'fabric';

class EventHandle extends EventEmitter {
  init(handler) {
    this.handler = handler;
    this.handler.on('selection:created', (e) => this._selected(e));
    this.handler.on('selection:updated', (e) => this._selected(e));
    this.handler.on('selection:cleared', (e) => this._selected(e));
  }

  // 暴露单选多选事件
  _selected() {
    const actives = this.handler.getActiveObjects().filter((item) => {
      // 过滤掉辅助线
      if (item instanceof fabric.GuideLine) {
        return false;
      }
      return true;
    });
    if (actives && actives.length === 1) {
      this.emit('selectOne', actives);
    } else if (actives && actives.length > 1) {
      this.mSelectMode = 'multiple';
      this.emit('selectMultiple', actives);
    } else {
      this.emit('selectCancel');
    }
  }
}

export default EventHandle;
