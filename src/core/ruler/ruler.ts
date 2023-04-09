/* eslint-disable @typescript-eslint/no-explicit-any */
import { Canvas, Point, IEvent } from 'fabric/fabric-impl';
import { fabric } from 'fabric';
import { getGap, mergeLines, darwRect, darwText, darwLine, drawMask } from './utils';
import { throttle } from 'lodash-es';
import { setupGuideLine } from './guideline';

/**
 * 配置
 */
export interface RulerOptions {
  /**
   * Canvas
   */
  canvas: Canvas;

  /**
   * 标尺宽高
   * @default 20
   */
  ruleSize?: number;

  /**
   * 字体大小
   * @default 10
   */
  fontSize?: number;

  /**
   * 是否开启标尺
   * @default false
   */
  enabled?: boolean;

  /**
   * 背景颜色
   */
  backgroundColor?: string;

  /**
   * 文字颜色
   */
  textColor?: string;

  /**
   * 边框颜色
   */
  borderColor?: string;

  /**
   * 高亮颜色
   */
  highlightColor?: string;
}

export type Rect = { left: number; top: number; width: number; height: number };

export type HighlightRect = {
  skip?: 'x' | 'y';
} & Rect;

class CanvasRuler {
  protected ctx: CanvasRenderingContext2D;

  /**
   * 配置
   */
  public options: Required<RulerOptions>;

  /**
   * 标尺起始点
   */
  public startCalibration: undefined | Point;

  private activeOn: 'down' | 'up' = 'up';

  /**
   * 选取对象矩形坐标
   */
  private objectRect:
    | undefined
    | {
        x: HighlightRect[];
        y: HighlightRect[];
      };

  /**
   * 事件句柄缓存
   */
  private eventHandler: Record<string, (...args: any) => void> = {
    // calcCalibration: this.calcCalibration.bind(this),
    calcObjectRect: throttle(this.calcObjectRect.bind(this), 15),
    clearStatus: this.clearStatus.bind(this),
    canvasMouseDown: this.canvasMouseDown.bind(this),
    canvasMouseMove: throttle(this.canvasMouseMove.bind(this), 15),
    canvasMouseUp: this.canvasMouseUp.bind(this),
    render: (e: any) => {
      // 避免多次渲染
      if (!e.ctx) return;
      this.render();
    },
  };

  private lastAttr: {
    status: 'out' | 'horizontal' | 'vertical';
    cursor: string | undefined;
    selection: boolean | undefined;
  } = {
    status: 'out',
    cursor: undefined,
    selection: undefined,
  };

  private tempGuidelLine: fabric.GuideLine | undefined;

  constructor(_options: RulerOptions) {
    // 合并默认配置
    this.options = Object.assign(
      {
        ruleSize: 20,
        fontSize: 10,
        enabled: false,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        highlightColor: '#007fff',
        textColor: '#888',
      },
      _options
    );

    this.ctx = this.options.canvas.getContext();

    fabric.util.object.extend(this.options.canvas, {
      ruler: this,
    });

    setupGuideLine();

    if (this.options.enabled) {
      this.enable();
    }
  }

  // 销毁
  public destroy() {
    this.disable();
  }

  /**
   * 移除全部辅助线
   */
  public clearGuideline() {
    this.options.canvas.remove(...this.options.canvas.getObjects(fabric.GuideLine.prototype.type));
  }

  /**
   * 显示全部辅助线
   */
  public showGuideline() {
    this.options.canvas.getObjects(fabric.GuideLine.prototype.type).forEach((guideLine) => {
      guideLine.set('visible', true);
    });
    this.options.canvas.renderAll();
  }

  /**
   * 隐藏全部辅助线
   */
  public hideGuideline() {
    this.options.canvas.getObjects(fabric.GuideLine.prototype.type).forEach((guideLine) => {
      guideLine.set('visible', false);
    });
    this.options.canvas.renderAll();
  }

  /**
   * 启用
   */
  public enable() {
    this.options.enabled = true;

    // 绑定事件
    this.options.canvas.on('after:render', this.eventHandler.calcObjectRect);
    this.options.canvas.on('after:render', this.eventHandler.render);
    this.options.canvas.on('mouse:down', this.eventHandler.canvasMouseDown);
    this.options.canvas.on('mouse:move', this.eventHandler.canvasMouseMove);
    this.options.canvas.on('mouse:up', this.eventHandler.canvasMouseUp);
    this.options.canvas.on('selection:cleared', this.eventHandler.clearStatus);

    // 显示辅助线
    this.showGuideline();

    // 绘制一次
    this.render();
  }

