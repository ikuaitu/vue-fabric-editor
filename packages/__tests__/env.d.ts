import Editor from '@kuaitu/core';

declare global {
  interface Window {
    editor: Editor;
  }
}
