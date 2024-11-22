/*
 * @Author: 秦少卫
 * @Date: 2023-05-21 08:55:25
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-10 17:32:48
 * @Description: 辅助线功能
 */
import { fabric } from 'fabric';
import { IEditor, IPluginTempl } from '@kuaitu/core';

declare interface VerticalLine {
  x: number;
  y1: number;
  y2: number;
}

declare interface HorizontalLine {
  x1: number;
  x2: number;
  y: number;
}

class AlignGuidLinePlugin implements IPluginTempl {
  defautOption = {
    color: 'rgba(255,95,95,1)',
    width: 1,
  };
  static pluginName = 'AlignGuidLinePlugin';
  dragMode = false;
  constructor(public canvas: fabric.Canvas, public editor: IEditor) {
    this.dragMode = false;
    this.init();
  }
  init() {
    const { canvas } = this;
    const ctx = canvas.getSelectionContext();
    const aligningLineOffset = 5;
    const aligningLineMargin = 4;
    const This = this;
    let viewportTransform: number[] | undefined;
    let zoom = 1;
    let activeWidth = 0;
    let activeHeight = 0;
    let activeLeft = 0;
    let activeTop = 0;

    function drawVerticalLine(coords: VerticalLine) {
      drawLine(
        coords.x + 0.5,
        coords.y1 > coords.y2 ? coords.y2 : coords.y1,
        coords.x + 0.5,
        coords.y2 > coords.y1 ? coords.y2 : coords.y1
      );
    }

    function drawHorizontalLine(coords: HorizontalLine) {
      drawLine(
        coords.x1 > coords.x2 ? coords.x2 : coords.x1,
        coords.y + 0.5,
        coords.x2 > coords.x1 ? coords.x2 : coords.x1,
        coords.y + 0.5
      );
    }

    function drawLine(x1: number, y1: number, x2: number, y2: number) {
      if (viewportTransform == null) return;

      ctx.moveTo(x1 * zoom + viewportTransform[4], y1 * zoom + viewportTransform[5]);
      ctx.lineTo(x2 * zoom + viewportTransform[4], y2 * zoom + viewportTransform[5]);
    }

    function isInRange(value1: number, value2: number) {
      value1 = Math.round(value1);
      value2 = Math.round(value2);
      for (let i = value1 - aligningLineMargin, len = value1 + aligningLineMargin; i <= len; i++) {
        if (i === value2) {
          return true;
        }
      }
      return false;
    }

    let verticalLines: VerticalLine[] = [];
    let horizontalLines: HorizontalLine[] = [];

    canvas.on('mouse:down', (e) => {
      viewportTransform = canvas.viewportTransform;
      zoom = canvas.getZoom();
      try {
        if (e) {
          activeLeft = e.target.left;
          activeTop = e.target.top;
          activeWidth = e.target.getScaledWidth();
          activeHeight = e.target.getScaledHeight();
        }
      } catch (e) {}
    });

    canvas.on('object:moving', (e) => {


      if (viewportTransform === undefined || e.target === undefined) return;

      const activeObject = e.target;
      const canvasObjects = canvas.getObjects();
      const activeObjectCenter = activeObject.getCenterPoint();
      const activeObjectLeft = activeObjectCenter.x;
      const activeObjectTop = activeObjectCenter.y;
      const activeObjectBoundingRect = activeObject.getBoundingRect();
      const activeObjectHeight = activeObject.getScaledHeight();
      const activeObjectWidth = activeObject.getScaledWidth();
      let horizontalInTheRange = false;
      let verticalInTheRange = false;
      const transform = canvas._currentTransform;

      //到达位置
      let reachLeft = false; //左
      let reachTop = false; //上

      //距离
      let _elReachLeft = 0; //左距离
      let _elReachTop = 0; //上距离

      activeObject.set('hasControls', false);

      if (!transform) return;

      for (let i = canvasObjects.length; i--; ) {
        // eslint-disable-next-line no-continue
        if (canvasObjects[i] === activeObject) continue;

        // 排除辅助线
        if (
          activeObject instanceof fabric.GuideLine &&
          canvasObjects[i] instanceof fabric.GuideLine
        ) {
          continue;
        }

        const objectCenter = canvasObjects[i].getCenterPoint();
        const objectLeft = objectCenter.x;
        const objectTop = objectCenter.y;
        const objectBoundingRect = canvasObjects[i].getBoundingRect();
        const objectHeight = objectBoundingRect.height / viewportTransform[3];
        const objectWidth = objectBoundingRect.width / viewportTransform[0];

        // snap by the horizontal center line
        //水平中心线
        if (isInRange(objectLeft, activeObjectLeft)) {
          verticalInTheRange = true;
          verticalLines = [];
          verticalLines.push({
            x: objectLeft,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(objectLeft, activeObjectTop),
            'center',
            'center'
          );
        }

        // snap by the vertical center line
        //垂直中心线
        if (isInRange(objectTop, activeObjectTop)) {
          horizontalInTheRange = true;
          horizontalLines = [];
          horizontalLines.push({
            y: objectTop,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });
          activeObject.setPositionByOrigin(
            new fabric.Point(activeObjectLeft, objectTop),
            'center',
            'center'
          );
        }
        // snap by the left edge
        //左边线
        if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
          verticalInTheRange = true;
          verticalLines = [];
          reachLeft = true;
          verticalLines.push({
            x: objectLeft - objectWidth / 2,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });
          _elReachLeft = objectLeft - objectWidth / 2 + activeObjectWidth / 2;
          let x = objectLeft - objectWidth / 2 + activeObjectWidth / 2;
          let y = reachTop ? _elReachTop : activeObjectTop;

          activeObject.setPositionByOrigin(new fabric.Point(x, y), 'center', 'center');
        }

        // snap by the right edge
        //右边线
        if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
          reachLeft = true;
          verticalInTheRange = true;
          verticalLines = [];
          verticalLines.push({
            x: objectLeft + objectWidth / 2,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });
          _elReachLeft = objectLeft + objectWidth / 2 - activeObjectWidth / 2;
          let x = objectLeft + objectWidth / 2 - activeObjectWidth / 2;
          let y = reachTop ? _elReachTop : activeObjectTop;
          activeObject.setPositionByOrigin(new fabric.Point(x, y), 'center', 'center');
        }

        // snap by the top edge
        //上边线
        if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
          reachTop = true;
          horizontalInTheRange = true;
          horizontalLines = [];
          horizontalLines.push({
            y: objectTop - objectHeight / 2,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });
          _elReachTop = objectTop - objectHeight / 2 + activeObjectHeight / 2;
          let x = reachLeft ? _elReachLeft : activeObjectLeft;
          let y = objectTop - objectHeight / 2 + activeObjectHeight / 2;
          activeObject.setPositionByOrigin(new fabric.Point(x, y), 'center', 'center');
        }

        // snap by the bottom edge
        //底边线
        if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
          reachTop = true;

          horizontalInTheRange = true;
          horizontalLines = [];
          horizontalLines.push({
            y: objectTop + objectHeight / 2,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });
          _elReachTop = objectTop + objectHeight / 2 - activeObjectHeight / 2;
          let x = reachLeft ? _elReachLeft : activeObjectLeft;
          let y = objectTop + objectHeight / 2 - activeObjectHeight / 2;
          activeObject.setPositionByOrigin(new fabric.Point(x, y), 'center', 'center');
        }

        //左边线和右边线
        if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
          reachLeft = true;
          verticalInTheRange = true;
          verticalInTheRange = [];
          verticalLines.push({
            x: objectLeft - objectWidth / 2,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });

          _elReachLeft = objectLeft - objectWidth / 2 - activeObjectWidth / 2;
          let x = objectLeft - objectWidth / 2 - activeObjectWidth / 2;
          let y = activeObjectTop;

          activeObject.setPositionByOrigin(new fabric.Point(x, y), 'center', 'center');
        }
        //右边线和左边线
        if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
          reachLeft = true;
          verticalInTheRange = true;
          verticalInTheRange = [];
          verticalLines.push({
            x: objectLeft + objectWidth / 2,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });
          _elReachLeft = objectLeft + objectWidth / 2 + activeObjectWidth / 2;