  /**
   * 禁用
   */
  public disable() {
    // 解除事件
    this.options.canvas.off('after:render', this.eventHandler.calcObjectRect);
    this.options.canvas.off('after:render', this.eventHandler.render);
    this.options.canvas.off('mouse:down', this.eventHandler.canvasMouseDown);
    this.options.canvas.off('mouse:move', this.eventHandler.canvasMouseMove);
    this.options.canvas.off('mouse:up', this.eventHandler.canvasMouseUp);
    this.options.canvas.off('selection:cleared', this.eventHandler.clearStatus);

    // 隐藏辅助线
    this.hideGuideline();

    this.options.enabled = false;
  }

  /**
   * 绘制
   */
  public render() {
    // if (!this.options.enabled) return;
    const vpt = this.options.canvas.viewportTransform;
    if (!vpt) return;
    // 绘制尺子
    this.draw({
      isHorizontal: true,
      rulerLength: this.getSize().width,
      // startCalibration: -(vpt[4] / vpt[0]),
      startCalibration: this.startCalibration?.x ? this.startCalibration.x : -(vpt[4] / vpt[0]),
    });
    this.draw({
      isHorizontal: false,
      rulerLength: this.getSize().height,
      // startCalibration: -(vpt[5] / vpt[3]),
      startCalibration: this.startCalibration?.y ? this.startCalibration.y : -(vpt[5] / vpt[3]),
    });
    // 绘制左上角的遮罩
    drawMask(this.ctx, {
      isHorizontal: true,
      left: -10,
      top: -10,
      width: this.options.ruleSize * 2 + 10,
      height: this.options.ruleSize + 10,
      backgroundColor: this.options.backgroundColor,
    });
    drawMask(this.ctx, {
      isHorizontal: false,
      left: -10,
      top: -10,
      width: this.options.ruleSize + 10,
      height: this.options.ruleSize * 2 + 10,
      backgroundColor: this.options.backgroundColor,
    });
  }

  /**
   * 获取画板尺寸
   */
  private getSize() {
    return {
      width: this.options.canvas.width ?? 0,
      height: this.options.canvas.height ?? 0,
    };
  }

  private getZoom() {
    return this.options.canvas.getZoom();
  }

