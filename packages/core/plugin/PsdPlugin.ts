/*
 * @Author: 秦少卫
 * @Date: 2024-05-27 16:09:29
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-08 18:31:24
 * @Description: PSD插件
 */

import { fabric } from 'fabric';
import Editor from '../Editor';
import { selectFiles } from '../utils/utils';
import psdToJson from '../utils/psd';
import Psd from '@webtoon/psd';
type IEditor = Editor;

class PsdPlugin implements IPluginTempl {
  static pluginName = 'PsdPlugin';
  static apis = ['insertPSD'];
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {}

  insertPSD(callback?: () => void) {
    return new Promise((resolve, reject) => {
      selectFiles({ accept: '.psd' })
        .then((files) => {
          if (files && files.length > 0) {
            const file = files[0];
            const reader = new FileReader();
            reader.readAsText(file, 'UTF-8');
            reader.onload = async () => {
              const result = await file.arrayBuffer();
              // 解析PSD文件
              const psdFile = Psd.parse(result as ArrayBuffer);
              console.log(psdFile, '11111');
              const json = await psdToJson(psdFile);
              // 加载json
              this.loadJSON(json, callback);
              resolve('');
            };
          }
        })
        .catch(reject);
    });
  }

  loadJSON(json: string, callback?: () => void) {
    this.editor.loadJSON(json, callback);
  }
}

export default PsdPlugin;
