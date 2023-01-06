/*
 * @Author: 秦少卫
 * @Date: 2023-01-06 23:40:09
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-01-07 01:35:50
 * @Description: 线条绘制
 */

import { v4 as uuid } from 'uuid';
import Arrow from "@/core/objects/Arrow";
function initializeLineDrawing (canvas, defaultPosition) {
    let isDrawingLine = false,isDrawingLineMode = false, isArrow = false,
        lineToDraw, pointer, pointerPoints
    canvas.on('mouse:down', (o) => {
        if (!isDrawingLineMode) return

        isDrawingLine = true
        pointer = canvas.getPointer(o.e)
        pointerPoints = [pointer.x, pointer.y, pointer.x, pointer.y]


        const nodeHandler = isArrow ? Arrow : fabric.Line
        lineToDraw = new nodeHandler(pointerPoints, {
            strokeWidth: 2,
            stroke: '#000000',
            ...defaultPosition,
            id: uuid(),
        });

        lineToDraw.selectable = false
        lineToDraw.evented = false
        lineToDraw.strokeUniform = true
        canvas.add(lineToDraw)
    });

    canvas.on('mouse:move', (o) => {
        if (!isDrawingLine) return

        pointer = canvas.getPointer(o.e)

        if (o.e.shiftKey) {
            // calc angle
            let startX = pointerPoints[0]
            let startY = pointerPoints[1]
            let x2 = pointer.x - startX
            let y2 = pointer.y - startY
            let r = Math.sqrt(x2 * x2 + y2 * y2)
            let angle = (Math.atan2(y2, x2) / Math.PI * 180)

            angle = parseInt(((angle + 7.5) % 360) / 15) * 15

            let cosx = r * Math.cos(angle * Math.PI / 180)
            let sinx = r * Math.sin(angle * Math.PI / 180)

            lineToDraw.set({
                x2: cosx + startX,
                y2: sinx + startY
            })

        } else {
            lineToDraw.set({
                x2: pointer.x,
                y2: pointer.y
            })
        }

        canvas.renderAll()

    });

    canvas.on('mouse:up', () => {
        if (!isDrawingLine) return
        lineToDraw.setCoords()
        isDrawingLine = false
    });

    return {
        setArrow(params){
            isArrow = params
        },
        setMode(params){
            isDrawingLineMode = params
        }
    }

}


export default initializeLineDrawing;
