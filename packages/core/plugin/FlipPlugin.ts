import { fabric } from 'fabric';
import type Editor from '../Editor';
import { SelectMode } from '../eventType';
// import { Ref } from 'vue';

// import { t } from '@/language/index';
const t = (key: string) => key;
// import event from '@/utils/event/notifier';

export default class FlipPlugin {
  public canvas: fabric.Canvas;
  public editor: Editor;
  static pluginName = 'FlipPlugin';
  static apis = ['flip'];
  constructor(canvas: fabric.Canvas, editor: Editor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  flip(type: 'X' | 'Y') {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      activeObject.set(`flip${type}`, !activeObject[`flip${type}`]).setCoords();
      this.canvas.requestRenderAll();
    }
  }

  contextMenu() {
    const selectedMode = this.editor.getSelectMode();
    if (selectedMode === SelectMode.ONE) {
      return [
        {
          text: '翻转',
          hotkey: '❯',
          subitems: [
            {
              text: t('flip.x'),
              hotkey: '|',
              onclick: () => this.flip('X'),
            },
            {
              text: t('flip.y'),
              hotkey: '-',
              onclick: () => this.flip('Y'),
            },
          ],
        },
      ];
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}
