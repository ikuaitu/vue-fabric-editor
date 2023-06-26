/*
 * @Author: 秦少卫
 * @Date: 2023-02-03 23:29:34
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-06-22 16:22:16
 * @Description: 核心入口文件
 */
import EventEmitter from 'events';
// import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';
import EditorCore from './core';
import TestPlugin from './plugin';
import DringPlugin from './plugin/DringPlugin';
import AlignGuidLinePlugin from './plugin/AlignGuidLinePlugin';
import ControlsPlugin from './plugin/ControlsPlugin';
import ControlsRotatePlugin from './plugin/ControlsRotatePlugin';
import CenterAlignPlugin from './plugin/CenterAlignPlugin';
import LayerPlugin from './plugin/LayerPlugin';
import CopyPlugin from './plugin/CopyPlugin';
import MoveHotKeyPlugin from './plugin/MoveHotKeyPlugin';
import DeleteHotKeyPlugin from './plugin/DeleteHotKeyPlugin';
import GroupPlugin from './plugin/GroupPlugin';
import DrawLinePlugin from './plugin/DrawLinePlugin';
import GroupTextEditorPlugin from './plugin/GroupTextEditorPlugin';
import GroupAlignPlugin from './plugin/GroupAlignPlugin';

// 对齐辅助线
// import initAligningGuidelines from '@/core/initAligningGuidelines';
// import initControlsRotate from '@/core/initControlsRotate';
// import InitCenterAlign from '@/core/initCenterAlign';
// import initHotkeys from '@/core/initHotKeys';
// import initControls from '@/core/initControls';
import initRuler from '@/core/ruler';
// import EditorGroupText from '@/core/EditorGroupText';
import type CanvasRuler from '@/core/ruler/ruler';
import EditorWorkspace from '@/core/EditorWorkspace';

import type { fabric } from 'fabric';

class Editor extends EventEmitter {
  canvas: fabric.Canvas;
  editorWorkspace: EditorWorkspace | null;
  // centerAlign: InitCenterAlign;
  ruler: CanvasRuler;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pluginEditor: any;
  constructor(canvas: fabric.Canvas) {
    super();

    this.canvas = canvas;
    this.editorWorkspace = null;

    // EditorCore
    this.pluginEditor = new EditorCore(canvas);
    this.pluginEditor.use(DringPlugin);
    this.pluginEditor.use(AlignGuidLinePlugin);
    this.pluginEditor.use(ControlsPlugin);
    this.pluginEditor.use(ControlsRotatePlugin);
    this.pluginEditor.use(CenterAlignPlugin);
    this.pluginEditor.use(LayerPlugin);
    this.pluginEditor.use(CopyPlugin);
    this.pluginEditor.use(MoveHotKeyPlugin);
    this.pluginEditor.use(DeleteHotKeyPlugin);
    this.pluginEditor.use(GroupPlugin);
    this.pluginEditor.use(DrawLinePlugin);
    this.pluginEditor.use(GroupTextEditorPlugin);
    this.pluginEditor.use(GroupAlignPlugin);

    this.ruler = initRuler(canvas);
  }

  // getWorkspace() {
  //   return this.canvas.getObjects().find((item) => item.id === 'workspace');
  // }

  getJson() {
    return this.canvas.toJSON(['id', 'gradientAngle', 'selectable', 'hasControls']);
  }

  /**
   * @description: 拖拽添加到画布
   * @param {Event} event
   * @param {Object} item
   */
  dragAddItem(event: DragEvent, item: fabric.Object) {
    const { left, top } = this.canvas.getSelectionElement().getBoundingClientRect();
    if (event.x < left || event.y < top || item.width === undefined) return;

    const point = {
      x: event.x - left,
      y: event.y - top,
    };
    const pointerVpt = this.canvas.restorePointerVpt(point);
    item.left = pointerVpt.x - item.width / 2;
    item.top = pointerVpt.y;
    this.canvas.add(item);
    this.canvas.requestRenderAll();
  }
}

export default Editor;
