/*
 * @Author: 秦少卫
 * @Date: 2024-07-09 13:46:14
 * @LastEditors: George GeorgeSmith163@163.com
 * @LastEditTime: 2024-10-14 16:16:16
 * @Description: file content
 */
/**
 * Override the initialize function for the _historyInit();
 */
import { fabric } from 'fabric';

fabric.Canvas.prototype.initialize = (function (originalFn) {
  return function (...args) {
    originalFn.call(this, ...args);
    this._historyInit();
    return this;
  };
})(fabric.Canvas.prototype.initialize);

/**
 * Override the dispose function for the _historyDispose();
 */
fabric.Canvas.prototype.dispose = (function (originalFn) {
  return function (...args) {
    originalFn.call(this, ...args);
    this._historyDispose();
    return this;
  };
})(fabric.Canvas.prototype.dispose);

/**
 * Returns current state of the string of the canvas
 */
fabric.Canvas.prototype._historyNext = function () {
  return JSON.stringify(this.toDatalessJSON(this.extraProps));
};

/**
 * Returns an object with fabricjs event mappings
 */
fabric.Canvas.prototype._historyEvents = function () {
  return {
    'object:added': (e) => this._historySaveAction(e),
    'object:removed': (e) => this._historySaveAction(e),
    'object:modified': (e) => this._historySaveAction(e),
    'object:skewing': (e) => this._historySaveAction(e),
  };
};

/**
 * Initialization of the plugin
 */
fabric.Canvas.prototype._historyInit = function () {
  this.historyStack = [];
  this.historyIndex = 0;
  this.historyMaxLength = 100;
  this.extraProps = [
    'id',
    'gradientAngle',
    'selectable',
    'hasControls',
    'linkData',
    'editable',
    'extensionType',
    'extension',
  ];
  this.historyNextState = this._historyNext();
  // 需要两次操作的标记，为true时表示当前操作记录为最新记录，需要撤销两步，因为最顶层的是当前的最新记录，undo一次后后置为false
  this.isLatestHistoryState = true;
  // 正在读取历史记录的标记，为 true 时不允许 undo/redo
  this.isLoadingHistory = false;

  this.on(this._historyEvents());
};

/**
 * Remove the custom event listeners
 */
fabric.Canvas.prototype._historyDispose = function () {
  this.off(this._historyEvents());
};

/**
 * It pushes the state of the canvas into history stack
 */
fabric.Canvas.prototype._historySaveAction = function (e) {
  if (this.historyProcessing) return;
  if (!e || (e.target && !e.target.excludeFromExport)) {
    const json = this._historyNext();
    // 当前操作记录非最新记录，更新记录前需要校正历史索引，不然会丢失一个记录（undo时撤销了两次记录）。理论上不会超出历史记录上限，不过还是加了限制
    !this.isLatestHistoryState &&
      (this.isLatestHistoryState = true) &&
      this.historyIndex < this.historyMaxLength &&
      this.historyIndex++;
    // 每次的最新操作都要清空历史索引之后的记录，防止redo旧记录，不然可能会redo之前某个阶段的操作记录
    this.historyStack.length > this.historyIndex && this.historyStack.splice(this.historyIndex);
    // 最多保存 historyMaxLength 条记录
    if (this.historyIndex >= this.historyMaxLength) this.historyStack.shift();
    this.historyIndex < this.historyMaxLength && this.historyIndex++;
    this.historyStack.push(json);
    this.historyNextState = this._historyNext();
    this.fire('history:append', { json });
  }
};

/**
 * Undo to latest history.
 * Pop the latest state of the history. Re-render.
 * Also, pushes into redo history.
 */
