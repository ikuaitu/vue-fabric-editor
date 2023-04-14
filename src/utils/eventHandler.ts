/*
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-09 13:17:11
 * @Description: 自定义事件
 */

import EventEmitter from 'events';
import { Canvas, GuideLine } from 'fabric/fabric-impl';

// 自定义事件
export enum CustomEvent {
  SELECT_ONE = 'selectOne',
  SELECT_MULTI = 'selectMultiple',
  SELECT_CANCEL = 'selectCancel',
}

/**
 * 发布订阅器
 */
class CanvasEventEmitter extends EventEmitter {
  handler: Canvas | undefined;
  mSelectMode = '';

  init(handler: CanvasEventEmitter['handler']) {
    this.handler = handler;
    if (this.handler) {
      this.handler.on('selection:created', () => this.selected());
      this.handler.on('selection:updated', () => this.selected());
      this.handler.on('selection:cleared', () => this.selected());
    }
  }

  /**
   * 暴露单选多选事件
   * @private
   */
  private selected() {
    if (!this.handler) {
      throw TypeError('还未初始化');
    }

    const actives = this.handler.getActiveObjects().filter((item) => !(item instanceof GuideLine)); // 过滤掉辅助线
    if (actives && actives.length === 1) {
      this.emit(CustomEvent.SELECT_ONE, actives);
    } else if (actives && actives.length > 1) {
      this.mSelectMode = 'multiple';
      this.emit(CustomEvent.SELECT_MULTI, actives);
    } else {
      this.emit(CustomEvent.SELECT_CANCEL);
    }
  }
}

export default CanvasEventEmitter;
