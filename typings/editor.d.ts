/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: 秦少卫
 * @Date: 2023-05-13 18:53:44
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-10 17:24:09
 * @Description: file content
 */

declare interface IPluginOption {
  [propName: string]: unknown | undefined;
}

// 生命周期事件类型
declare type IEditorHooksType =
  | 'hookImportBefore'
  | 'hookImportAfter'
  | 'hookSaveBefore'
  | 'hookSaveAfter';

// 插件class
declare interface IPluginClass extends IPluginTempl {
  new (canvas: fabric.Canvas, editor: any, options?: IPluginOption);
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
  canvas?: fabric.Canvas | null | undefined;
  hotkeyEvent?: (name: string, e: Event) => void;
  [propName: IEditorHooksType]: () => void;
  [propName: string]: any;
}
