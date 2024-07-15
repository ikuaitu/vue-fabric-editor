import Editor from './Editor';
type IEditor = Editor;

class FontPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  // 插件名称
  static pluginName = 'FontPlugin';
  // 挂载API名称
  static apis = ['downFontByJSON'];
  // 发布事件
  static events = ['textEvent1', 'textEvent2'];
  // 快捷键 keyCode hotkeys-js
  public hotkeys: string[] = ['backspace', 'space'];
  // 私有属性
  repoSrc: string;

  constructor(canvas: fabric.Canvas, editor: IEditor, config: { repoSrc: string }) {
    // 初始化
    this.canvas = canvas;
    this.editor = editor;
    // 可插入外部配置
    this.repoSrc = config.repoSrc;
  }

  // 钩子函数 hookImportAfter/hookSaveBefore/hookSaveAfter Promise
  hookImportBefore(json: string) {
    return this.downFontByJSON(json);
  }

  // 挂载API方法
  downFontByJSON() {
    //
  }

  // 私有方法 + 发布事件
  _createFontCSS() {
    const params = [];
    this.editor.emit('textEvent1', params);
  }

  // 右键菜单
  contextMenu() {
    const selectedMode = this.editor.getSelectMode();
    if (selectedMode === SelectMode.ONE) {
      return [
        null, // 分割线
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

  // 快捷键
  hotkeyEvent(eventName: string, { type }: KeyboardEvent) {
    // eventName：hotkeys中的属性 backspace、space
    // type：keyUp keyDown
    // code：hotkeys-js Code
    if (eventName === 'backspace' && type === 'keydown') {
      this.del();
    }
  }

  // 注销
  destroy() {
    console.log('pluginDestroy');
  }
}

export default FontPlugin;
