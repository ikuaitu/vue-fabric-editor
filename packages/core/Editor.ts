import EventEmitter from 'events';
import hotkeys from 'hotkeys-js';
import ContextMenu from './ContextMenu.js';
import ServersPlugin from './ServersPlugin';
import { AsyncSeriesHook } from 'tapable';

import Utils from './utils/utils';

class Editor extends EventEmitter {
  private canvas: fabric.Canvas | null = null;
  contextMenu: ContextMenu | null = null;
  [key: string]: any;
  private pluginMap: {
    [propName: string]: IPluginTempl;
  } = {};
  // 自定义事件
  private customEvents: string[] = [];
  // 自定义API
  private customApis: string[] = [];
  // 生命周期函数名
  private hooks: IEditorHooksType[] = [
    'hookImportBefore',
    'hookImportAfter',
    'hookSaveBefore',
    'hookSaveAfter',
    'hookTransform',
  ];
  public hooksEntity: {
    [propName: string]: AsyncSeriesHook<any, any>;
  } = {};

  init(canvas: fabric.Canvas) {
    this.canvas = canvas;
    this._initContextMenu();
    this._bindContextMenu();
    this._initActionHooks();
    this._initServersPlugin();

    this.Utils = Utils;
  }

  get fabricCanvas() {
    return this.canvas;
  }

  // 引入组件
  use(plugin: IPluginClass, options?: IPluginOption) {
    if (this._checkPlugin(plugin) && this.canvas) {
      this._saveCustomAttr(plugin);
      const pluginRunTime = new plugin(this.canvas, this, options || {}) as IPluginClass;
      // 添加插件名称
      pluginRunTime.pluginName = plugin.pluginName;
      this.pluginMap[plugin.pluginName] = pluginRunTime;
      this._bindingHooks(pluginRunTime);
      this._bindingHotkeys(pluginRunTime);
      this._bindingApis(pluginRunTime);
    }
  }

  destory() {
    this.canvas = null;
    this.contextMenu = null;
    this.pluginMap = {};
    this.customEvents = [];
    this.customApis = [];
    this.hooksEntity = {};
  }
  // 获取插件
  getPlugin(name: string) {
    if (this.pluginMap[name]) {
      return this.pluginMap[name];
    }
  }

  // 检查组件
  private _checkPlugin(plugin: IPluginClass) {
    const { pluginName, events = [], apis = [] } = plugin;
    //名称检查
    if (this.pluginMap[pluginName]) {
      throw new Error(pluginName + '插件重复初始化');
    }
    events.forEach((eventName: string) => {
      if (this.customEvents.find((info) => info === eventName)) {
        throw new Error(pluginName + '插件中' + eventName + '重复');
      }
    });

    apis.forEach((apiName: string) => {
      if (this.customApis.find((info) => info === apiName)) {
        throw new Error(pluginName + '插件中' + apiName + '重复');
      }
    });
    return true;
  }

  // 绑定hooks方法
  private _bindingHooks(plugin: IPluginTempl) {
    this.hooks.forEach((hookName) => {
      const hook = plugin[hookName];
      if (hook) {
        this.hooksEntity[hookName].tapPromise(plugin.pluginName + hookName, function () {
          // console.log(hookName, ...arguments);
          // eslint-disable-next-line prefer-rest-params
          const result = hook.apply(plugin, [...arguments]);
          // hook 兼容非 Promise 返回值
          return result instanceof Promise ? result : Promise.resolve(result);
        });
      }
    });
  }

  // 绑定快捷键
  private _bindingHotkeys(plugin: IPluginTempl) {
    plugin?.hotkeys?.forEach((keyName: string) => {
      // 支持 keyup
      hotkeys(keyName, { keyup: true }, (e) => {
        plugin.hotkeyEvent && plugin.hotkeyEvent(keyName, e);
      });
    });
  }

  // 保存组件自定义事件与API
  private _saveCustomAttr(plugin: IPluginClass) {
    const { events = [], apis = [] } = plugin;
    this.customApis = this.customApis.concat(apis);
    this.customEvents = this.customEvents.concat(events);
  }
  // 代理API事件
  private _bindingApis(pluginRunTime: IPluginTempl) {
    const { apis = [] } = (pluginRunTime.constructor as any) || {};
    apis.forEach((apiName: string) => {
      this[apiName] = function () {
        // eslint-disable-next-line prefer-rest-params
        return pluginRunTime[apiName].apply(pluginRunTime, [...arguments]);
      };
    });
  }

  // 右键菜单
  private _bindContextMenu() {
    this.canvas &&
      this.canvas.on('mouse:down', (opt) => {
        if (opt.button === 3) {
          let menu: IPluginMenu[] = [];
          Object.keys(this.pluginMap).forEach((pluginName) => {
            const pluginRunTime = this.pluginMap[pluginName];
            const pluginMenu = pluginRunTime.contextMenu && pluginRunTime.contextMenu();
            if (pluginMenu) {
              menu = menu.concat(pluginMenu);
            }
          });
          this._renderMenu(opt, menu);
        }
      });
  }

  // 渲染右键菜单
  private _renderMenu(opt: { e: MouseEvent }, menu: IPluginMenu[]) {
    if (menu.length !== 0 && this.contextMenu) {
      this.contextMenu.hideAll();
      this.contextMenu.setData(menu);
      this.contextMenu.show(opt.e.clientX, opt.e.clientY);
    }
  }

  // 生命周期事件
  _initActionHooks() {
    this.hooks.forEach((hookName) => {
      this.hooksEntity[hookName] = new AsyncSeriesHook(['data']);
    });
  }

  _initContextMenu() {
    this.contextMenu = new ContextMenu(this.canvas!.wrapperEl, []);
    this.contextMenu.install();
  }

  _initServersPlugin() {
    this.use(ServersPlugin);
  }

  // 解决 listener 为 undefined 的时候卸载错误
  off(eventName: string, listener: any): this {
    // noinspection TypeScriptValidateTypes
    return listener ? super.off(eventName, listener) : this;
  }
}

export default Editor;
