import Editor from '../../core/Editor.ts';
import { fabric } from 'fabric';

export function createEditor() {
  const editor = new Editor();
  const canvas = new fabric.Canvas('canvas', {
    fireRightClick: true,
    stopContextMenu: true,
    controlsAboveOverlay: true,
    imageSmoothingEnabled: false,
    preserveObjectStacking: true,
  });
  editor.init(canvas);
  return {
    editor: editor,
    cleanUp: editor.destory(),
  };
}