          let x = objectLeft + objectWidth / 2 + activeObjectWidth / 2;
          let y = activeObjectTop;

          activeObject.setPositionByOrigin(new fabric.Point(x, y), 'center', 'center');
        }
        //上边线和下边线
        if (isInRange(objectTop - objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
          reachTop = true;
          horizontalInTheRange = true;
          horizontalLines = [];
          horizontalLines.push({
            y: objectTop - objectHeight / 2,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });
          _elReachTop = objectTop - objectHeight / 2 - activeObjectHeight / 2;

          let x = reachLeft ? _elReachLeft : activeObjectLeft;
          let y = objectTop - objectHeight / 2 - activeObjectHeight / 2;
          activeObject.setPositionByOrigin(new fabric.Point(x, y), 'center', 'center');
        }
        //下边线和上变线
        if (isInRange(objectTop + objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
          reachTop = true;
          horizontalInTheRange = true;
          horizontalLines = [];
          horizontalLines.push({
            y: objectTop + objectHeight / 2,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });
          _elReachTop = objectTop + objectHeight / 2 + activeObjectHeight / 2;
          let x = reachLeft ? _elReachLeft : activeObjectLeft;
          let y = objectTop + objectHeight / 2 + activeObjectHeight / 2;
          activeObject.setPositionByOrigin(new fabric.Point(x, y), 'center', 'center');
        }
      }

      if (!horizontalInTheRange) {
        horizontalLines.length = 0;
      }

      if (!verticalInTheRange) {
        verticalLines.length = 0;
      }
    });

    canvas.on('before:render', () => {
      // fix 保存图片时报错
      if (canvas.contextTop === null) {
        return;
      }
      try {
        canvas.clearContext(canvas.contextTop);
      } catch (error) {
        console.log(error);
      }
    });


    canvas.on('object:scaling', (e) => {


      if (viewportTransform === undefined || e.target === undefined) return;

      const activeObject = e.target;
      const canvasObjects = canvas.getObjects();
      const activeObjectCenter = activeObject.getCenterPoint();
      const activeObjectLeft = activeObjectCenter.x;
      const activeObjectTop = activeObjectCenter.y;
      const activeObjectBoundingRect = activeObject.getBoundingRect();
      const activeObjectHeight = activeObject.getScaledHeight();
      const activeObjectWidth = activeObject.getScaledWidth();
      let horizontalInTheRange = false;
      let verticalInTheRange = false;
      const transform = canvas._currentTransform;

      activeObject.set('hasControls', false);
      if (!transform) return;

      for (let i = canvasObjects.length; i--; ) {
        // eslint-disable-next-line no-continue
        if (canvasObjects[i] === activeObject) continue;

        // 排除辅助线
        if (
          activeObject instanceof fabric.GuideLine &&
          canvasObjects[i] instanceof fabric.GuideLine
        ) {
          continue;
        }

        const objectCenter = canvasObjects[i].getCenterPoint();
        const objectLeft = objectCenter.x;
        const objectTop = objectCenter.y;
        const objectBoundingRect = canvasObjects[i].getBoundingRect();
        const objectHeight = objectBoundingRect.height / viewportTransform[3];
        const objectWidth = objectBoundingRect.width / viewportTransform[0];

        // snap by the horizontal center line
        //水平中心线
        if (isInRange(objectLeft, activeObjectLeft)) {
          verticalInTheRange = true;
          verticalLines = [];
          verticalLines.push({
            x: objectLeft,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });
        }

        // snap by the left edge
        //左边线
        if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
          verticalInTheRange = true;
          verticalLines = [];
          verticalLines.push({
            x: objectLeft - objectWidth / 2,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });

          let leftRight = new Map([
            ['bl', 1],
            ['ml', 1],
            ['tl', 1],
          ]);
          if (leftRight.get(e.transform.corner)) {
            activeObject.setPositionByOrigin(
              new fabric.Point(
                objectLeft - objectWidth / 2 + activeObjectWidth / 2,
                activeObjectTop
              ),
              'center',
              'center'
            );

            activeObject.set(
              'scaleX',
              ((activeLeft - (objectLeft - objectWidth / 2) + activeWidth) * activeObject.scaleX) /
              activeObject.getScaledWidth()
            );
            break;
          }
        }

        // snap by the right edge
        //右边线
        if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
          verticalInTheRange = true;
          verticalLines = [];
          verticalLines.push({
            x: objectLeft + objectWidth / 2,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });

          let Right = new Map([
            ['mr', 1],
            ['tr', 1],
            ['br', 1],
          ]);

          if (Right.get(e.transform.corner)) {
            activeObject.set(
              'scaleX',
              ((objectLeft + objectWidth / 2 - (activeLeft + activeWidth) + activeWidth) *
                activeObject.scaleX) /
              activeObject.getScaledWidth()
            );
            break;
          }
        }

        // snap by the vertical center line
        //垂直中心线
        if (isInRange(objectTop, activeObjectTop)) {
          horizontalInTheRange = true;
          horizontalLines = [];
          horizontalLines.push({
            y: objectTop,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });
        }

        // snap by the top edge
        if (isInRange(objectTop - objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
          horizontalInTheRange = true;
          horizontalLines = [];
          horizontalLines.push({
            y: objectTop - objectHeight / 2,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });

          let bottomRight = new Map([
            ['tr', 1],
            ['tl', 1],
            ['mt', 1],
          ]);

          if (bottomRight.get(e.transform.corner)) {
            activeObject.setPositionByOrigin(
              new fabric.Point(
                activeObjectLeft,
                objectTop - objectHeight / 2 + activeObjectHeight / 2
              ),
              'center',
              'center'
            );

            activeObject.set(
              'scaleY',
              ((activeTop + activeHeight - (objectTop - objectHeight / 2)) * activeObject.scaleY) /
              activeObject.getScaledHeight()
            );
            break;
          }
        }

        // snap by the bottom edge
        if (isInRange(objectTop + objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
          horizontalInTheRange = true;
          horizontalLines = [];
          horizontalLines.push({
            y: objectTop + objectHeight / 2,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });

          let bottom = new Map([
            ['mb', 1],
            ['bl', 1],
            ['br', 1],
          ]);
          if (bottom.get(e.transform.corner)) {
            activeObject.set(
              'scaleY',
              ((objectTop + objectHeight / 2 - (activeTop + activeHeight) + activeHeight) *
                activeObject.scaleY) /
              activeObject.getScaledHeight()
            );
            break;
          }
        }

        //左边线和右边线
        if (isInRange(objectLeft - objectWidth / 2, activeObjectLeft + activeObjectWidth / 2)) {
          verticalInTheRange = true;
          verticalLines = [];
          verticalLines.push({
            x: objectLeft - objectWidth / 2,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });

          let right = new Map([
            ['mr', 1],
            ['tr', 1],
            ['br', 1],
          ]);
          if (right.get(e.transform.corner)) {
            activeObject.set(
              'scaleX',
              ((objectLeft - objectWidth / 2 - activeObject.left) * activeObject.scaleX) /
              activeObject.getScaledWidth()
            );
            break;
          }
        }
        //右边线和左边线
        if (isInRange(objectLeft + objectWidth / 2, activeObjectLeft - activeObjectWidth / 2)) {
          verticalInTheRange = true;
          verticalLines = [];
          verticalLines.push({
            x: objectLeft + objectWidth / 2,
            y1:
              objectTop < activeObjectTop
                ? objectTop - objectHeight / 2 - aligningLineOffset
                : objectTop + objectHeight / 2 + aligningLineOffset,
            y2:
              activeObjectTop > objectTop
                ? activeObjectTop + activeObjectHeight / 2 + aligningLineOffset
                : activeObjectTop - activeObjectHeight / 2 - aligningLineOffset,
          });

          let leftRight = new Map([
            ['bl', 1],
            ['ml', 1],
            ['tl', 1],
          ]);
          if (leftRight.get(e.transform.corner)) {
            activeObject.setPositionByOrigin(
              new fabric.Point(
                objectLeft + objectWidth / 2 + activeObjectWidth / 2,
                activeObjectTop
              ),
              'center',
              'center'
            );

            activeObject.set(
              'scaleX',
              ((activeLeft + activeWidth - (objectLeft + objectWidth / 2)) * activeObject.scaleX) /
              activeObject.getScaledWidth()
            );
            break;
          }
        }
        //上边线和下边线
        if (isInRange(objectTop - objectHeight / 2, activeObjectTop + activeObjectHeight / 2)) {
          horizontalInTheRange = true;
          horizontalLines = [];
          horizontalLines.push({
            y: objectTop - objectHeight / 2,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });

          let bottom = new Map([
            ['mb', 1],
            ['bl', 1],
            ['br', 1],
          ]);
          if (bottom.get(e.transform.corner)) {
            activeObject.set(
              'scaleY',
              ((objectTop - objectHeight / 2 - activeObject.top) * activeObject.scaleY) /
              activeObject.getScaledHeight()
            );
            break;
          }
        }
        //下边线和上变线
        if (isInRange(objectTop + objectHeight / 2, activeObjectTop - activeObjectHeight / 2)) {
          horizontalInTheRange = true;
          horizontalLines = [];
          horizontalLines.push({
            y: objectTop + objectHeight / 2,
            x1:
              objectLeft < activeObjectLeft
                ? objectLeft - objectWidth / 2 - aligningLineOffset
                : objectLeft + objectWidth / 2 + aligningLineOffset,
            x2:
              activeObjectLeft > objectLeft
                ? activeObjectLeft + activeObjectWidth / 2 + aligningLineOffset
                : activeObjectLeft - activeObjectWidth / 2 - aligningLineOffset,
          });

          let bottomRight = new Map([
            ['tr', 1],
            ['tl', 1],
            ['mt', 1],
          ]);

          if (bottomRight.get(e.transform.corner)) {
            activeObject.setPositionByOrigin(
              new fabric.Point(
                activeObjectLeft,
                objectTop + objectHeight / 2 + activeObjectHeight / 2
              ),
              'center',
              'center'
            );

            activeObject.set(
              'scaleY',
              ((activeTop + activeHeight - (objectTop + objectHeight / 2)) * activeObject.scaleY) /
              activeObject.getScaledHeight()
            );

            break;
          }
        }
      }

      if (!horizontalInTheRange) {
        horizontalLines.length = 0;
      }

      if (!verticalInTheRange) {
        verticalLines.length = 0;
      }
    });
    canvas.on('after:render', () => {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = This.defautOption.width;
      ctx.strokeStyle = This.defautOption.color;

      for (let i = verticalLines.length; i--; ) {
        if (verticalLines[i]) {
          drawVerticalLine(verticalLines[i]);
        }
      }
      for (let j = horizontalLines.length; j--; ) {
        if (horizontalLines[j]) {
          drawHorizontalLine(horizontalLines[j]);
        }
      }
      ctx.stroke();
      ctx.restore();

      // noinspection NestedAssignmentJS
      verticalLines.length = 0;
      horizontalLines.length = 0;
    });

    canvas.on('mouse:up', (e) => {
      const activeObject = e.target;
      if (activeObject && activeObject.selectable && !activeObject.lockRotation) {
        activeObject.set('hasControls', true);
      }
      verticalLines.length = 0;
      horizontalLines.length = 0;
      canvas.renderAll();
    });
  }

  destroy() {
    console.log('pluginDestroy');
  }
}

export default AlignGuidLinePlugin;
