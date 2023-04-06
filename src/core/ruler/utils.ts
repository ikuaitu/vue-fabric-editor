import type { Rect } from './ruler';

/**
 * 计算尺子长度
 * @param numMarkings 尺子上刻度的数量
 * @returns 返回计算出的尺子长度
 */
const getLength = (numMarkings: number) => {
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
};

/**
 * 线段合并
 * @param rect Rect数组
 * @param isHorizontal
 * @returns 合并后的Rect数组
 */
const mergeLines = (rect: Rect[], isHorizontal: boolean) => {
  const axis = isHorizontal ? 'left' : 'top';
  const length = isHorizontal ? 'width' : 'height';
  // 先按照 axis 的大小排序
  rect.sort((a, b) => a[axis] - b[axis]);
  const mergedLines = [];
  let currentLine = Object.assign({}, rect[0]);
  for (let i = 1; i < rect.length; i++) {
    const line = Object.assign({}, rect[i]);
    if (currentLine[axis] + currentLine[length] >= line[axis]) {
      // 当前线段和下一个线段相交，合并宽度
      currentLine[length] =
        Math.max(currentLine[axis] + currentLine[length], line[axis] + line[length]) -
        currentLine[axis];
    } else {
      // 当前线段和下一个线段不相交，将当前线段加入结果数组中，并更新当前线段为下一个线段
      mergedLines.push(currentLine);
      currentLine = Object.assign({}, line);
    }
  }
  // 加入数组
  mergedLines.push(currentLine);
  return mergedLines;
};

const darwLine = (
  ctx: CanvasRenderingContext2D,
  options: {
    left: number;
    top: number;
    width: number;
    height: number;
    stroke?: string | CanvasGradient | CanvasPattern;
    lineWidth?: number;
  }
) => {
  const { left, top, width, height, stroke, lineWidth } = options;
  ctx.beginPath();
  stroke && (ctx.strokeStyle = stroke);
  ctx.lineWidth = lineWidth ?? 1;
  ctx.moveTo(left, top);
  ctx.lineTo(width, height);
  ctx.stroke();
};

const darwText = (
  ctx: CanvasRenderingContext2D,
  options: {
    left: number;
    top: number;
    text: string;
    fill?: string | CanvasGradient | CanvasPattern;
    align?: CanvasTextAlign;
    angle?: number;
    fontSize?: number;
  }
) => {
  const { left, top, text, fill, align, angle, fontSize } = options;
  fill && (ctx.fillStyle = fill);
  ctx.textAlign = align ?? 'left';
  ctx.textBaseline = 'top';
  ctx.font = `${fontSize ?? 10}px sans-serif`;
  if (angle) {
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate((Math.PI / 180) * angle);
    ctx.translate(-left, -top);
    ctx.fillText(text, left, top);
    ctx.restore();
  } else {
    ctx.fillText(text, left, top);
  }
};

const darwRect = (
  ctx: CanvasRenderingContext2D,
  options: {
    left: number;
    top: number;
    width: number;
    height: number;
    fill?: string | CanvasGradient | CanvasPattern;
    stroke?: string;
    strokeWidth?: number;
  }
) => {
  const { left, top, width, height, fill, stroke, strokeWidth } = options;
  ctx.beginPath();
  fill && (ctx.fillStyle = fill);
  ctx.rect(left, top, width, height);
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth ?? 1;
    ctx.stroke();
  }
};

export { getLength, mergeLines, darwRect, darwText, darwLine };
