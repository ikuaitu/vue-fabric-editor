/*
 * @Author: 秦少卫
 * @Date: 2024-05-27 16:09:29
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-28 11:01:28
 * @Description: PSD插件
 */

import { fabric } from 'fabric';
import Editor from '../Editor';
import { selectFiles } from '../utils/utils';
import Psd from '@webtoon/psd';
import { v4 as uuid } from 'uuid';
type IEditor = Editor;

class PsdPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  public psdFile: any;
  public json: any;
  static pluginName = 'PsdPlugin';
  static apis = ['insertPSD'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this.json = {};
  }

  insertPSD() {
    return new Promise((resolve, reject) => {
      selectFiles({ accept: '.psd' })
        .then((files: string | any[]) => {
          if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = async () => {
              const result = await file.arrayBuffer();
              // 解析PSD文件
              this.psdFile = Psd.parse(result as ArrayBuffer);
              // 初始化json
              this.json = this.getFabricBaseJson();
              // 设置背景大小
              this.getBgSize();
              // 执行元素转换
              await this.childrenTransform();
              // 加载json
              this.loadJSON();
              resolve();
            };
          }
        })
        .catch(reject);
    });
  }

  async childrenTransform() {
    const fabricJhildren = (await this.psdChildrenTransform(this.psdFile.children)) as any;
    this.json.objects.push(...fabricJhildren.reverse());
  }

  async psdChildrenTransform(children: any) {
    const that = this;
    function attrTransform(childrens: any) {
      return childrens.map(async (item: any) => {
        const commonAttr = that.getCommonAttr(item);
        if (item.type === 'Group') {
          const all = await Promise.all(attrTransform(children));
          return {
            ...getAttrByType('group'),
            ...commonAttr,
            objects: all,
          };
        } else {
          const isFont = item.text;
          if (isFont) {
            const { FontSize, FillColor, Tracking } =
              item.textProperties.EngineDict.StyleRun.RunArray[0].StyleSheet.StyleSheetData;
            return {
              ...getAttrByType('textbox'),
              ...commonAttr,
              text: item.text,
              charSpacing: Tracking,
              fontFamily: '站酷快乐体',
              fill: that.getColor(FillColor.Values),
              fontSize: FontSize || 12,
            };
          } else {
            const base64 = await that.getLayerBse64(item);
            return {
              ...getAttrByType('image'),
              ...commonAttr,
              src: base64,
            };
          }
        }
      });
    }
    const resault = await Promise.all(attrTransform(children));
    return resault;
  }

  getColor(arr: any) {
    const [, r, g, b] = arr;
    return `rgb(${r * 255}, ${g * 255}, ${b * 255})`;
  }

  getBgSize() {
    const { clipPath, workspase } = this.getClipPath();
    this.json.clipPath = clipPath;
    this.json.objects.push(workspase);
  }

  loadJSON() {
    this.editor.loadJSON(JSON.stringify(this.json));
  }

  async getLayerBse64(layer: any) {
    try {
      const compositeBuffer = await layer.composite();
      const canvasElement = document.createElement('canvas');
      const context = canvasElement.getContext('2d');
      const imageData = new ImageData(compositeBuffer, layer.width, layer.height);
      canvasElement.width = layer.width;
      canvasElement.height = layer.height;
      context.putImageData(imageData, 0, 0);
      const base64 = canvasElement.toDataURL('image/png');
      return base64;
    } catch (error) {
      return '';
    }
  }

  getCommonAttr(item: any) {
    const baseAttr = [
      'left',
      'top',
      'width',
      'height',
      'name',
      [
        'visible',
        (info: any) => {
          return !info.isHidden;
        },
      ],
      [
        'opacity',
        (info: any) => {
          return 255 / info.opacity;
        },
      ],
    ];

    const attrs = {
      id: uuid(),
    };
    baseAttr.forEach((attrType) => {
      if (typeof attrType === 'string') {
        attrs[attrType] = item[attrType];
      } else {
        const [key, transform] = attrType;
        attrs[key] = transform(item);
      }
    });
    return attrs;
  }

  getFabricBaseJson() {
    return {
      version: '5.3.0',
      objects: [],
      clipPath: null,
    };
  }
  getClipPath() {
    const { width, height } = this.psdFile;
    const clipPath = {
      type: 'rect',
      version: '5.3.0',
      originX: 'left',
      originY: 'top',
      left: 0,
      top: 0,
      width: width,
      height: height,
      fill: 'rgba(255,255,255,1)',
      stroke: null,
      strokeWidth: 0,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeDashOffset: 0,
      strokeLineJoin: 'miter',
      strokeUniform: false,
      strokeMiterLimit: 4,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      flipX: false,
      flipY: false,
      opacity: 1,
      shadow: null,
      visible: true,
      backgroundColor: '',
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      rx: 0,
      ry: 0,
      selectable: true,
      hasControls: true,
    };
    const workspase = {
      type: 'rect',
      version: '5.3.0',
      originX: 'left',
      originY: 'top',
      left: 0,
      top: 0,
      width: width,
      height: height,
      fill: 'rgba(255,255,255,1)',
      stroke: null,
      strokeWidth: 0,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeDashOffset: 0,
      strokeLineJoin: 'miter',
      strokeUniform: false,
      strokeMiterLimit: 4,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      flipX: false,
      flipY: false,
      // "opacity": 1,
      shadow: null,
      visible: true,
      backgroundColor: '',
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      rx: 0,
      ry: 0,
      id: 'workspace',
      selectable: false,
      hasControls: true,
    };
    return { clipPath, workspase };
  }
}

