/*
 * @Author: 秦少卫
 * @Date: 2024-06-06 14:12:24
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-07 11:53:04
 * @Description: 条形码生成工具
 */

import { fabric } from 'fabric';
import Editor from '../Editor';
import * as JsBarcode from 'JsBarcode';

type IEditor = Editor;

// 条形码生成参数
// https://github.com/lindell/JsBarcode/wiki/Options

enum CodeType {
  CODE128 = 'CODE128',
  EAN8 = 'EAN8',
  EAN13 = 'EAN13',
  ITF14 = 'ITF14',
  codabar = 'codabar',
  pharmacode = 'pharmacode',
}

class BarCodePlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'BarCodePlugin';
  static apis = ['addBarcode', 'setBarcode', 'getBarcodeTypes'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  _getBase64Str(option: any) {
    const canvas = document.createElement('canvas');
    JsBarcode(canvas, option.value, {
      ...option,
    });
    const url = canvas.toDataURL('image/png', 1);
    return url;
  }

  _defaultBarcodeOption() {
    return {
      value: '123456',
      format: CodeType.CODE128,
      text: 'hi kuaitu',
      textAlign: 'left',
      textPosition: 'bottom',
      fontSize: 12,
    };
  }

  addBarcode() {
    const option = this._defaultBarcodeOption();
    const url = this._getBase64Str(JSON.parse(JSON.stringify(option)));
    fabric.Image.fromURL(
      url,
      (imgEl) => {
        imgEl.set({
          extensionType: 'barcode',
          extension: option,
        });
        this.canvas.add(imgEl);

        this.canvas.setActiveObject(imgEl);

        this.editor.position('center');
      },
      { crossOrigin: 'anonymous' }
    );
  }

  setBarcode(option: any) {
    try {
      const url = this._getBase64Str(option);
      const activeObject = this.canvas.getActiveObjects()[0];
      fabric.Image.fromURL(
        url,
        (imgEl) => {
          imgEl.set({
            left: activeObject.left,
            top: activeObject.top,
            extensionType: 'barcode',
            extension: { ...option },
          });
          imgEl.scaleToWidth(activeObject.getScaledWidth());
          this.editor.del();
          this.canvas.add(imgEl);
          this.canvas.setActiveObject(imgEl);
        },
        { crossOrigin: 'anonymous' }
      );
    } catch (error) {
      console.log(error);
    }
  }

  getBarcodeTypes() {
    return Object.values(CodeType);
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default BarCodePlugin;
