import { fabric } from 'fabric';
import type { IEditor, IPluginTempl } from '@kuaitu/core';
import 'fabric-eraser-brush';
type IPlugin = Pick<EarsePlugin, 'erase' | 'undoErasing' | 'select'>;

declare module '@kuaitu/core' {
  type IEditor = IPlugin;
}

class EarsePlugin implements IPluginTempl {
  static pluginName = 'EarsePlugin';
  static apis = ['erase', 'undoErasing', 'select'];
  public hotkeys: string[] = ['e', 'q', 's'];
  static events = ['modeEvent'];
  constructor(
    public canvas: fabric.Canvas,
    public editor: IEditor & { emit: (eventName: string, data: any) => void }
  ) {
    this._init();
  }

  _init() {
    const workspace = this.editor.getWorkspase();
    workspace.set({ erasable: false } as any);
    this.canvas.freeDrawingBrush = new fabric.EraserBrush(this.canvas);
    this.canvas.freeDrawingBrush.width = 20; // 画笔宽度
  }
  select() {
    this.canvas.isDrawingMode = false;
  }
  erase() {
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.inverted = false; // 复原擦除
  }
  undoErasing() {
    this.canvas.isDrawingMode = true;
    this.canvas.freeDrawingBrush.inverted = true; // 复原擦除
  }
  // 快捷键扩展回调
  hotkeyEvent(eventName: string, e: KeyboardEvent) {
    // 擦除功能
    if (eventName === 'e' && e.type === 'keydown') {
      this.erase();
      this.editor.emit('modeEvent', 'earse');
    } else if (eventName === 'q' && e.type === 'keydown') {
      //复原功能
      this.undoErasing();
      this.editor.emit('modeEvent', 'undoEarse');
    } else if (eventName === 's' && e.type === 'keydown') {
      // 框选功能
      this.select();
      this.editor.emit('modeEvent', 'select');
    }
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default EarsePlugin;
