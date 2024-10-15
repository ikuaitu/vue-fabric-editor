/*
 * @Author: 秦少卫
 * @Date: 2024-10-07 17:12:29
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-10-07 17:14:13
 * @Description: 通用属性hook
 */

import { inject, computed, reactive, onMounted, onBeforeMount } from 'vue';

import Editor, { EventType } from '@kuaitu/core';
const { SelectMode, SelectEvent } = EventType;

import { useI18n } from 'vue-i18n';

export default function useSelect(matchType?: Array<string>) {
  const { t } = useI18n();
  const fabric = inject('fabric');
  const canvasEditor = inject('canvasEditor') as Editor;

  const state = reactive({
    mSelectMode: SelectMode.EMPTY,
    mSelectOneType: '',
    mSelectId: '' as any, // 选择id
    mSelectIds: [] as any, // 选择id
    mSelectActive: [] as fabric.Object[],
  });
  const selectOne = (arr: fabric.Object[]) => {
    state.mSelectMode = SelectMode.ONE;
    const [item] = arr;
    if (item) {
      state.mSelectActive = [item];
      state.mSelectId = item.id;
      state.mSelectOneType = item.type;
      state.mSelectIds = [item.id];
    }
    callBack();
  };

  const selectMulti = (arr: fabric.Object[]) => {
    state.mSelectMode = SelectMode.MULTI;
    state.mSelectId = '';
    state.mSelectIds = arr.map((item) => item.id);
    callBack();
  };

  const selectCancel = () => {
    state.mSelectId = '';
    state.mSelectIds = [];
    state.mSelectMode = SelectMode.EMPTY;
    state.mSelectOneType = '';
    callBack();
  };

  let callBack = () => {
    //
  };
  const getObjectAttr = (cb: any) => {
    callBack = cb;
  };
  onMounted(() => {
    canvasEditor.on(SelectEvent.ONE, selectOne);
    canvasEditor.on(SelectEvent.MULTI, selectMulti);
    canvasEditor.on(SelectEvent.CANCEL, selectCancel);
  });

  onBeforeMount(() => {
    canvasEditor.off(SelectEvent.ONE, selectOne);
    canvasEditor.off(SelectEvent.MULTI, selectMulti);
    canvasEditor.off(SelectEvent.CANCEL, selectCancel);
  });

  let isMatchType;
  if (matchType) {
    isMatchType = computed(() => matchType.includes(state.mSelectOneType));
  }
  const isOne = computed(() => state.mSelectMode === 'one');
  const isMultiple = computed(() => state.mSelectMode === 'multiple');
  const isGroup = computed(() => state.mSelectMode === 'one' && state.mSelectOneType === 'group');
  const isSelect = computed(() => state.mSelectMode);

  const selectType = computed(() => state.mSelectOneType);

  const matchTypeHander = (types: string[]) => {
    return computed(() => types.includes(state.mSelectOneType));
  };
  return {
    fabric,
    canvasEditor,
    mixinState: state,
    selectType,
    isSelect,
    isGroup,
    isOne,
    isMultiple,
    isMatchType,
    matchTypeHander,
    getObjectAttr,
    t,
  };
}
