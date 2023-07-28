/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: 秦少卫
 * @Date: 2023-05-13 18:53:44
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-06-27 22:44:31
 * @Description: file content
 */

declare interface IPluginOption {
  [propName: string]: unknown;
}

// 生命周期事件类型
declare type IEditorHooksType =
  | 'hookImportBefore'
  | 'hookImportAfter'
  | 'hookSaveBefore'
  | 'hookSaveAfter';

// 插件class
declare interface IPluginClass extends IPluginTempl {
  new (canvas: fabric.Canvas, editor: any, options: IPluginOption): IPluginTempl;
}

declare interface IPluginMenu {
  text: string;
  command?: () => void;
  child?: IPluginMenu[];
}

// 插件实例
declare interface IPluginTempl {
  pluginName: string;
  events: string[];
  apis: string[];
  canvas: fabric.Canvas;
  hotkeyEvent: (name: string, e: Event) => viode;
  [propName: IEditorHooksType]: () => void;
  [propName: string]: any;
}
