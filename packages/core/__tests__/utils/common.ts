export function wait(time = 0) {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, time);
    });
  });
}

/**
 * simulate mouseDown event
 * @param target
 * @param position position relative to the target
 */
export function mouseDown(target: ExtCanvas, position: { x: number; y: number }) {
  const clientX = target.lastPosX + position.x;
  const clientY = target.lastPosY + position.y;
  target.fire('mouse:down', { e: { clientX: clientX, clientY: clientY } });
}

/**
 * simulate mouseMove event
 * @param target
 * @param position
 */

export function mouseMove(target: ExtCanvas, position: { x: number; y: number }) {
  const clientX = position.x;
  const clientY = position.y;
  target.fire('mouse:move', { e: { clientX: clientX, clientY: clientY } });
}

/**
 * simulate mouseUp event
 * @param target
 */

export function mouseUp(target: ExtCanvas) {
  target.fire('mouse:up');
}

export function drag(
  target: ExtCanvas,
  start: { x: number; y: number },
  end: { x: number; y: number },
  step = 5
) {
  mouseDown(target, start);
  mouseMove(target, start);
  if (step !== 0) {
    const xStep = (end.x - start.x) / step;
    const yStep = (end.y - start.y) / step;

    for (const [i] of Array.from({ length: step }).entries()) {
      mouseMove(target, {
        x: xStep * (i + 1),
        y: yStep * (i + 1),
      });
    }
  }

  mouseMove(target, end);
  mouseUp(target);
}
