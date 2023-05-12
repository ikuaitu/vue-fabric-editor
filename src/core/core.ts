import EventEmitter from 'events';
import hotkeys from 'hotkeys-js';

class Editor extends EventEmitter {
  canvas: fabric.Canvas;
  pluginMap: Object = {};
  constructor(canvas: fabric.Canvas) {
    super();
    this.canvas = canvas;
  }

  bedingHookeys() {
    hotkeys('', () => {
      console.log(1);
    });
  }

  use(plugin) {
    console.log(111, plugin);
  }
}

export default Editor;
