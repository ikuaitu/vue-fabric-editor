/*
 * @Descripttion: useSelect(原mixin)  类型待优化
 * @version:
 * @Author: June
 * @Date: 2023-04-23 21:10:05
 * @LastEditors: June
 * @LastEditTime: 2023-04-24 01:16:49
 */

import { inject, reactive, onMounted } from 'vue';
import { SelectEvent, SelectMode, SelectOneType } from '@/utils/event/types';
import { useI18n } from 'vue-i18n';

interface Data {
  mSelectMode: SelectMode | '';
  mSelectOneType: SelectOneType | '';
  mSelectId: string[] | '';
  mSelectIds: string[];
  mSelectActive: any[];
}

export default function useSelect() {
  const state = reactive<Data>({
    mSelectMode: '',
    mSelectOneType: '',
    mSelectId: '', // 选择id
    mSelectIds: [], // 选择id
    mSelectActive: [],
  });

  const { t } = useI18n();

  const injects: any = {
    canvas: inject('canvas'),
    fabric: inject('fabric'),
    event: inject('event'),
  };

  onMounted(() => {
    injects.event.on(SelectEvent.ONE, (e: any) => {
      state.mSelectMode = SelectMode.ONE;
      state.mSelectId = e[0].id;
      state.mSelectOneType = e[0].type;
      state.mSelectIds = e.map((item: any) => item.id);
    });

    injects.event.on(SelectEvent.MULTI, (e: any) => {
      state.mSelectMode = SelectMode.MULTI;
      state.mSelectId = '';
      state.mSelectIds = e.map((item: any) => item.id);
    });

    injects.event.on(SelectEvent.CANCEL, () => {
      state.mSelectId = '';
      state.mSelectIds = [];
      state.mSelectMode = '';
      state.mSelectOneType = '';
    });
  });

  return {
    injects,
    $t: t,
  };
}
