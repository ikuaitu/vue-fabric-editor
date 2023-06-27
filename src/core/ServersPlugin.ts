/*
 * @Author: 秦少卫
 * @Date: 2023-06-20 12:52:09
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-06-27 13:40:43
 * @Description: 内部插件
 */

import { selectFiles, downFontByJSON } from '@/utils/utils';

import { fabric } from 'fabric';
import Editor from '../core';
type IEditor = Editor;
// import { v4 as uuid } from 'uuid';

class ServersPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'ServersPlugin';
  static apis = ['insert', 'insertSvgFile'];
  // public hotkeys: string[] = ['left', 'right', 'down', 'up'];
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    // this.init();
  }

  insert() {
    selectFiles({ accept: '.json' }).then((files) => {
      const [file] = files;
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        this.insertSvgFile(reader.result);
      };
    });
  }

  insertSvgFile(jsonFile) {
    this.editor.hooksEntity.hookImportBefore.callAsync(jsonFile, () => {
      console.log(22222);
      this.canvas.loadFromJSON(jsonFile, () => {
        this.canvas.renderAll();
        this.editor.hooksEntity.hookImportAfter.callAsync(jsonFile, () => {
          console.log(555);
          this.canvas.renderAll();
        });
      });
      // 加载字体后导入
      // downFontByJSON(jsonFile).then(() => {
      //   this.canvas.loadFromJSON(jsonFile, () => {
      //     this.canvas.renderAll.bind(this.canvas);
      //     setTimeout(() => {
      //       const workspace = this.canvas.getObjects().find((item) => item.id === 'workspace');
      //       if (workspace) {
      //         workspace.set('selectable', false);
      //         workspace.set('hasControls', false);
      //         this.editor.setSize(workspace.width, workspace.height);
      //       }
      //       this.canvas.renderAll();
      //       this.canvas.requestRenderAll();
      //     }, 100);
      //   });
      // });
    });
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default ServersPlugin;
