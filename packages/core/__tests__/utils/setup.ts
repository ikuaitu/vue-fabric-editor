import Editor from '../../Editor.ts';
import { fabric } from 'fabric';

export function createEditor() {
  const editor = new Editor();
  const canvasElement = document.createElement('canvas');
  canvasElement.id = 'canvas';
  const canvas = new fabric.Canvas('canvas', {
    fireRightClick: true,
    stopContextMenu: true,
    controlsAboveOverlay: true,
    imageSmoothingEnabled: false,
    preserveObjectStacking: true,
  });
  editor.init(canvas);
  window.editor = editor;

  return {
    cleanUp: editor.destory(),
  };
}
