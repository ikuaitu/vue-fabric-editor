/*
 * @Description: useSelect(原mixin)  类型待优化
 * @version:
 * @Author: June
 * @Date: 2023-04-23 21:10:05
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-27 23:11:27
 */

import { inject, reactive, onMounted } from 'vue';
import { SelectEvent, SelectMode } from '@/utils/event/types';
import { useI18n } from 'vue-i18n';
// interface Data {
//   mSelectMode: SelectMode | '';
//   mSelectOneType: SelectOneType | '';
//   mSelectId: string[] | '';
//   mSelectIds: string[];
//   mSelectActive: any;
// }

// interface ICanvas extends fabric.Canvas {
//   c: fabric.Canvas;
//   editor: any; // core 下目前没有处理好类型导出
// }

export default function useSelect() {
  const state = reactive({
    mSelectMode: '',
    mSelectOneType: '',
    mSelectId: '', // 选择id
    mSelectIds: [], // 选择id
    mSelectActive: [],
  });

  const { t } = useI18n();
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
    $this: {
      // 使用$this是为了快速处理旧的mixin: 如this.fabric 只需要 $this.fabric
      fabric,
      canvas,
      event,
      ...state,
    },
    ...state,
    $t: t,
  };
}
