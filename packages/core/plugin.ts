import Editor from './core';
type IEditor = Editor;

class EditorWorkspacePlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  public defautOption = {
    color: 'red',
    size: 0.5,
  };
  static pluginName = 'textPlugin';
  static events = ['textEvent1', 'textEvent2'];
  static apis = ['textAPI1', 'textAPI2'];
  public hotkeys: string[] = ['ctrl+v', 'ctrl+a'];
  constructor(canvas: fabric.Canvas, editor: IEditor, options: IPluginOption = {}) {
    this.canvas = canvas;
    this.editor = editor;
    this.defautOption = { ...this.defautOption, ...options };
    this.init();
  }
  init() {
    console.log('pluginInit', this.canvas, this.editor, this.defautOption);
  }

  destroy() {
    console.log('pluginDestroy');
  }
  // 保存文件前
  hookSaveBefore() {
    console.log('pluginHookSaveBefore');
  }
  // 保存文件前
  hookSaveAfter() {
    console.log('pluginHookSaveAfter');
  }
  // 快捷键扩展回调
  hotkeyEvent(eventName: string, e?: Event) {
    console.log('pluginHotkeyEvent', eventName, e);
  }
  // 右键菜单扩展
  contextMenu() {
    return [
      { text: 'Back', hotkey: 'Alt+Left arrow', disabled: true },
      { text: 'Forward', hotkey: 'Alt+Right arrow', disabled: true },
      { text: 'Reload', hotkey: 'Ctrl+R' },
      null,
      { text: 'Save as...', hotkey: 'Ctrl+S' },
      { text: 'Print...', hotkey: 'Ctrl+P' },
      { text: 'Cast...' },
      { text: 'Translate to English' },
      null,
      { text: 'View page source', hotkey: 'Ctrl+U' },
      { text: 'Inspect', hotkey: 'Ctrl+Shift+I' },
      null,
      {
        text: 'Kali tools',
        hotkey: '❯',
        subitems: [
          {
            text: 'Fuzzing Tools',
            hotkey: '❯',
            subitems: [
              { text: 'spike-generic_chunked' },
              { text: 'spike-generic_listen_tcp' },
              { text: 'spike-generic_send_tcp' },
              { text: 'spike-generic_send_udp' },
            ],
          },
          {
            text: 'VoIP Tools',
            hotkey: '❯',
            subitems: [{ text: 'voiphopper' }],
          },
          { text: 'nikto' },
          { text: 'nmap' },
          { text: 'sparta' },
          { text: 'unix-privesc-check' },
        ],
      },
      { text: 'Skins', hotkey: '❯' },
    ];
  }

  _command() {
    console.log('pluginContextMenuCommand');
  }
}

export default EditorWorkspacePlugin;
