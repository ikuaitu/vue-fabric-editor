/*
 * @Author: 秦少卫
 * @Date: 2023-01-09 22:49:02
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-08 00:20:26
 * @Description: 控制条样式
 */

import { fabric } from 'fabric';
import verticalImg from '@/assets/editor/middlecontrol.svg';
import horizontalImg from '@/assets/editor/middlecontrolhoz.svg';
import edgeImg from '@/assets/editor/edgecontrol.svg';
import rotateImg from '@/assets/editor/rotateicon.svg';

// 中间横杠
function intervalControl() {
  const verticalImgIcon = document.createElement('img');
  verticalImgIcon.src = verticalImg;

  const horizontalImgIcon = document.createElement('img');
  horizontalImgIcon.src = horizontalImg;

  function renderIcon(ctx, left, top, styleOverride, fabricObject) {
    const wsize = 20;
    const hsize = 25;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(verticalImgIcon, -wsize / 2, -hsize / 2, wsize, hsize);
    ctx.restore();
  }

  function renderIconHoz(ctx, left, top, styleOverride, fabricObject) {
    const wsize = 25;
    const hsize = 20;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(horizontalImgIcon, -wsize / 2, -hsize / 2, wsize, hsize);
    ctx.restore();
  }
  // 中间横杠
  fabric.Object.prototype.controls.ml = new fabric.Control({
    x: -0.5,
    y: 0,
    offsetX: -1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIcon,
  });

  fabric.Object.prototype.controls.mr = new fabric.Control({
    x: 0.5,
    y: 0,
    offsetX: 1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingXOrSkewingY,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIcon,
  });

  fabric.Object.prototype.controls.mb = new fabric.Control({
    x: 0,
    y: 0.5,
    offsetY: 1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIconHoz,
  });

  fabric.Object.prototype.controls.mt = new fabric.Control({
    x: 0,
    y: -0.5,
    offsetY: -1,
    cursorStyleHandler: fabric.controlsUtils.scaleSkewCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingYOrSkewingX,
    getActionName: fabric.controlsUtils.scaleOrSkewActionName,
    render: renderIconHoz,
  });
}

// 顶点
function peakControl() {
  const img = document.createElement('img');
  img.src = edgeImg;

  function renderIconEdge(ctx, left, top, styleOverride, fabricObject) {
    const wsize = 25;
    const hsize = 25;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img, -wsize / 2, -hsize / 2, wsize, hsize);
    ctx.restore();
  }
  // 四角图标
  fabric.Object.prototype.controls.tl = new fabric.Control({
    x: -0.5,
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge,
  });
  fabric.Object.prototype.controls.bl = new fabric.Control({
    x: -0.5,
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge,
  });
  fabric.Object.prototype.controls.tr = new fabric.Control({
    x: 0.5,
    y: -0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge,
  });
  fabric.Object.prototype.controls.br = new fabric.Control({
    x: 0.5,
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.scaleCursorStyleHandler,
    actionHandler: fabric.controlsUtils.scalingEqually,
    render: renderIconEdge,
  });
}
// 删除
function deleteControl(canvas) {
  const deleteIcon =
    "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";
  const delImg = document.createElement('img');
  delImg.src = deleteIcon;

  function renderDelIcon(ctx, left, top, styleOverride, fabricObject) {
    const size = this.cornerSize;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(delImg, -size / 2, -size / 2, size, size);
    ctx.restore();
  }

  // 删除选中元素
  function deleteObject() {
    const activeObject = canvas.getActiveObjects();
    if (activeObject) {
      activeObject.map((item) => canvas.remove(item));
      canvas.requestRenderAll();
      canvas.discardActiveObject();
    }
  }

  // 删除图标
  fabric.Object.prototype.controls.deleteControl = new fabric.Control({
    x: 0.5,
    y: -0.5,
    offsetY: -16,
    offsetX: 16,
    cursorStyle: 'pointer',
    mouseUpHandler: deleteObject,
    render: renderDelIcon,
    cornerSize: 24,
  });
}

// 旋转
function rotationControl() {
  const img = document.createElement('img');
  img.src = rotateImg;
  function renderIconRotate(ctx, left, top, styleOverride, fabricObject) {
    const wsize = 40;
    const hsize = 40;
    ctx.save();
    ctx.translate(left, top);
    ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
    ctx.drawImage(img, -wsize / 2, -hsize / 2, wsize, hsize);
    ctx.restore();
  }
  // 旋转图标
  fabric.Object.prototype.controls.mtr = new fabric.Control({
    x: 0,
    y: 0.5,
    cursorStyleHandler: fabric.controlsUtils.rotationStyleHandler,
    actionHandler: fabric.controlsUtils.rotationWithSnapping,
    offsetY: 30,
    withConnecton: false,
    actionName: 'rotate',
    render: renderIconRotate,
  });
}

function initControls(canvas) {
  // 删除图标
  deleteControl(canvas);
  // 顶点图标
  peakControl(canvas);
  // 中间横杠图标
  intervalControl(canvas);
  // 旋转图标
  rotationControl(canvas);

  // 选中样式
  fabric.Object.prototype.set({
    transparentCorners: false,
    borderColor: '#51B9F9',
    cornerColor: '#FFF',
    borderScaleFactor: 2.5,
    cornerStyle: 'circle',
    cornerStrokeColor: '#0E98FC',
    borderOpacityWhenMoving: 1,
  });
}

export default initControls;
