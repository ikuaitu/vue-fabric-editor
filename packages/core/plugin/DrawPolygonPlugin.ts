import { fabric } from 'fabric';
import Editor from '../Editor';
import { v4 as uuid } from 'uuid';

type IEditor = Editor;

type LineCoords = [fabric.Point, fabric.Point];

class DrawPolygonPlugin {
  polygon: fabric.Polygon | null = null;
  isDrawingPolygon = false;
  points: fabric.Point[] = [];
  lines: fabric.Line[] = [];
  tempPoint: fabric.Point | undefined;
  tempLine: fabric.Line | undefined;
  lastPoint: fabric.Point | undefined;
  static pluginName = 'DrawPolygonPlugin';
  static apis = ['beginDrawPolygon', 'endDrawPolygon'];
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {
    this.init();
  }
  init() {
    this.canvas.on('mouse:down', (ev) => {
      if (!this.isDrawingPolygon) return;
      const absPointer = ev.absolutePointer!;
      const confirmPoint = new fabric.Point(absPointer.x, absPointer.y);
      if (this.tempPoint == null) {
        this.tempPoint = new fabric.Point(absPointer.x, absPointer.y);
      }
      if (this.lastPoint) {
        const line = this._makeLine([this.lastPoint, confirmPoint]);
        this.lines.push(line);
        this.canvas.add(line);
        if (this.points[0].distanceFrom(confirmPoint) <= 3) {
          console.info('finished');
          const poly = this._createPolygon();
          this.canvas.add(poly);
          this.lines.forEach((item) => {
            this.canvas.remove(item);
          });
          this.lines.length = 0;
          this.isDrawingPolygon = false;
          this.lastPoint = undefined;
          this.tempPoint = undefined;
          return;
        }
      }
      this.lastPoint = confirmPoint;
      this.points.push(confirmPoint);
    });
    // this.canvas.on('mouse:move', (ev) => {
    //   if (!this.isDrawingPolygon) return;
    //   const absPointer = ev.absolutePointer!;
    //   this.tempPoint?.setXY(absPointer.x, absPointer.y);
    // });
  }
  _createPolygon() {
    return new fabric.Polygon([...this.points], {
      fill: '#ccc',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      id: uuid(),
      objectCaching: false,
    });
  }
  _makeLine(coors: LineCoords) {
    const [p1, p2] = coors;
    return new fabric.Line([p1.x, p1.y, p2.x, p2.y], {
      fill: '#000',
      stroke: '#000',
      strokeWidth: 1,
      selectable: false,
      evented: false,
    });
  }
  beginDrawPolygon() {
    this.canvas.discardActiveObject();
    this.canvas.getObjects().forEach((obj) => {
      obj.selectable = false;
      obj.hasControls = false;
    });
    this.canvas.requestRenderAll();
    this.isDrawingPolygon = true;
    this.pointIndex = 0;
  }
  endDrawPolygon() {
    if (this.polygon == null) return;
    if (this.points.length < 3) {
      this.canvas.remove(this.polygon);
    } else {
      this.polygon.set({
        selectable: true,
        evented: true,
        strokeUniform: false,
      });
    }
    this.polygon.setCoords();
    this.canvas.discardActiveObject();
    this.isDrawingPolygon = false;
    this.polygon = null;
    this.pointIndex = -1;
  }
}

export default DrawPolygonPlugin;
