/*
 * @Descripttion: useSelect(原mixin)  类型待优化
 * @version:
 * @Author: June
 * @Date: 2023-04-23 21:10:05
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-05-07 09:35:08
 */

import { inject, reactive, onMounted } from 'vue';
import { SelectEvent, SelectMode } from '@/utils/event/types';
// todo
// interface Data {
//   mSelectMode: SelectMode | '';
//   mSelectOneType: SelectOneType | '';
//   mSelectId: string[] | '';
//   mSelectIds: string[];
//   mSelectActive: any;
// }

export default function useSelect() {
  const state = reactive({
    mSelectMode: '',
    mSelectOneType: '',
    mSelectId: '', // 选择id
    mSelectIds: [], // 选择id
    mSelectActive: [],
  });

  const fabric = inject('fabric');
  const canvas = inject('canvas');
  const event = inject('event');

  onMounted(() => {
    event.on(SelectEvent.ONE, (e) => {
      state.mSelectMode = SelectMode.ONE;
      state.mSelectId = e[0].id;
      state.mSelectOneType = e[0].type;
      state.mSelectIds = e.map((item) => item.id);
    });

    event.on(SelectEvent.MULTI, (e) => {
      state.mSelectMode = SelectMode.MULTI;
      state.mSelectId = '';
      state.mSelectIds = e.map((item) => item.id);
    });

    event.on(SelectEvent.CANCEL, () => {
      state.mSelectId = '';
      state.mSelectIds = [];
      state.mSelectMode = '';
      state.mSelectOneType = '';
    });
  });

  return {
    fabric,
    canvas,
  };
}
