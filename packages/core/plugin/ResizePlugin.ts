/*
 * @Author: wuchenguang1998
 * @Date: 2024-06-17 21:00:00
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-30 20:01:36
 * @Description: 画布resize拖拽插件
 */

import { fabric } from 'fabric';
import Editor from '../Editor';
import { throttle } from 'lodash-es';
import '../styles/resizePlugin.css';

type IEditor = Editor;

type IPosition = 'left' | 'right' | 'top' | 'bottom';

class ResizePlugin implements IPluginTempl {
  static pluginName = 'ResizePlugin';
  static events = [];
  static apis = [];
  workspaceEl!: HTMLElement;
  // 最小画布尺寸
  minSize = { width: 1, height: 1 };
  // 控制条
  barOpts = {
    bWidth: 30, // 宽
    bHeight: 6, // 高
    bPadding: 10, // 离画布边缘的距离
  };
  hasCreatedBar = false;
  isDragging = false;
  dragEl: HTMLElement | null = null;
  startPoints = { x: 0, y: 0 };
  barOffset = { x: 0, y: 0 };
  wsOffset: Record<'left' | 'top' | 'width' | 'height', number> = {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {
    this._init();
    this._initResizeObserve();
    this._addListeners();
  }

  _init() {
    const workspaceEl = document.querySelector('#workspace') as HTMLElement;
    if (!workspaceEl) {
      throw new Error('element #workspace is missing, plz check!');
    }
    this.workspaceEl = workspaceEl;
  }

  // 初始化监听器
  _initResizeObserve() {
    const resizeObserver = new ResizeObserver(
      throttle(() => {
        this.renderBars();
      }, 50)
    );
    resizeObserver.observe(this.workspaceEl);
  }

  // 渲染控制条具体位置
  renderBars() {
    const viewportTransform = this.canvas.viewportTransform;
    const [scaleX, , , scaleY, offsetX, offsetY] = viewportTransform || [];
    const workspace = this.getWorkspase() as Required<fabric.Rect>;
    const wsWidth = workspace.width * scaleX;
    const wsHeight = workspace.height * scaleY;
    const wsLeft = workspace.left * scaleX;
    const wsTop = workspace.top * scaleY;
    const { bWidth, bHeight, bPadding } = this.barOpts;
    if (!viewportTransform) return;
    // 左控制条
    const leftBar = this._getBarFromType('left');
    leftBar.style.left = `${offsetX + wsLeft - bHeight - bPadding}px`;
    leftBar.style.top = `${offsetY + wsTop + wsHeight / 2 - bWidth / 2}px`;
    // 右控制条
    const rightBar = this._getBarFromType('right');
    rightBar.style.left = `${offsetX + wsLeft + wsWidth + bPadding}px`;
    rightBar.style.top = `${offsetY + wsTop + wsHeight / 2 - bWidth / 2}px`;
    // 上控制条
    const topBar = this._getBarFromType('top');
    topBar.style.left = `${offsetX + wsLeft + wsWidth / 2 - bWidth / 2}px`;
    topBar.style.top = `${offsetY + wsTop - bHeight - bPadding}px`;
    // 下控制条
    const bottomBar = this._getBarFromType('bottom');
    bottomBar.style.left = `${offsetX + wsLeft + wsWidth / 2 - bWidth / 2}px`;
    bottomBar.style.top = `${offsetY + wsTop + wsHeight + bPadding}px`;
    // 监听
    if (!this.hasCreatedBar) {
      this.hasCreatedBar = true;
      this._watchDrag();
    }
  }

  // 获取或创建控制条
  _getBarFromType(type: IPosition) {
    let bar = document.querySelector(`#resize-${type}-bar`) as HTMLElement;
    if (bar) return bar;
    bar = document.createElement('div');
    bar.id = `resize-${type}-bar`;
    bar.className = 'resize-bar';
    if (['left', 'right'].includes(type)) {
      bar.classList.add('horizontal');
    } else {
      bar.classList.add('vertical');
    }
    this.workspaceEl.appendChild(bar);
    return bar;
  }

  // 监听拖拽相关事件
  _watchDrag() {
    const barList = Array.from(document.getElementsByClassName('resize-bar')) as HTMLElement[];
    barList.forEach((bar) => {
      bar.addEventListener('mousedown', (e: MouseEvent) => {
        this.isDragging = true;
        this.dragEl = bar;
        this.dragEl.classList.add('active');
        this.startPoints = {
          x: e.clientX,
          y: e.clientY,
        };
        this.barOffset = {
          x: bar.offsetLeft,
          y: bar.offsetTop,
        };
        const workspace = this.getWorkspase() as Required<fabric.Rect>;
        const { width, height, left, top } = workspace;
        this.wsOffset = { width, height, left, top };
      });
    });
    document.addEventListener('mousemove', this.eventHandler.onDragging);
    document.addEventListener('mouseup', () => {
      if (this.isDragging && this.dragEl) {
        this.isDragging = false;
        this.dragEl.classList.remove('active');
        this.dragEl = null;
        this.canvas.defaultCursor = 'default';
      }
    });
  }

  // 拖拽更新控制条及画布
  onDragging(e: MouseEvent) {
    if (this.isDragging && this.dragEl) {
      const workspace = this.getWorkspase() as Required<fabric.Rect>;
      const viewportTransform = this.canvas.viewportTransform;
      const [scaleX, , , scaleY] = viewportTransform || [];
      const deltaX = e.clientX - this.startPoints.x;
      const deltaY = e.clientY - this.startPoints.y;
      const deltaViewX = deltaX / scaleX;
      const deltaViewY = deltaY / scaleY;
      const type = this.dragEl.id.split('-')[1];
      let tempLength = 0;
      switch (type) {
        case 'left':
          tempLength = Math.round(this.wsOffset.width - deltaViewX * 2);
          if (tempLength >= this.minSize.width) {
            this.dragEl.style.left = `${this.barOffset.x + deltaX}px`;
            workspace.set('left', this.wsOffset.left + deltaViewX * 2);
            workspace.set('width', tempLength);
          } else {
            workspace.set('left', this.wsOffset.left + this.wsOffset.width - this.minSize.width);
            workspace.set('width', this.minSize.width);
          }
          break;
        case 'right':
          tempLength = Math.round(this.wsOffset.width + deltaViewX * 2);
          if (tempLength >= this.minSize.width) {
            this.dragEl.style.left = `${this.barOffset.x + deltaX}px`;
            workspace.set('width', tempLength);
          } else {
            workspace.set('width', this.minSize.width);
          }
          break;
        case 'top':
          tempLength = Math.round(this.wsOffset.height - deltaViewY * 2);
          if (tempLength >= this.minSize.height) {
            this.dragEl.style.top = `${this.barOffset.y + deltaY}px`;
            workspace.set('top', this.wsOffset.top + deltaViewY * 2);
            workspace.set('height', tempLength);
          } else {
            workspace.set('top', this.wsOffset.top + this.wsOffset.height - this.minSize.height);
            workspace.set('height', this.minSize.height);
          }
          break;
        case 'bottom':
          tempLength = Math.round(this.wsOffset.height + deltaViewY * 2);
          if (tempLength >= this.minSize.height) {
            this.dragEl.style.top = `${this.barOffset.y + deltaY}px`;
            workspace.set('height', tempLength);
          } else {
            workspace.set('height', this.minSize.height);
          }
          break;
        default:
          break;
      }

      this.editor.setCenterFromObject(workspace);
      workspace.clone((cloned: fabric.Rect) => {
        this.canvas.clipPath = cloned;
        this.canvas.requestRenderAll();
      });
      if (['left', 'right'].includes(type)) {
        this.canvas.defaultCursor = 'ew-resize';
      } else {
        this.canvas.defaultCursor = 'ns-resize';
      }
      this.editor.emit('sizeChange', workspace.width, workspace.height);
    }
  }

  // 事件句柄缓存
  private eventHandler: Record<string, (...args: any) => void> = {
    render: throttle(this.renderBars.bind(this), 50),
    onDragging: throttle(this.onDragging.bind(this), 30),
  };

  // 监听画布渲染
  _addListeners() {
    this.canvas.on('after:render', this.eventHandler.render);
  }

  // 返回workspace对象
  getWorkspase() {
    return this.canvas.getObjects().find((item) => item.id === 'workspace') as fabric.Rect;
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default ResizePlugin;
