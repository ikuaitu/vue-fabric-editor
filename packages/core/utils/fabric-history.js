/*
 * @Author: 秦少卫
 * @Date: 2024-07-09 13:46:14
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-07-12 21:36:51
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
  this.historyUndo = [];
  this.historyRedo = [];
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
    this.historyUndo.push(json);
    this.historyNextState = this._historyNext();
    this.fire('history:append', { json: json });
  }
};

/**
 * Undo to latest history.
 * Pop the latest state of the history. Re-render.
 * Also, pushes into redo history.
 */
fabric.Canvas.prototype.undo = function (callback) {
  // The undo process will render the new states of the objects
  // Therefore, object:added and object:modified events will triggered again
  // To ignore those events, we are setting a flag.
  this.historyProcessing = true;

  const history = this.historyUndo.pop();
  if (history) {
    // Push the current state to the redo history
    this.historyRedo.push(this._historyNext());
    this.historyNextState = history;
    this._loadHistory(history, 'history:undo', callback);
  } else {
    console.log(1111);
    this.historyProcessing = false;
  }
};

/**
 * Redo to latest undo history.
 */
fabric.Canvas.prototype.redo = function (callback) {
  // The undo process will render the new states of the objects
  // Therefore, object:added and object:modified events will triggered again
  // To ignore those events, we are setting a flag.
  this.historyProcessing = true;
  const history = this.historyRedo.pop();
  if (history) {
    // Every redo action is actually a new action to the undo history
    this.historyUndo.push(this._historyNext());
    this.historyNextState = history;
    this._loadHistory(history, 'history:redo', callback);
  } else {
    this.historyProcessing = false;
  }
};

fabric.Canvas.prototype._loadHistory = function (history, event, callback) {
  var that = this;

  this.loadFromJSON(history, function () {
    that.renderAll();
    that.fire(event);
    that.historyProcessing = false;

    if (callback && typeof callback === 'function') callback();
  });
};

/**
 * Clear undo and redo history stacks
 */
fabric.Canvas.prototype.clearHistory = function (type) {
  if (!type) {
    this.historyUndo = [];
    this.historyRedo = [];
    this.fire('history:clear');
  } else {
    const one = this.historyUndo.pop();
    this.historyUndo = [one];
    this.historyRedo = [];
    this.fire('history:clear');
  }
};

fabric.Canvas.prototype.clearUndo = function () {
  this.historyUndo = [];
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
  return this.historyUndo.length > 0;
};

/**
 * Check if there are actions that can be redone
 */
fabric.Canvas.prototype.canRedo = function () {
  return this.historyRedo.length > 0;
};

/**
 * Off the history
 */
fabric.Canvas.prototype.offHistory = function () {
  this.historyProcessing = true;
};
