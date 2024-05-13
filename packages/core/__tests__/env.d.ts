import Editor from '../Editor';

declare global {
  interface Window {
    editor: Editor;
  }
}
