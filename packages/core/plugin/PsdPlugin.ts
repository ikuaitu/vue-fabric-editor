/*
 * @Author: 秦少卫
 * @Date: 2024-05-27 16:09:29
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-08 18:25:55
 * @Description: PSD插件
 */

import { fabric } from 'fabric';
import Editor from '../Editor';
import { selectFiles } from '../utils/utils';
import psdToJson from '../utils/psd';
import Psd from '@webtoon/psd';
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
              const psdFile = Psd.parse(result as ArrayBuffer);
              this.json = await psdToJson(psdFile);
              // 加载json
              this.loadJSON();
              resolve('');
            };
          }
        })
        .catch(reject);
    });
  }

  loadJSON() {
    this.editor.loadJSON(this.json);
  }
}

export default PsdPlugin;
