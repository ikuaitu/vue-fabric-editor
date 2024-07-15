/*
 * @Author: June 1601745371@qq.com
 * @Date: 2024-06-19 10:30:25
 * @LastEditors: June 1601745371@qq.com
 * @LastEditTime: 2024-06-19 11:48:12
 * @FilePath: \vue-fabric-editor\packages\core\plugin\ImageStroke.ts
 * @Description: 图像描边
 */
import { fabric } from 'fabric';
import Editor from '../Editor';

type IEditor = Editor;
type IStrokeOps = {
  enabled: boolean;
  width: number;
  color: string;
  type: 'destination-out' | 'source-over' | 'source-in';
};
interface IExtendImage {
  [x: string]: any;
  originWidth?: number;
  originHeight?: number;
  originSrc?: string;
}
class ImageStrokePlugin implements IPluginTempl {
  static pluginName = 'ImageStroke';
  static apis = ['imageStrokeDraw'];
  //   public options: Required<IStrokeOps>;
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {
    // this.options = Object.assign(
    //   {
    //     enabled: false,
    //     width: 5,
    //     color: '#000',
    //     type: 'source-over',
    //   },
    //   _options
    // );
  }

  private addImage(src: string): Promise<HTMLImageElement | undefined> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject();
      img.src = src;
    });
  }

  //   imageStrokeEnable() {
  //     this.options.enabled = true;
  //   }

  //   imageStrokeDisable() {
  //     this.options.enabled = false;
  //   }

  //   imageStrokeSet(key: 'enabled' | 'width' | 'color' | 'type', val: any) {
  //     this.options[key] = val;
  //   }

  async imageStrokeDraw(stroke: string, strokeWidth: number, type = 'source-over') {
    const activeObject = this.canvas.getActiveObject() as (fabric.Image & IExtendImage) | undefined;
    if (!activeObject) return;
    const w = activeObject.originWidth || 0,
      h = activeObject.originHeight || 0,
      src = activeObject?.originSrc || activeObject.getSrc();
    let canvas: HTMLCanvasElement | null = document.createElement('canvas');
    const ctx = canvas!.getContext('2d');
    if (!ctx) return;
    // 描边等于0 说明关闭了开关或者不需要描边  直接从原图绘制
    if (strokeWidth === 0) {
      activeObject.setSrc(src, () => {
        activeObject.canvas?.renderAll();
      });
      return;
    }
    ctx.save();
    ctx.clearRect(0, 0, canvas!.width, canvas!.height);
    ctx.restore();
    canvas!.width = w + strokeWidth * 2;
    canvas!.height = h + strokeWidth * 2;
    const dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1];
    const img = await this.addImage(src);
    if (!img) return;
    for (let i = 0; i < dArr.length; i += 2) {
      ctx.drawImage(
        img,
        strokeWidth + dArr[i] * strokeWidth,
        strokeWidth + dArr[i + 1] * strokeWidth,
        w,
        h
      );
    }
    ctx.globalCompositeOperation = 'source-in';
    ctx.fillStyle = stroke;
    ctx.fillRect(0, 0, w + strokeWidth * 2, h + strokeWidth * 2);
    ctx.globalCompositeOperation = type as any;
    ctx.drawImage(img, strokeWidth, strokeWidth, w, h);
    const res = canvas?.toDataURL();
    canvas = null;
    if (!res) return;
    activeObject.setSrc(res, () => {
      activeObject.canvas?.renderAll();
    });
  }

  destroy() {
    // this.editor.off('sizeChange', this.drawWaterMark);
  }
}

export default ImageStrokePlugin;