  private draw(opt: { isHorizontal: boolean; rulerLength: number; startCalibration: number }) {
    const { isHorizontal, rulerLength, startCalibration } = opt;
    const zoom = this.getZoom();

    const gap = getGap(zoom);
    const unitLength = rulerLength / zoom;
    const startValue = Math[startCalibration > 0 ? 'floor' : 'ceil'](startCalibration / gap) * gap;
    const startOffset = startValue - startCalibration;

    // 标尺背景
    const canvasSize = this.getSize();
    darwRect(this.ctx, {
      left: 0,
      top: 0,
      width: isHorizontal ? canvasSize.width : this.options.ruleSize,
      height: isHorizontal ? this.options.ruleSize : canvasSize.height,
      fill: this.options.backgroundColor,
      stroke: this.options.borderColor,
    });

    // 颜色
    const textColor = new fabric.Color(this.options.textColor);
    // 标尺文字显示
    for (let i = 0; i + startOffset <= Math.ceil(unitLength); i += gap) {
      const position = (startOffset + i) * zoom;
      const textValue = startValue + i + '';
      const textLength = (10 * textValue.length) / 4;
      const textX = isHorizontal
        ? position - textLength - 1
        : this.options.ruleSize / 2 - this.options.fontSize / 2 - 4;
      const textY = isHorizontal
        ? this.options.ruleSize / 2 - this.options.fontSize / 2 - 4
        : position + textLength;
      darwText(this.ctx, {
        text: textValue,
        left: textX,
        top: textY,
        fill: textColor.toRgb(),
        angle: isHorizontal ? 0 : -90,
      });
    }

    // 标尺刻度线显示
    for (let j = 0; j + startOffset <= Math.ceil(unitLength); j += gap) {
      const position = Math.round((startOffset + j) * zoom);
      const left = isHorizontal ? position : this.options.ruleSize - 8;
      const top = isHorizontal ? this.options.ruleSize - 8 : position;
      const width = isHorizontal ? 0 : 8;
      const height = isHorizontal ? 8 : 0;
      darwLine(this.ctx, {
        left,
        top,
        width,
        height,
        stroke: textColor.toRgb(),
      });
    }

    // 标尺蓝色遮罩
    if (this.objectRect) {
      const axis = isHorizontal ? 'x' : 'y';
      this.objectRect[axis].forEach((rect) => {
        // 跳过指定矩形
        if (rect.skip === axis) {
          return;
        }

        // 获取数字的值
        const roundFactor = (x: number) => Math.round(x / zoom + startCalibration) + '';
        const leftTextVal = roundFactor(isHorizontal ? rect.left : rect.top);
        const rightTextVal = roundFactor(
          isHorizontal ? rect.left + rect.width : rect.top + rect.height
        );

        const isSameText = leftTextVal === rightTextVal;

        // 背景遮罩
        const maskOpt = {
          isHorizontal,
          width: isHorizontal ? 160 : this.options.ruleSize - 8,
          height: isHorizontal ? this.options.ruleSize - 8 : 160,
          backgroundColor: this.options.backgroundColor,
        };
        drawMask(this.ctx, {
          ...maskOpt,
          left: isHorizontal ? rect.left - 80 : 0,
          top: isHorizontal ? 0 : rect.top - 80,
        });
        if (!isSameText) {
          drawMask(this.ctx, {
            ...maskOpt,
            left: isHorizontal ? rect.width + rect.left - 80 : 0,
            top: isHorizontal ? 0 : rect.height + rect.top - 80,
          });
        }

        // 颜色
        const highlightColor = new fabric.Color(this.options.highlightColor);

        // 高亮遮罩
        highlightColor.setAlpha(0.5);
        darwRect(this.ctx, {
          left: isHorizontal ? rect.left : this.options.ruleSize - 8,
          top: isHorizontal ? this.options.ruleSize - 8 : rect.top,
          width: isHorizontal ? rect.width : 8,
          height: isHorizontal ? 8 : rect.height,
          fill: highlightColor.toRgba(),
        });

        // 两边的数字
        const pad = this.options.ruleSize / 2 - this.options.fontSize / 2 - 4;

        const textOpt = {
          fill: highlightColor.toRgba(),
          angle: isHorizontal ? 0 : -90,
        };

        darwText(this.ctx, {
          ...textOpt,
          text: leftTextVal,
          left: isHorizontal ? rect.left - 2 : pad,
          top: isHorizontal ? pad : rect.top - 2,
          align: isSameText ? 'center' : isHorizontal ? 'right' : 'left',
        });

        if (!isSameText) {
          darwText(this.ctx, {
            ...textOpt,
            text: rightTextVal,
            left: isHorizontal ? rect.left + rect.width + 2 : pad,
            top: isHorizontal ? pad : rect.top + rect.height + 2,
            align: isHorizontal ? 'left' : 'right',
          });
        }

        // 两边的线
        const lineSize = isSameText ? 8 : 14;

        highlightColor.setAlpha(1);

        const lineOpt = {
          width: isHorizontal ? 0 : lineSize,
          height: isHorizontal ? lineSize : 0,
          stroke: highlightColor.toRgba(),
        };

        darwLine(this.ctx, {
          ...lineOpt,
          left: isHorizontal ? rect.left : this.options.ruleSize - lineSize,
          top: isHorizontal ? this.options.ruleSize - lineSize : rect.top,
        });

        if (!isSameText) {
          darwLine(this.ctx, {
            ...lineOpt,
            left: isHorizontal ? rect.left + rect.width : this.options.ruleSize - lineSize,
            top: isHorizontal ? this.options.ruleSize - lineSize : rect.top + rect.height,
          });
        }
      });
    }
    // draw end
  }

  /**
   * 计算起始点
   */
  // private calcCalibration() {
  //   if (this.startCalibration) return;
  //   // console.log('calcCalibration');
  //   const workspace = this.options.canvas.getObjects().find((item: any) => {
  //     return item.id === 'workspace';
  //   });
  //   if (!workspace) return;
  //   const rect = workspace.getBoundingRect(false);
  //   this.startCalibration = new fabric.Point(-rect.left, -rect.top).divide(this.getZoom());
  // }

  private calcObjectRect() {
    const activeObjects = this.options.canvas.getActiveObjects();
    if (activeObjects.length === 0) return;
    const allRect = activeObjects.reduce((rects, obj) => {
      const rect: HighlightRect = obj.getBoundingRect(false, true);
      // 如果是分组单独计算坐标
      if (obj.group) {
        const group = {
          top: 0,
          left: 0,
          width: 0,
          height: 0,
          scaleX: 1,
          scaleY: 1,
          ...obj.group,
        };
        // 计算矩形坐标
        rect.width *= group.scaleX;
        rect.height *= group.scaleY;
        const groupCenterX = group.width / 2 + group.left;
        const objectOffsetFromCenterX = (group.width / 2 + (obj.left ?? 0)) * (1 - group.scaleX);
        rect.left += (groupCenterX - objectOffsetFromCenterX) * this.getZoom();
        const groupCenterY = group.height / 2 + group.top;
        const objectOffsetFromCenterY = (group.height / 2 + (obj.top ?? 0)) * (1 - group.scaleY);
        rect.top += (groupCenterY - objectOffsetFromCenterY) * this.getZoom();
      }
      if (obj instanceof fabric.GuideLine) {
        rect.skip = obj.isHorizontal() ? 'x' : 'y';
      }
      rects.push(rect);
      return rects;
    }, [] as HighlightRect[]);
    if (allRect.length === 0) return;
    this.objectRect = {
      x: mergeLines(allRect, true),
      y: mergeLines(allRect, false),
    };
  }

