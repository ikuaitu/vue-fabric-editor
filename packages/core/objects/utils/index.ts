import { fabric } from 'fabric';

// 获取父级的缩放系数
export const getParentScaleX = (el: any): number => {
    return el.scaleX * (el.group ? getParentScaleX(el.group) : 1)
}

export const notALeftClick = (e: MouseEvent) => {
    return e.button && e.button !== 1;
}

export function AngularDiffSigned(theta1: number, theta2: number) {
    let dif = theta2 - theta1;
    while (dif >= 2 * Math.PI)
        dif -= 2 * Math.PI;
    while (dif <= 0)
        dif += 2 * Math.PI;
    return dif;
}

export function AnglesInClockwiseSequence(x: number, y: number, z: number) {
    return AngularDiffSigned(x, y) + AngularDiffSigned(y, z) < 2 * Math.PI;
}

export function sectorBoundingBox(E: fabric.Point, F: fabric.Point, C: fabric.Point, radius: number) {
    // Put the endpoints into the bounding box:
    let x1 = E.x;
    let y1 = E.y;
    let x2 = x1, y2 = y1;
    if (F.x < x1)
        x1 = F.x;
    if (F.x > x2)
        x2 = F.x;
    if (F.y < y1)
        y1 = F.y;
    if (F.y > y2)
        y2 = F.y;

    // Now consider the top/bottom/left/right extremities of the circle:
    let thetaE = Math.atan2(E.y - C.y, E.x - C.x);
    let thetaF = Math.atan2(F.y - C.y, F.x - C.x);
    if (AnglesInClockwiseSequence(thetaE, 0/*right*/, thetaF)) {
        let x = (C.x + radius);
        if (x > x2)
            x2 = x;
    }
    if (AnglesInClockwiseSequence(thetaE, Math.PI / 2/*bottom*/, thetaF)) {
        let y = (C.y + radius);
        if (y > y2)
            y2 = y;
    }
    if (AnglesInClockwiseSequence(thetaE, Math.PI/*left*/, thetaF)) {
        let x = (C.x - radius);
        if (x < x1)
            x1 = x;
    }
    if (AnglesInClockwiseSequence(thetaE, Math.PI * 3 / 2/*top*/, thetaF)) {
        let y = (C.y - radius);
        if (y < y1)
            y1 = y;
    }
    return { x: x1, y: y1, width: x2 - x1, height: y2 - y1 }
}
