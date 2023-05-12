interface IPluginTempl {
  name: string;
  init: () => void;
  canvas: fabric.Canvas;
}

class PluginTmpl implements IPluginTempl {
  public name = '';
  public canvas: fabric.Canvas;
  constructor(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this.init();
  }
  init() {
    console.log('initPlugin' + this.name);
  }
}
class EditorWorkspace extends PluginTmpl implements IPluginTempl {
  init() {
    console.log(1111);
  }
  hooksApi() {
    console.log(111);
  }
}

export default EditorWorkspace;
