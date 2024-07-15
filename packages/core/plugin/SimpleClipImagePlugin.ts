import { fabric } from 'fabric';
import Editor from '../Editor';
import { getPolygonVertices } from '../../../src/utils/math';
import { get, set } from 'lodash-es';
type IEditor = Editor;

const getBounds = (activeObject: fabric.Object) => {
  const { left = 0, top = 0 } = activeObject;
  return {
    width: activeObject.getScaledWidth(),
    height: activeObject.getScaledHeight(),
    left,
    top,
  };
};
const bindInfo = (shell: fabric.Object, activeObject: fabric.Object) => {
  bindFlagToObject(shell);
  bindFlagToObject(shell, 'targetId', get(activeObject, 'id'));
  bindFlagToObject(shell, 'targetType', get(activeObject, 'type'));
};
const bindFlagToObject = (activeObject: fabric.Object, key = 'clip', value: any = true) => {
  set(activeObject, key, value);
};
const createRectClip = (activeObject: fabric.Object, inverted: boolean) => {
  const { width = 0, height = 0, left = 0, top = 0 } = getBounds(activeObject);
  const clipW = Math.round(width / 2);
  const clipH = Math.round(height / 2);
  const shell = new fabric.Rect({
    width: clipW,
    height: clipH,
    fill: 'rgba(0,0,0,0)',
    originX: 'center',
    originY: 'center',
    left: left + width / 2,
    top: top + height / 2,
  });
  bindInfo(shell, activeObject);
  const clipPath = new fabric.Rect({
    absolutePositioned: true,
    width: shell.width,
    height: shell.height,
    originX: 'center',
    originY: 'center',
    left: shell.left,
    top: shell.top,
    inverted: inverted,
  });
  return { clipPath, shell };
};
const createCircleClip = (activeObject: fabric.Object, inverted: boolean) => {
  const point = activeObject.getCenterPoint();
  const { width } = getBounds(activeObject);
  const shell = new fabric.Ellipse({
    fill: 'rgba(0,0,0,0)',
    originX: 'center',
    originY: 'center',
    left: point.x,
    top: point.y,
    rx: width / 4,
    ry: width / 4,
  });
  bindInfo(shell, activeObject);
  const clipPath = new fabric.Ellipse({
    absolutePositioned: true,
    originX: 'center',
    originY: 'center',
    left: shell.left,
    top: shell.top,
    inverted: inverted,
    rx: shell.rx,
    ry: shell.ry,
  });
  return { shell, clipPath };
};
const createTriClip = (activeObject: fabric.Object, inverted: boolean) => {
  const point = activeObject.getCenterPoint();
  const { width = 0, height = 0 } = getBounds(activeObject);
  const clipW = Math.round(width / 2);
  const clipH = Math.round(height / 2);
  const shell = new fabric.Triangle({
    fill: 'rgba(0,0,0,0)',
    originX: 'center',
    originY: 'center',
    left: point.x,
    top: point.y,
    width: clipW,
    height: clipH,
  });
  bindInfo(shell, activeObject);
  const clipPath = new fabric.Triangle({
    absolutePositioned: true,
    originX: 'center',
    originY: 'center',
    left: shell.left,
    top: shell.top,
    width: shell.width,
    height: shell.height,
    inverted: inverted,
  });
  return { shell, clipPath };
};
const createPolygonClip = (activeObject: fabric.Object, inverted: boolean) => {
  const point = activeObject.getCenterPoint();
  const points = getPolygonVertices(5, 200);
  const shell = new fabric.Polygon(points, {
    fill: 'rgba(0,0,0,0)',
    originY: 'center',
    originX: 'center',
    left: point.x,
    top: point.y,
  });
  bindInfo(shell, activeObject);
  const clipPath = new fabric.Polygon([...points], {
    absolutePositioned: true,
    originX: 'center',
    originY: 'center',
    left: shell.left,
    top: shell.top,
    inverted: inverted,
  });
  return { shell, clipPath };
};
export default class SimpleClipImagePlugin implements IPluginTempl {
  static pluginName = 'SimpleClipImagePlugin';
  //  static events = ['sizeChange'];
  static apis = ['addClipPathToImage', 'removeClip'];
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {}
  addClipPathToImage(value: string) {
    const activeObject = this.canvas.getActiveObjects()[0];
    if (activeObject && activeObject.type === 'image') {
      let clip: { shell: fabric.Object; clipPath: fabric.Object } | null = null;
      const [name, inverted] = value.split('-');
      const isInverted = !!inverted;
      switch (name) {
        case 'polygon':
          clip = createPolygonClip(activeObject, isInverted);
          break;
        case 'rect':
          clip = createRectClip(activeObject, isInverted);
          break;
        case 'circle':
          clip = createCircleClip(activeObject, isInverted);
          break;
        case 'triangle':
          clip = createTriClip(activeObject, isInverted);
          break;
      }
      if (clip == null) return;
      const { shell, clipPath } = clip;
      shell.on('moving', () => {
        clipPath.setPositionByOrigin(shell.getCenterPoint(), 'center', 'center');
        activeObject.set('dirty', true);
      });
      shell.on('rotating', () => {
        clipPath.set({ angle: shell.angle });
        activeObject.set('dirty', true);
      });
      shell.on('scaling', () => {
        clipPath.set({ scaleX: shell.scaleX, scaleY: shell.scaleY });
        clipPath.setPositionByOrigin(shell.getCenterPoint(), 'center', 'center');
        activeObject.set('dirty', true);
      });
      shell.on('deselected', () => {
        if (clipPath instanceof fabric.Ellipse && shell instanceof fabric.Ellipse) {
          clipPath.set({ rx: shell.getRx(), ry: shell.getRy() });
          this.correctPosition(activeObject, shell, clipPath);
        } else if (shell instanceof fabric.Polygon) {
          this.correctPosition(activeObject, shell, clipPath);
          const { scaleX: cSx = 1, scaleY: cSy = 1 } = clipPath;
          const { scaleX: sSx = 1, scaleY: sSy = 1 } = shell;
          clipPath.set('scaleX', cSx * sSx);
          clipPath.set('scaleY', cSy * sSy);
        } else {
          this.correctPosition(activeObject, shell, clipPath);
          clipPath.set('width', shell.getScaledWidth());
          clipPath.set('height', shell.getScaledHeight());
        }
        activeObject.set('dirty', true);
        this.canvas.remove(shell);
        this.canvas.requestRenderAll();
      });
      activeObject.set({ clipPath: clipPath });
      this.canvas.add(shell);
      this.canvas.setActiveObject(shell);
    }
  }
  correctPosition(activeObject: fabric.Object, shell: fabric.Object, clipPath: fabric.Object) {
    const position = activeObject.toLocalPoint(shell.getCenterPoint(), 'center', 'center');
    const { scaleX = 1, scaleY = 1 } = activeObject;
    clipPath.set({
      absolutePositioned: false,
      left: position.x / scaleX,
      top: position.y / scaleY,
      scaleX: 1 / scaleX,
      scaleY: 1 / scaleY,
    });
  }
  removeClip() {
    const activeObject = this.canvas.getActiveObjects()[0];
    if (activeObject && activeObject.type === 'image') {
      activeObject.set({ clipPath: undefined });
      activeObject.set('dirty', true);
      this.canvas.requestRenderAll();
    }
  }
}
