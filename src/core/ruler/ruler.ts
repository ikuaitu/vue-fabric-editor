import type { Canvas } from 'fabric/fabric-impl';

/**
 * 配置
 */
interface Ruler {
  canvas: Canvas;
  ruleSize?: number;
  fontSize?: number;
  enabled?: boolean;
}

class CanvasRuler {
  /**
   * 配置
   */
  private options: Required<Ruler>;

  protected ctx: CanvasRenderingContext2D;

  constructor(_options: Ruler) {
    // 合并默认配置
    this.options = Object.assign(
      {
        ruleSize: 20,
        fontSize: 10,
        enabled: false,
      },
      _options
    );

    this.ctx = _options.canvas.getContext();

    if (this.options.enabled) {
      this.render();
    }
  }

  public enable() {
    this.options.enabled = true;
    this.render();
  }

  public disable() {
    this.options.enabled = false;
    this.options.canvas.renderAll();
    // console.log(this.options.canvas);
  }

  public render() {
    if (!this.options.enabled) return;
    const vpt = this.options.canvas.viewportTransform;
    if (!vpt) return;
    // 绘制尺子
    this.draw({
      isHorizontal: true,
      rulerLength: this.getSize().width,
      startCalibration: -(vpt[4] / vpt[0]),
    });
    this.draw({
      isHorizontal: false,
      rulerLength: this.getSize().height,
      startCalibration: -(vpt[5] / vpt[3]),
    });
    // 绘制左上角的遮罩
    this.drawMask({
      isHorizontal: true,
    });
    this.drawMask({
      isHorizontal: false,
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

    const zoomRatio = this.getLength(zoom);
    const unitLength = rulerLength / zoom;
    let startOffset = -startCalibration;
    const startValue =
      Math[startCalibration > 0 ? 'floor' : 'ceil'](startCalibration / zoomRatio) * zoomRatio;
    startOffset += startValue;

    // 标尺背景样式
    this.ctx.beginPath();
    this.ctx.fillStyle = '#fff';
    this.ctx.strokeStyle = '#ddd';

    // 标尺背景
    this.ctx.rect(
      0,
      0,
      isHorizontal ? rulerLength : this.options.ruleSize,
      isHorizontal ? this.options.ruleSize : rulerLength
    );
    this.ctx.fill('evenodd');
    this.ctx.closePath();
    this.ctx.stroke();

    // 标尺内部样式
    this.ctx.beginPath();
    this.ctx.fillStyle = '#444';
    this.ctx.strokeStyle = '#444';
    this.ctx.lineWidth = 1;
    this.ctx.textBaseline = 'top';
    this.ctx.font = `${this.options.fontSize}px sans-serif`;

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
      // 竖列标尺文字旋转
      if (!isHorizontal) {
        this.ctx.save();
        this.ctx.translate(textX, textY);
        this.ctx.rotate((Math.PI / 180) * -90);
        this.ctx.translate(-textX, -textY);
        this.ctx.fillText(textValue, textX, textY);
        this.ctx.restore();
      } else {
        this.ctx.fillText(textValue, textX, textY);
      }
      i += zoomRatio;
    }

    // 标尺刻度线显示
    for (let j = 0; j + startOffset <= Math.ceil(unitLength); ) {
      const position = Math.round((startOffset + j) * zoom);
      const startX = isHorizontal ? position : this.options.ruleSize - 8;
      const startY = isHorizontal ? this.options.ruleSize - 8 : position;
      const endX = startX + (isHorizontal ? 0 : 8);
      const endY = startY + (isHorizontal ? 8 : 0);
      this.ctx.moveTo(startX, startY);
      this.ctx.lineTo(endX, endY);
      j += zoomRatio;
    }
    this.ctx.closePath();

    this.ctx.stroke();
    // this.ctx.restore();
  }

  private drawMask(opt: { isHorizontal: boolean }) {
    const { isHorizontal } = opt;
    // 创建一个线性渐变对象
    const gradient = isHorizontal
      ? this.ctx.createLinearGradient(
          0,
          this.options.ruleSize / 2,
          this.options.ruleSize * 2,
          this.options.ruleSize / 2
        )
      : this.ctx.createLinearGradient(
          this.options.ruleSize / 2,
          0,
          this.options.ruleSize / 2,
          this.options.ruleSize * 2
        );
    gradient.addColorStop(0, '#fff');
    gradient.addColorStop(0.33, '#fff');
    gradient.addColorStop(0.67, '#fff');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    // 设置填充颜色为线性渐变
    this.ctx.fillStyle = gradient;

    const path = new Path2D();
    if (isHorizontal) {
      path.rect(0, 0, this.options.ruleSize * 2, this.options.ruleSize);
    } else {
      path.rect(0, 0, this.options.ruleSize, this.options.ruleSize * 2);
    }

    // 绘制svg
    this.ctx.fill(path);
  }

  /**
   * 计算尺子长度
   * @param numMarkings 尺子上刻度的数量
   * @returns 返回计算出的尺子长度
   */
  private getLength(numMarkings: number) {
    const markings = [0, 0.02, 0.03, 0.05, 0.1, 0.2, 0.5, 1, 2, 5, 10, 20];
    const lengths = [5000, 5000, 2500, 1000, 500, 250, 100, 50, 25, 10, 5, 2];
    let length = 50;
    markings.some(function (value, index) {
      if (markings[index + 1]) {
        if (value <= numMarkings && markings[index + 1] >= numMarkings) {
          if (markings[index] == numMarkings) {
            length = lengths[index];
          } else if (markings[index + 1] == numMarkings) {
            length = lengths[index + 1];
          } else {
            length = lengths[index];
          }
          return true;
        }
      } else {
        length = lengths[index];
        return true;
      }
    });
    return length;
  }
}

export default CanvasRuler;
