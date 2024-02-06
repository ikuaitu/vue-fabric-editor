/*
 * @Descripttion: useSelect(原mixin)  类型待优化
 * @version:
 * @Author: June
 * @Date: 2023-04-23 21:10:05
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-02-06 17:53:05
 */
import { inject, onBeforeMount, onMounted, reactive } from 'vue';
import { SelectEvent, SelectMode } from '@/utils/event/types';

import EventEmitter from 'events';

interface Selector {
  mSelectMode: SelectMode;
  mSelectOneType: string | undefined;
  mSelectId: string | undefined;
  mSelectIds: (string | undefined)[];
  mSelectActive: unknown[];
}

export default function useSelect() {
  const state = reactive<Selector>({
    mSelectMode: SelectMode.EMPTY,
    mSelectOneType: '',
    mSelectId: '', // 选择id
    mSelectIds: [], // 选择id
    mSelectActive: [],
  });

  const fabric = inject('fabric');
  // const canvas = inject('canvas');
  const canvasEditor = inject('canvasEditor');
  const event = inject('event') as EventEmitter;

  const selectOne = (e: [fabric.Object]) => {
    state.mSelectMode = SelectMode.ONE;
    if (e[0]) {
      state.mSelectId = e[0].id;
      state.mSelectOneType = e[0].type;
      state.mSelectIds = e.map((item) => item.id);
    }
  };

  const selectMulti = (e: fabric.Object[]) => {
    state.mSelectMode = SelectMode.MULTI;
    state.mSelectId = '';
    state.mSelectIds = e.map((item) => item.id);
  };

  const selectCancel = () => {
    state.mSelectId = '';
    state.mSelectIds = [];
    state.mSelectMode = SelectMode.EMPTY;
    state.mSelectOneType = '';
  };

  onMounted(() => {
    event.on(SelectEvent.ONE, selectOne);
    event.on(SelectEvent.MULTI, selectMulti);
    event.on(SelectEvent.CANCEL, selectCancel);
  });

  onBeforeMount(() => {
    event.off(SelectEvent.ONE, selectOne);
    event.off(SelectEvent.MULTI, selectMulti);
    event.off(SelectEvent.CANCEL, selectCancel);
  });

  return {
    fabric,
    // canvas,
    canvasEditor,
    mixinState: state,
  };
}
