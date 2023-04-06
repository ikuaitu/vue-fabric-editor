/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Canvas, Point } from 'fabric/fabric-impl';
import { fabric } from 'fabric';
import { getLength, mergeLines, darwRect, darwText, darwLine } from './utils';
import { throttle } from 'lodash-es';

/**
 * 配置
 */
export interface RulerOptions {
  canvas: Canvas;
  ruleSize?: number;
  fontSize?: number;
  enabled?: boolean;

  backgroundColor?: string;
  textColor?: string;
  borderColor?: string;
  highlightColor?: string;
}

export type Rect = { left: number; top: number; width: number; height: number };

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

  /**
   * 选取对象矩形坐标
   */
  private objectRect:
    | undefined
    | {
        x: Rect[];
        y: Rect[];
      };

  /**
   * 事件句柄缓存
   */
  private eventHandler: Record<string, (...args: any) => void> = {
    // calcCalibration: this.calcCalibration.bind(this),
    calcObjectRect: throttle(this.calcObjectRect.bind(this), 15),
    clearStatus: this.clearStatus.bind(this),
    render: (e: any) => {
      // 避免多次渲染
      if (!e.ctx) return;
      // const startTime = performance.now();
      this.render();
      // const endTime = performance.now();
      // console.log(endTime - startTime + 'ms');
    },
  };

  constructor(_options: RulerOptions) {
    // 合并默认配置
    this.options = Object.assign(
      {
        ruleSize: 20,
        fontSize: 10,
        enabled: false,
        backgroundColor: '#fff',
        borderColor: '#ddd',
        highlightColor: '#4166ff',
        textColor: '#888',
      },
      _options
    );

    this.ctx = _options.canvas.getContext();

    fabric.util.object.extend(this.options.canvas, {
      ruler: this,
    });

    if (this.options.enabled) {
      this.enable();
    }
  }

  // 销毁
  public destroy() {
    this.disable();
  }

  public enable() {
    this.options.enabled = true;
    this.render();
    // this.calcCalibration();
    // this.calcObjectRect();

    this.options.canvas.on('after:render', this.eventHandler.calcObjectRect);
    this.options.canvas.on('after:render', this.eventHandler.render);
    // this.options.canvas.on('selection:created', this.eventHandler.calcCalibration);
    this.options.canvas.on('selection:cleared', this.eventHandler.clearStatus);
  }

  public disable() {
    this.options.canvas.off('after:render', this.eventHandler.calcObjectRect);
    this.options.canvas.off('after:render', this.eventHandler.render);
    // this.options.canvas.off('selection:created', this.eventHandler.calcCalibration);
    this.options.canvas.off('selection:cleared', this.eventHandler.clearStatus);

    this.options.enabled = false;
    this.options.canvas.renderAll();
  }

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
    this.drawMask({
      isHorizontal: true,
      left: -10,
      top: -10,
      width: this.options.ruleSize * 2 + 10,
      height: this.options.ruleSize + 10,
    });
    this.drawMask({
      isHorizontal: false,
      left: -10,
      top: -10,
      width: this.options.ruleSize + 10,
      height: this.options.ruleSize * 2 + 10,
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

    const zoomRatio = getLength(zoom);
    const unitLength = rulerLength / zoom;
    let startOffset = -startCalibration;
    const startValue =
      Math[startCalibration > 0 ? 'floor' : 'ceil'](startCalibration / zoomRatio) * zoomRatio;
    startOffset += startValue;

    // 标尺背景
    const canvasSize = this.getSize();
    darwRect(this.ctx, {
      left: 0,
      top: 0,
      width: isHorizontal ? canvasSize.width : this.options.ruleSize,
      height: isHorizontal ? this.options.ruleSize : canvasSize.height,
      fill: this.options.backgroundColor,
      stroke: this.options.borderColor,
      strokeWidth: 1,
    });

    // 文字配置
    // const textOptions: fabric.TextOptions = {
    //   fontSize: this.options.fontSize,
    //   fontFamily: 'sans-serif',
    //   angle: isHorizontal ? 0 : -90,
    // };
    // 颜色
    const textColor = new fabric.Color(this.options.textColor);
    // 标尺文字显示
    for (let i = 0; i + startOffset <= Math.ceil(unitLength); ) {
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
      i += zoomRatio;
    }

    // 标尺刻度线显示
    for (let j = 0; j + startOffset <= Math.ceil(unitLength); ) {
      const position = Math.round((startOffset + j) * zoom);
      const left = isHorizontal ? position : this.options.ruleSize - 8;
      const top = isHorizontal ? this.options.ruleSize - 8 : position;
      const width = left + (isHorizontal ? 0 : 8);
      const height = top + (isHorizontal ? 8 : 0);
      darwLine(this.ctx, {
        left,
        top,
        width,
        height,
        stroke: textColor.toRgb(),
      });
      j += zoomRatio;
    }

    // 标尺蓝色遮罩
    if (this.objectRect) {
      this.objectRect[isHorizontal ? 'x' : 'y'].forEach((rect) => {
        // 背景遮罩
        this.drawMask({
          isHorizontal,
          left: isHorizontal ? rect.left - 80 : 0,
          top: isHorizontal ? 0 : rect.top - 80,
          width: isHorizontal ? 160 : this.options.ruleSize - 8,
          height: isHorizontal ? this.options.ruleSize - 8 : 160,
        });
        this.drawMask({
          isHorizontal,
          left: isHorizontal ? rect.width + rect.left - 80 : 0,
          top: isHorizontal ? 0 : rect.height + rect.top - 80,
          width: isHorizontal ? 160 : this.options.ruleSize - 8,
          height: isHorizontal ? this.options.ruleSize - 8 : 160,
        });
        // 颜色
        const highlightColor = new fabric.Color(this.options.highlightColor);
        // 蓝色遮罩
        highlightColor.setAlpha(0.5);
        darwRect(this.ctx, {
          left: isHorizontal ? rect.left : this.options.ruleSize - 8,
          top: isHorizontal ? this.options.ruleSize - 8 : rect.top,
          width: isHorizontal ? rect.width : 8,
          height: isHorizontal ? 8 : rect.height,
          fill: highlightColor.toRgba(),
        });
        // 两边的线
        highlightColor.setAlpha(1);
        darwLine(this.ctx, {
          left: isHorizontal ? rect.left : 6,
          top: isHorizontal ? 6 : rect.top,
          width: isHorizontal ? rect.left : this.options.ruleSize,
          height: isHorizontal ? this.options.ruleSize : rect.top,
          stroke: highlightColor.toRgba(),
        });
        darwLine(this.ctx, {
          left: isHorizontal ? rect.left + rect.width : 6,
          top: isHorizontal ? 6 : rect.top + rect.height,
          width: isHorizontal ? rect.left + rect.width : this.options.ruleSize,
          height: isHorizontal ? this.options.ruleSize : rect.top + rect.height,
          stroke: highlightColor.toRgba(),
        });
        // 两边的数字
        const pad = this.options.ruleSize / 2 - this.options.fontSize / 2 - 4;
        darwText(this.ctx, {
          text: Math.floor(
            (isHorizontal ? rect.left : rect.top) / zoom + startCalibration
          ).toString(),
          left: isHorizontal ? rect.left - 2 : pad,
          top: isHorizontal ? pad : rect.top - 2,
          fill: highlightColor.toRgba(),
          angle: isHorizontal ? 0 : -90,
          align: isHorizontal ? 'right' : 'left',
        });
        darwText(this.ctx, {
          text: Math.floor(
            (isHorizontal ? rect.left + rect.width : rect.top + rect.height) / zoom +
              startCalibration
          ).toString(),
          left: isHorizontal ? rect.left + rect.width + 2 : pad,
          top: isHorizontal ? pad : rect.top + rect.height + 2,
          fill: highlightColor.toRgba(),
          angle: isHorizontal ? 0 : -90,
          align: isHorizontal ? 'left' : 'right',
        });
      });
    }
    // draw end
  }

  private drawMask(opt: {
    isHorizontal: boolean;
    left: number;
    top: number;
    width: number;
    height: number;
  }) {
    const { isHorizontal, left: x, top: y, width, height } = opt;
    // 创建一个线性渐变对象
    const gradient = isHorizontal
      ? this.ctx.createLinearGradient(x, height / 2, x + width, height / 2)
      : this.ctx.createLinearGradient(width / 2, y, width / 2, height + y);
    const transparentColor = new fabric.Color(this.options.backgroundColor);
    transparentColor.setAlpha(0);
    gradient.addColorStop(0, transparentColor.toRgba());
    gradient.addColorStop(0.33, this.options.backgroundColor);
    gradient.addColorStop(0.67, this.options.backgroundColor);
    gradient.addColorStop(1, transparentColor.toRgba());
    darwRect(this.ctx, {
      left: x,
      top: y,
      width,
      height,
      fill: gradient,
    });
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
      const rect = obj.getBoundingRect(false, true);
      // 如果是分组单独计算坐标
      if (obj.group) {
        const { group } = obj;
        // 默认值
        group.top = group.top ?? 0;
        group.left = group.left ?? 0;
        group.width = group.width ?? 0;
        group.height = group.height ?? 0;
        group.scaleX = group.scaleX ?? 1;
        group.scaleY = group.scaleY ?? 1;
        obj.top = obj.top ?? 0;
        obj.left = obj.left ?? 0;
        // 计算矩形坐标
        rect.width *= group.scaleX;
        rect.height *= group.scaleY;
        const groupCenterX = group.width / 2 + group.left;
        const objectOffsetFromGroupCenterX = (group.width / 2 + obj.left) * (1 - group.scaleX);
        rect.left += (groupCenterX - objectOffsetFromGroupCenterX) * this.getZoom();
        const groupCenterY = group.height / 2 + group.top;
        const objectOffsetFromGroupCenterY = (obj.top + group.height / 2) * (1 - group.scaleY);
        rect.top += (groupCenterY - objectOffsetFromGroupCenterY) * this.getZoom();
      }
      rects.push(rect);
      return rects;
    }, [] as Rect[]);
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
}

export default CanvasRuler;
