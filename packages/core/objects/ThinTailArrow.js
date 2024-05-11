/*
 * @Author: wuchenguang1998
 * @Date: 2024-05-10 10:46:10
 * @LastEditors: wuchenguang1998
 * @LastEditTime: 2024-05-10 22:08:51
 * @Description: 细尾箭头，支持控制条拖拽不变形
 */
import { fabric } from 'fabric';

fabric.ThinTailArrow = fabric.util.createClass(fabric.Line, {
  type: 'thinTailArrow',
  superType: 'drawing',
  initialize(points, options) {
    if (!points) {
      const { x1, x2, y1, y2 } = options;
      points = [x1, y1, x2, y2];
    }
    options = options || {};
    this.callSuper('initialize', points, options);
  },
  _render(ctx) {
    ctx.save();
    // 乘或除对应的scaleX(Y)，抵消元素放缩造成的影响，使箭头不会变形
    ctx.scale(1 / this.scaleX, 1 / this.scaleY);
    const xDiff = (this.x2 - this.x1) * this.scaleX;
    const yDiff = (this.y2 - this.y1) * this.scaleY;
    ctx.translate(-xDiff / 2, -yDiff / 2);
    // 箭头方位角
    const angle = Math.atan2(yDiff, xDiff);
    ctx.rotate(angle);
    // 箭头总长(最小长度是20)
    let length = Math.hypot(xDiff, yDiff);
    length = length < 20 ? 20 : length;
    // 绘制箭头
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(length - 18, -5);
    ctx.lineTo(length - 20, -12);
    ctx.lineTo(length, 0);
    ctx.lineTo(length - 20, 12);
    ctx.lineTo(length - 18, 5);
    ctx.lineTo(0, 0);
    ctx.lineWidth = this.strokeWidth;
    ctx.strokeStyle = this.stroke;
    ctx.fillStyle = this.fill;
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  },
});

fabric.ThinTailArrow.fromObject = (options, callback) => {
  const { x1, x2, y1, y2 } = options;
  return callback(new fabric.ThinTailArrow([x1, y1, x2, y2], options));
};

export default fabric.ThinTailArrow;