function getAttrByType(type: string) {
  const typeMap = {
    group: {
      type: 'group',
      version: '5.3.0',
      originX: 'left',
      originY: 'top',
      fill: 'rgb(0,0,0)',
      stroke: null,
      strokeWidth: 0,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeDashOffset: 0,
      strokeLineJoin: 'miter',
      strokeUniform: false,
      strokeMiterLimit: 4,
      scaleX: 1,
      scaleY: 1,
      flipX: false,
      flipY: false,
      shadow: null,
      visible: true,
      backgroundColor: '',
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      selectable: true,
      hasControls: true,
    },
    textbox: {
      type: 'textbox',
      version: '5.3.0',
      originX: 'left',
      originY: 'top',
      fill: 'rgb(0,0,0)',
      stroke: null,
      strokeWidth: 1,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeDashOffset: 0,
      strokeLineJoin: 'miter',
      strokeUniform: false,
      strokeMiterLimit: 4,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      flipX: false,
      flipY: false,
      shadow: '',
      backgroundColor: '',
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      fontFamily: 'arial',
      fontWeight: 'normal',
      fontSize: 80,
      text: '诸事顺遂',
      underline: false,
      overline: false,
      linethrough: false,
      textAlign: 'left',
      fontStyle: 'normal',
      lineHeight: 1.16,
      textBackgroundColor: '',
      charSpacing: 0,
      styles: [],
      direction: 'ltr',
      path: null,
      pathStartOffset: 0,
      pathSide: 'left',
      pathAlign: 'baseline',
      minWidth: 20,
      splitByGrapheme: true,
      selectable: true,
      hasControls: true,
    },
    image: {
      type: 'image',
      version: '5.3.0',
      originX: 'left',
      originY: 'top',
      fill: 'rgb(0,0,0)',
      stroke: null,
      strokeWidth: 0,
      strokeDashArray: null,
      strokeLineCap: 'butt',
      strokeDashOffset: 0,
      strokeLineJoin: 'miter',
      strokeUniform: false,
      strokeMiterLimit: 4,
      scaleX: 1,
      scaleY: 1,
      angle: 0,
      flipX: false,
      flipY: false,
      shadow: null,
      backgroundColor: '',
      fillRule: 'nonzero',
      paintFirst: 'fill',
      globalCompositeOperation: 'source-over',
      skewX: 0,
      skewY: 0,
      cropX: 0,
      cropY: 0,
      selectable: true,
      hasControls: true,
      src: '',
      crossOrigin: 'anonymous',
      filters: [],
    },
  };

  return typeMap[type];
}
export default PsdPlugin;
