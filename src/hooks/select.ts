/*
 * @Description: useSelect(原mixin)  类型待优化
 * @version:
 * @Author: June
 * @Date: 2023-04-23 21:10:05
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-05-07 09:35:08
 */

import { inject, onMounted, reactive } from 'vue';
import { SelectEvent, SelectMode, SelectOneType } from '@/utils/event/types';
import CanvasEventEmitter from '@/utils/event/notifier';
import { Canvas } from 'fabric/fabric-impl';
import { InjectionKeys } from '@/utils/keys';

interface Data {
  mSelectMode: SelectMode;
  mSelectOneType: SelectOneType;
  mSelectId: string[] | '';
  mSelectIds: string[];
  mSelectActive: unknown[];
}

export default function useSelect() {
  const state = reactive<Data>({
    mSelectMode: SelectMode.EMPTY,
    mSelectOneType: SelectOneType.EMPTY,
    mSelectId: '', // 选择id
    mSelectIds: [], // 选择id
    mSelectActive: [],
  });

  const fabric = inject(InjectionKeys.FABRIC);
  const canvas = inject<Canvas>(InjectionKeys.CANVAS);
  const event = inject<CanvasEventEmitter>(InjectionKeys.EVENT);

  onMounted(() => {
    event?.on(SelectEvent.ONE, (e) => {
      state.mSelectMode = SelectMode.ONE;
      state.mSelectId = e[0].id;
      state.mSelectOneType = e[0].type;
      state.mSelectIds = e.map((item) => item.id);
    });

    event?.on(SelectEvent.MULTI, (e) => {
      state.mSelectMode = SelectMode.MULTI;
      state.mSelectId = '';
      state.mSelectIds = e.map((item) => item.id);
    });

    event?.on(SelectEvent.CANCEL, () => {
      state.mSelectId = '';
      state.mSelectIds = [];
      state.mSelectMode = SelectMode.EMPTY;
      state.mSelectOneType = SelectOneType.EMPTY;
    });
  });

  return {
    fabric,
    canvas,
  };
}
