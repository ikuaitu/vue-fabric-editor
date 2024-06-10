/*
 * @Author: 秦少卫
 * @Date: 2024-04-21 23:51:01
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-07 21:53:36
 * @Description: 自定义字体
 */

// const repoSrc = 'http://localhost:1337';
import { fabric } from 'fabric';
import FontFaceObserver from 'fontfaceobserver';
import Editor from '../Editor';
import axios from 'axios';
import { downFile } from '../utils/utils';

type IEditor = Editor;

interface Font {
  type: string;
  fontFamily: string;
}

interface FontSource {
  name: string;
  type: string;
  file: string;
  img: string;
}

class FontPlugin implements IPluginTempl {
  private tempPromise: Promise<FontSource[]> | null;
  static pluginName = 'FontPlugin';
  static apis = ['getFontList', 'loadFont', 'getFontJson', 'downFontByJSON'];
  repoSrc: string;
  cacheList: FontSource[];
  constructor(public canvas: fabric.Canvas, public editor: IEditor, config: { repoSrc: string }) {
    this.repoSrc = config.repoSrc;
    this.cacheList = [];
    this.tempPromise = null;
  }

  hookImportBefore(json: string) {
    return this.downFontByJSON(json);
  }
  getFontList() {
    // 返回暂存字体
    if (this.cacheList.length) {
      return Promise.resolve(this.cacheList);
    }
    if (this.tempPromise) return this.tempPromise;
    this.tempPromise = axios
      .get(`${this.repoSrc}/api/fonts?populate=*&pagination[pageSize]=100`)
      .then((res) => {
        const list = res.data.data.map((item: any) => {
          return {
            name: item.attributes.name,
            type: item.attributes.type,
            file: this.repoSrc + item.attributes.file.data.attributes.url,
            img: this.repoSrc + item.attributes.img.data.attributes.url,
          };
        });
        this.cacheList = list;
        this.createFontCSS(list);
        return list;
      });
    return this.tempPromise;
  }

  downFontByJSON(str: string) {
    const object = JSON.parse(str);
    let fontFamilies: string[] = [];
    const skipFonts = ['arial'];
    if (object.objects) {
      fontFamilies = JSON.parse(str)
        .objects.filter((item: Font) => {
          const hasFontFile = this.cacheList.find((font) => font.name === item.fontFamily);
          return item.type.includes('text') && !skipFonts.includes(item.fontFamily) && hasFontFile;
        })
        .map((item: Font) => item.fontFamily);
    } else {
      fontFamilies = skipFonts.includes(object.fontFamily) ? [] : [object.fontFamily];
    }

    const fontFamiliesAll = fontFamilies.map((fontName) => {
      const font = new FontFaceObserver(fontName);
      return font.load(null, 150000);
    });
    return Promise.all(fontFamiliesAll);
  }

  // 获取字体数据 新增字体样式使用
  getFontJson() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      const json = activeObject.toJSON(['id', 'gradientAngle', 'selectable', 'hasControls']);
      const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(json, null, '\t')
      )}`;
      const dataUrl = activeObject.toDataURL({});
      downFile(fileStr, 'font.json');
      downFile(dataUrl, 'font.png');
    }
  }

  loadFont(fontName: string) {
    const font = new FontFaceObserver(fontName);
    return font.load(null, 150000).then(() => {
      const activeObject = this.canvas.getActiveObjects()[0];
      if (activeObject) {
        activeObject.set('fontFamily', fontName);
        this.canvas.renderAll();
      }
    });
  }

  createFontCSS(arr: any[]) {
    let code = '';
    arr.forEach((item) => {
      code =
        code +
        `
    @font-face {
      font-family: ${item.name};
      src: url('${item.file}');
    }
    `;
    });
    const style = document.createElement('style');
    try {
      style.appendChild(document.createTextNode(code));
    } catch (error) {
      // style.styleSheet.cssText = code;
    }
    const head = document.getElementsByTagName('head')[0];
    head.appendChild(style);
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default FontPlugin;