  /**
   * 清除起始点和矩形坐标
   */
  private clearStatus() {
    // this.startCalibration = undefined;
    this.objectRect = undefined;
  }

  /**
    判断鼠标是否在标尺上
   * @param point 
   * @returns "vertical" | "horizontal" | false
   */
  public isPointOnRuler(point: Point) {
    if (
      new fabric.Rect({
        left: 0,
        top: 0,
        width: this.options.ruleSize,
        height: this.options.canvas.height,
      }).containsPoint(point)
    ) {
      return 'vertical';
    } else if (
      new fabric.Rect({
        left: 0,
        top: 0,
        width: this.options.canvas.width,
        height: this.options.ruleSize,
      }).containsPoint(point)
    ) {
      return 'horizontal';
    }
    return false;
  }

  private canvasMouseDown(e: IEvent<MouseEvent>) {
    if (!e.pointer || !e.absolutePointer) return;
    const hoveredRuler = this.isPointOnRuler(e.pointer);
    if (hoveredRuler && this.activeOn === 'up') {
      // 备份属性
      this.lastAttr.selection = this.options.canvas.selection;
      this.options.canvas.selection = false;
      this.activeOn = 'down';

      this.tempGuidelLine = new fabric.GuideLine(
        hoveredRuler === 'horizontal' ? e.absolutePointer.y : e.absolutePointer.x,
        {
          axis: hoveredRuler,
          visible: false,
        }
      );

      this.options.canvas.add(this.tempGuidelLine);
      this.options.canvas.setActiveObject(this.tempGuidelLine);

      this.options.canvas._setupCurrentTransform(e.e, this.tempGuidelLine, true);

      this.tempGuidelLine.fire('down', this.getCommonEventInfo(e));
    }
  }

  private getCommonEventInfo = (e: IEvent<MouseEvent>) => {
    if (!this.tempGuidelLine || !e.absolutePointer) return;
    return {
      e: e.e,
      transform: this.tempGuidelLine.get('transform'),
      pointer: {
        x: e.absolutePointer.x,
        y: e.absolutePointer.y,
      },
      target: this.tempGuidelLine,
    };
  };

  private canvasMouseMove(e: IEvent<MouseEvent>) {
    if (!e.pointer) return;

    if (this.tempGuidelLine && e.absolutePointer) {
      const pos: Partial<fabric.IGuideLineOptions> = {};
      if (this.tempGuidelLine.axis === 'horizontal') {
        pos.top = e.absolutePointer.y;
      } else {
        pos.left = e.absolutePointer.x;
      }
      this.tempGuidelLine.set({ ...pos, visible: true });

      this.options.canvas.requestRenderAll();

      const event = this.getCommonEventInfo(e);
      this.options.canvas.fire('object:moving', event);
      this.tempGuidelLine.fire('moving', event);
    }

    const hoveredRuler = this.isPointOnRuler(e.pointer);
    if (!hoveredRuler) {
      // 鼠标从里面出去
      if (this.lastAttr.status !== 'out') {
        // 更改鼠标指针
        this.options.canvas.defaultCursor = this.lastAttr.cursor;
        this.lastAttr.status = 'out';
      }
      return;
    }
    // const activeObjects = this.options.canvas.getActiveObjects();
    // if (activeObjects.length === 1 && activeObjects[0] instanceof fabric.GuideLine) {
    //   return;
    // }
    // 鼠标从外边进入 或 在另一侧标尺
    if (this.lastAttr.status === 'out' || hoveredRuler !== this.lastAttr.status) {
      // 更改鼠标指针
      this.lastAttr.cursor = this.options.canvas.defaultCursor;
      this.options.canvas.defaultCursor = hoveredRuler === 'horizontal' ? 'ns-resize' : 'ew-resize';
      this.lastAttr.status = hoveredRuler;
    }
  }

  private canvasMouseUp(e: IEvent<MouseEvent>) {
    if (this.activeOn !== 'down') return;

    // 还原属性
    this.options.canvas.selection = this.lastAttr.selection;
    this.activeOn = 'up';

    this.tempGuidelLine?.fire('up', this.getCommonEventInfo(e));

    this.tempGuidelLine = undefined;
  }
}

export default CanvasRuler;
