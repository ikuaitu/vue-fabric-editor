/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * @Author: 秦少卫
 * @Date: 2023-05-13 18:53:44
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-07 19:48:01
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
  | 'hookSaveAfter'
  | 'hookTransform';

// 插件class
declare interface IPluginClass extends IPluginTempl {
  new (canvas: fabric.Canvas, editor: IEditor, options?: IPluginOption);
}

declare interface IPluginMenu {
  text: string;
  command?: () => void;
  child?: IPluginMenu[];
}

// 插件实例
declare class IPluginTempl {
  static pluginName: string;
  static events: string[];
  static apis: string[];
  canvas?: fabric.Canvas | null | undefined;
  hotkeyEvent?: (name: string, e: KeyboardEvent) => void;
  [propName: IEditorHooksType]: () => void;
  [propName: string]: any;
}
