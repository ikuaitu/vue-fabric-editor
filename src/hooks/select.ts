/*
 * @Descripttion: useSelect(原mixin)  类型待优化
 * @version:
 * @Author: June
 * @Date: 2023-04-23 21:10:05
 * @LastEditors: June
 * @LastEditTime: 2023-05-08 18:20:21
 */
import { inject, reactive } from 'vue';
// import { SelectMode, SelectOneType } from '@/utils/event/types';

// interface Selector {
//   mSelectMode: SelectMode;
//   mSelectOneType: SelectOneType;
//   mSelectId: string[] | '';
//   mSelectIds: string[];
//   mSelectActive: unknown[];
// }

export default function useSelect() {
  // const state = reactive<Selector>({
  //   mSelectMode: SelectMode.EMPTY,
  //   mSelectOneType: SelectOneType.EMPTY,
  //   mSelectId: '', // 选择id
  //   mSelectIds: [], // 选择id
  //   mSelectActive: [],
  // });

  const fabric = inject('fabric');
  const canvas = inject('canvas');
  const mixinData = inject('mixinData');

  return {
    fabric,
    canvas,
    mixinState: mixinData,
  };
}
