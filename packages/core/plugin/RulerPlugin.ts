/*
 * @Author: 秦少卫
 * @Date: 2023-07-04 23:45:49
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-10 17:33:54
 * @Description: 标尺插件
 */

import { fabric } from 'fabric';
import Editor from '../Editor';
// import { throttle } from 'lodash-es';
type IEditor = Editor;

import initRuler from '../ruler';

class RulerPlugin implements IPluginTempl {
  static pluginName = 'RulerPlugin';
  //  static events = ['sizeChange'];
  static apis = ['hideGuideline', 'showGuideline', 'rulerEnable', 'rulerDisable'];
  ruler: any;
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {
    this.init();
  }

  hookSaveBefore() {
    return new Promise((resolve) => {
      this.hideGuideline();
      resolve(true);
    });
  }

  hookSaveAfter() {
    return new Promise((resolve) => {
      this.showGuideline();
      resolve(true);
    });
  }

  init() {
    this.ruler = initRuler(this.canvas);
  }

  hideGuideline() {
    this.ruler.hideGuideline();
  }

  showGuideline() {
    this.ruler.showGuideline();
  }

  rulerEnable() {
    this.ruler.enable();
  }

  rulerDisable() {
    this.ruler.disable();
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default RulerPlugin;
