import Editor from '../Editor';

declare global {
  interface Window {
    editor: Editor;
  }

  type ExtCanvas = fabric.Canvas & {
    isDragging: boolean;
    lastPosX: number;
    lastPosY: number;
  };
}