fabric.Canvas.prototype.undo = function (callback) {
  if (this.isLoadingHistory) return;
  if (this.historyIndex <= 0) return;
  // The undo process will render the new states of the objects
  // Therefore, object:added and object:modified events will triggered again
  // To ignore those events, we are setting a flag.
  this.historyProcessing = true;

  // 当前操作记录为最新记录，需要撤销两步，因为最顶层的是当前的最新记录
  this.isLatestHistoryState && this.historyIndex-- && (this.isLatestHistoryState = false);
  const history = this.historyStack[--this.historyIndex];
  if (history) {
    // Push the current state to the redo history
    this.historyNextState = history;
    this._loadHistory(history, 'history:undo', callback);
  } else {
    console.log(1111);
    this.historyIndex < 0 && (this.historyIndex = 0);
    this.historyProcessing = false;
  }
};

/**
 * Redo to latest undo history.
 */
fabric.Canvas.prototype.redo = function (callback) {
  if (this.isLoadingHistory) return;
  if (this.historyIndex >= this.historyStack.length) return;
  // The undo process will render the new states of the objects
  // Therefore, object:added and object:modified events will triggered again
  // To ignore those events, we are setting a flag.
  this.historyProcessing = true;
  // 当前操作记录不是最新记录（被撤销过），需要恢复两步，抵消最初撤销时撤销两步的操作
  !this.isLatestHistoryState && ++this.historyIndex && (this.isLatestHistoryState = true);
  const history = this.historyStack[this.historyIndex];
  if (history) {
    // Every redo action is actually a new action to the undo history
    this.historyNextState = history;
    this._loadHistory(history, 'history:redo', callback);
    this.historyIndex++;
  } else {
    this.historyProcessing = false;
  }
};

// loadFromJSON 是异步操作，所以通过 isLoadingHistory = true 表示历史读取中，不可 undo/redo，
// 不然当页面复杂且快速 undo/redo 多次后，可能会在之前的历史上 redo/undo
fabric.Canvas.prototype._loadHistory = function (history, event, callback) {
  this.isLoadingHistory = true;
  var that = this;

  // 需要把历史记录中的 workspace 的 evented 属性设置为 false，否则会导致历史记录恢复后，鼠标悬浮 workspace 出现可操作的样式
  const workspaceHistory = history.objects?.find((item) => item.id === 'workspace');
  workspaceHistory && (workspaceHistory.evented = false);

  this.loadFromJSON(history, function () {
    that.renderAll();
    that.fire(event);
    that.historyProcessing = false;
    that.isLoadingHistory = false;

    if (callback && typeof callback === 'function') callback();
  });
};

/**
 * Clear undo and redo history stacks
 */
fabric.Canvas.prototype.clearHistory = function (type) {
  const one = this.historyStack.pop();
  if (!type || !one) {
    this.historyStack = [];
    this.historyIndex = 0;
    this.fire('history:clear');
  } else {
    this.historyStack = [one];
    this.historyIndex = 1;
    this.fire('history:clear');
  }
  this.isLatestHistoryState = true;
};

fabric.Canvas.prototype.clearUndo = function () {
  this.historyStack.splice(this.historyIndex);
};

// 如果在做一些操作之后，需要撤销上一步的操作并刷新历史记录（想在监听modified事件后做些额外的操作并记录操作后的历史），可以调用这个方法
fabric.Canvas.prototype.refreshHistory = function () {
  this.historyProcessing = false;
  this.historyStack.splice(--this.historyIndex);
  this._historySaveAction();
};

/**
 * On the history
 */
fabric.Canvas.prototype.onHistory = function () {
  this.historyProcessing = false;

  this._historySaveAction();
};

/**
 * Check if there are actions that can be undone
 */

fabric.Canvas.prototype.canUndo = function () {
  return this.historyIndex > 0;
};

/**
 * Check if there are actions that can be redone
 */
fabric.Canvas.prototype.canRedo = function () {
  return this.historyStack.length > this.historyIndex;
};

/**
 * Off the history
 */
fabric.Canvas.prototype.offHistory = function () {
  this.historyProcessing = true;
};
