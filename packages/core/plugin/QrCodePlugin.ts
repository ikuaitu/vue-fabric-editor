/*
 * @Author: 秦少卫
 * @Date: 2024-06-06 19:58:26
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-07 21:25:16
 * @Description: 二维码生成工具
 */

import { fabric } from 'fabric';
import Editor from '../Editor';
import QRCodeStyling from 'qr-code-styling';

type IEditor = Editor;

// 二维码生成参数

enum DotsType {
  rounded = 'rounded',
  dots = 'dots',
  classy = 'classy',
  classy_rounded = 'classy-rounded',
  square = 'square',
  extra_rounded = 'extra-rounded',
}

enum CornersType {
  dot = 'dot',
  square = 'square',
  extra_rounded = 'extra-rounded',
}

enum cornersDotType {
  dot = 'dot',
  square = 'square',
}

enum errorCorrectionLevelType {
  L = 'L',
  M = 'M',
  Q = 'Q',
  H = 'H',
}

class QrCodePlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'QrCodePlugin';
  static apis = ['addQrCode', 'setQrCode', 'getQrCodeTypes'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
  }

  async hookTransform(object: any) {
    if (object.extensionType === 'qrcode') {
      const paramsOption = this._paramsToOption(object.extension);
      const url = await this._getBase64Str(paramsOption);
      object.src = url;
    }
  }

  async _getBase64Str(options: any) {
    const qrCode = new QRCodeStyling(options);
    const blob = await qrCode.getRawData('png');
    const base64Str = await this._blobToBase64(blob);
    return base64Str || '';
  }

  _defaultBarcodeOption() {
    return {
      data: 'https://kuaitu.cc',
      width: 300,
      margin: 10,
      errorCorrectionLevel: 'M',
      dotsColor: 'black',
      dotsType: 'rounded',
      cornersSquareColor: 'black',
      cornersSquareType: 'square',
      cornersDotColor: 'black',
      cornersDotType: 'square',
      background: '#ffffff',
    };
  }

  _paramsToOption(option: any) {
    return {
      width: option.width,
      height: option.width,
      type: 'canvas',
      data: option.data,
      margin: option.margin,
      qrOptions: {
        errorCorrectionLevel: option.errorCorrectionLevel,
      },
      // 点
      dotsOptions: {
        color: option.dotsColor,
        type: option.dotsType,
      },
      // 三个角
      cornersSquareOptions: {
        color: option.cornersSquareColor,
        type: option.cornersSquareType,
      },
      // 圆点选项
      cornersDotOptions: {
        color: option.cornersDotColor,
        type: option.cornersDotType,
      },
      // 背景
      backgroundOptions: {
        color: option.background,
      },
    };
  }

  _blobToBase64(blob: Blob) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      //读取后，result属性中将包含一个data:URL格式的Base64字符串用来表示所读取的文件
      reader.onload = function (e) {
        resolve(e.target.result);
      };
    });
  }

  async addQrCode() {
    const option = this._defaultBarcodeOption();
    const paramsOption = this._paramsToOption(option);
    const url = await this._getBase64Str(paramsOption);
    fabric.Image.fromURL(
      url,
      (imgEl) => {
        imgEl.set({
          extensionType: 'qrcode',
          extension: option,
        });
        imgEl.scaleToWidth(this.editor.getWorkspase().getScaledWidth() / 2);
        this.canvas.add(imgEl);
        this.canvas.setActiveObject(imgEl);
        this.editor.position('center');
      },
      { crossOrigin: 'anonymous' }
    );
  }

  async setQrCode(option: any) {
    try {
      const paramsOption = this._paramsToOption(option);
      const url = await this._getBase64Str(paramsOption);
      const activeObject = this.canvas.getActiveObjects()[0];
      fabric.Image.fromURL(
        url,
        (imgEl) => {
          imgEl.set({
            left: activeObject.left,
            top: activeObject.top,
            extensionType: 'qrcode',
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

  getQrCodeTypes() {
    return {
      DotsType: Object.values(DotsType),
      CornersType: Object.values(CornersType),
      cornersDotType: Object.values(cornersDotType),
      errorCorrectionLevelType: Object.values(errorCorrectionLevelType),
    };
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default QrCodePlugin;
