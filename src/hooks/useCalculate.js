/*
 * @Descripttion: useCalculate
 * @version:
 * @Author: wuchenguang1998
 * @Date: 2024-05-18 15:42:17
 * @LastEditors: wuchenguang1998
 * @LastEditTime: 2024-05-18 17:28:34
 */

export default function useCalculate() {
  const canvasEditor = inject('canvasEditor');

  // 获取画布的DOMRect对象
  const getCanvasBound = () => canvasEditor.canvas.getSelectionElement().getBoundingClientRect();

  // 判断拖拽结束的坐标是否在画布外
  const isOutsideCanvas = (x, y) => {
    const { left, right, top, bottom } = getCanvasBound();
    return x < left || x > right || y < top || y > bottom;
  };

  return {
    getCanvasBound,
    isOutsideCanvas,
  };
}
