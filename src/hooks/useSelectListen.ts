/*
 * @Descripttion: useSelectListen
 * @version:
 * @Author: wuchenguang1998
 * @Date: 2024-05-04 14:36:49
 * @LastEditors: wuchenguang1998
 * @LastEditTime: 2024-05-04 15:27:11
 */
import Editor, { EventType } from '@kuaitu/core';
const { SelectEvent, SelectMode } = EventType;
interface Selector {
  mSelectMode: SelectMode;
  mSelectOneType: string | undefined;
  mSelectId: string | undefined;
  mSelectIds: (string | undefined)[];
  mSelectActive: unknown[];
}

export default function useSelectListen(canvasEditor: Editor) {
  const state = reactive<Selector>({
    mSelectMode: SelectMode.EMPTY,
    mSelectOneType: '',
    mSelectId: '', // 选择id
    mSelectIds: [], // 选择id
    mSelectActive: [],
  });

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
    canvasEditor.on(SelectEvent.ONE, selectOne);
    canvasEditor.on(SelectEvent.MULTI, selectMulti);
    canvasEditor.on(SelectEvent.CANCEL, selectCancel);
  });

  onBeforeMount(() => {
    canvasEditor.off(SelectEvent.ONE, selectOne);
    canvasEditor.off(SelectEvent.MULTI, selectMulti);
    canvasEditor.off(SelectEvent.CANCEL, selectCancel);
  });

  return {
    mixinState: state,
  };
}
