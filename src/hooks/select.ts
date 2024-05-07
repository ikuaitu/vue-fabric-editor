/*
 * @Descripttion: useSelect(原mixin)  类型待优化
 * @version:
 * @Author: June
 * @Date: 2023-04-23 21:10:05
 * @LastEditors: wuchenguang1998
 * @LastEditTime: 2024-05-04 15:37:06
 */
import Editor from '@kuaitu/core';
interface Selector {
  mSelectMode: SelectMode;
  mSelectOneType: string | undefined;
  mSelectId: string | undefined;
  mSelectIds: (string | undefined)[];
  mSelectActive: unknown[];
}

export default function useSelect() {
  const fabric = inject('fabric');
  const canvasEditor = inject('canvasEditor') as Editor;
  const mixinState = inject('mixinState') as Selector;

  return {
    fabric,
    canvasEditor,
    mixinState,
  };
}
