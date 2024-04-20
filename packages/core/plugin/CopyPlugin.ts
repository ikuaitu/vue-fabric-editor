/*
 * @Author: 秦少卫
 * @Date: 2023-06-20 12:38:37
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-11 12:36:03
 * @Description: 复制插件
 */

import { fabric } from 'fabric';
import Editor from '../Editor';
type IEditor = Editor;
import { v4 as uuid } from 'uuid';
import { getImgStr } from '../utils/utils';

class CopyPlugin {
  public canvas: fabric.Canvas;
  public editor: IEditor;
  static pluginName = 'CopyPlugin';
  static apis = ['clone'];
  public hotkeys: string[] = ['ctrl+v', 'ctrl+c'];
  private cache: null | fabric.ActiveSelection | fabric.Object;
  constructor(canvas: fabric.Canvas, editor: IEditor) {
    this.canvas = canvas;
    this.editor = editor;
    this.cache = null;
    this.initPaste();
  }

  // 多选对象复制
  _copyActiveSelection(activeObject: fabric.Object) {
    // 间距设置
    const grid = 10;
    const canvas = this.canvas;
    activeObject?.clone((cloned: fabric.Object) => {
      // 再次进行克隆，处理选择多个对象的情况
      cloned.clone((clonedObj: fabric.ActiveSelection) => {
        canvas.discardActiveObject();
        if (clonedObj.left === undefined || clonedObj.top === undefined) return;
        // 将克隆的画布重新赋值
        clonedObj.canvas = canvas;
        // 设置位置信息
        clonedObj.set({
          left: clonedObj.left + grid,
          top: clonedObj.top + grid,
          evented: true,
          id: uuid(),
        });
        clonedObj.forEachObject((obj: fabric.Object) => {
          obj.id = uuid();
          canvas.add(obj);
        });
        // 解决不可选择问题
        clonedObj.setCoords();
        canvas.setActiveObject(clonedObj);
        canvas.requestRenderAll();
      });
    });
  }

  // 单个对象复制
  _copyObject(activeObject: fabric.Object) {
    // 间距设置
    const grid = 10;
    const canvas = this.canvas;
    activeObject?.clone((cloned: fabric.Object) => {
      if (cloned.left === undefined || cloned.top === undefined) return;
      canvas.discardActiveObject();
      // 设置位置信息
      cloned.set({
        left: cloned.left + grid,
        top: cloned.top + grid,
        evented: true,
        id: uuid(),
      });
      canvas.add(cloned);
      canvas.setActiveObject(cloned);
      canvas.requestRenderAll();
    });
  }

  // 复制元素
  clone(paramsActiveObeject?: fabric.ActiveSelection | fabric.Object) {
    const activeObject = paramsActiveObeject || this.canvas.getActiveObject();
    if (!activeObject) return;
    if (activeObject?.type === 'activeSelection') {
      this._copyActiveSelection(activeObject);
    } else {
      this._copyObject(activeObject);
    }
  }

  // 快捷键扩展回调
  hotkeyEvent(eventName: string, e: any) {
    if (eventName === 'ctrl+c' && e.type === 'keydown') {
      const activeObject = this.canvas.getActiveObject();
      this.cache = activeObject;
    }
    if (eventName === 'ctrl+v' && e.type === 'keydown') {
      if (this.cache) {
        this.clone(this.cache);
      }
    }
  }

  contextMenu() {
    const activeObject = this.canvas.getActiveObject();
    if (activeObject) {
      return [{ text: '复制', hotkey: 'Ctrl+V', disabled: false, onclick: () => this.clone() }];
    }
  }

  destroy() {
    console.log('pluginDestroy');
    window.removeEventListener('paste', (e) => this.pasteListener(e));
  }

  initPaste() {
    window.addEventListener('paste', (e) => this.pasteListener(e));
  }

  async pasteListener(event: any) {
    const canvas = this.canvas;
    if (document.activeElement === document.body) {
      event.preventDefault(); // 阻止默认粘贴行为
    } else {
      return;
    }

    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    const fileAccept = '.pdf,.psd,.cdr,.ai,.svg,.jpg,.jpeg,.png,.webp,.json';
    for (const item of items) {
      if (item.kind === 'file') {
        const file = item.getAsFile();
        const curFileSuffix: string | undefined = file.name.split('.').pop();
        if (!fileAccept.split(',').includes(`.${curFileSuffix}`)) return;
        if (curFileSuffix === 'svg') {
          const svgFile = await getImgStr(file);
          if (!svgFile) throw new Error('file is undefined');
          fabric.loadSVGFromURL(svgFile as string, (objects, options) => {
            const item = fabric.util.groupSVGElements(objects, {
              ...options,
              name: 'defaultSVG',
              id: uuid(),
            });
            canvas.add(item).centerObject(item).renderAll();
          });
        }
        // if (curFileSuffix === 'json') {
        //   const dataText = await getImageText(file);
        //   const template = JSON.parse(dataText);
        //   addTemplate(template);
        // }
        if (item.type.indexOf('image/') === 0) {
          // 这是一个图片文件
          const imageUrl = URL.createObjectURL(file);
          const imgEl = document.createElement('img');
          imgEl.src = imageUrl;
          // 插入页面
          document.body.appendChild(imgEl);
          imgEl.onload = () => {
            // 创建图片对象
            const imgInstance = new fabric.Image(imgEl, {
              id: uuid(),
              name: '图片1',
              left: 100,
              top: 100,
            });
            // 设置缩放
            canvas.add(imgInstance);
            canvas.setActiveObject(imgInstance);
            canvas.renderAll();
            // 删除页面中的图片元素
            imgEl.remove();
          };
        }
      } else if (item.kind === 'string' && item.type.indexOf('text/plain') === 0) {
        // 文本数据
        item.getAsString((text: any) => {
          // 插入到文本框
          const activeObject = canvas.getActiveObject() as fabric.Textbox;
          // 如果是激活的文字把复制的内容插入到对应光标位置
          if (
            activeObject &&
            (activeObject.type === 'textbox' || activeObject.type === 'i-text') &&
            activeObject.text
          ) {
            const cursorPosition = activeObject.selectionStart;
            const textBeforeCursorPosition = activeObject.text.substring(0, cursorPosition);
            const textAfterCursorPosition = activeObject.text.substring(cursorPosition as number);

            // 更新文本对象的文本
            activeObject.set('text', textBeforeCursorPosition + text + textAfterCursorPosition);

            // 重新设置光标的位置
            activeObject.selectionStart = cursorPosition + text.length;
            activeObject.selectionEnd = cursorPosition + text.length;

            // 重新渲染画布展示更新后的文本
            activeObject.dirty = true;
            canvas.renderAll();
          } else {
            const fabricText = new fabric.IText(text, {
              left: 100,
              top: 100,
              fontSize: 80,
              id: uuid(),
            });
            canvas.add(fabricText);
            canvas.setActiveObject(fabricText);
          }
        });
      }
    }
    if (!items.length) {
      if (this.cache) {
        this.clone(this.cache);
      }
    }
  }
}

export default CopyPlugin;
