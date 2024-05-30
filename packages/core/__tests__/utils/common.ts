export function wait(time = 0) {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      setTimeout(resolve, time);
    });
  });
}

/**
 * simulate click event
 * @param target
 * @param position position relative to the target
 */
export function MouseDown(target: ExtCanvas, position: { x: number; y: number }) {
  const clientX = target.lastPosX + position.x;
  const clientY = target.lastPosY + position.y;
  target.fire('mouse:down', { e: { clientX: clientX, clientY: clientY } });
}
