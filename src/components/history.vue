<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: June
 * @LastEditTime: 2023-04-25 11:24:07
 * @Description: 回退重做
-->

<template>
  <div style="display: inline-block">
    <!-- 后退 -->
    <Tooltip :content="$t('history.revocation') + `(${state.list.length})`">
      <Button @click="undo" type="text" size="small" :disabled="!state.list.length">
        <Icon type="ios-undo" size="20" />
      </Button>
    </Tooltip>

    <!-- 重做 -->
    <Tooltip :content="$t('history.redo') + `(${state.redoList.length})`">
      <Button @click="redo" type="text" size="small" :disabled="!state.redoList.length">
        <Icon type="ios-redo" size="20" />
      </Button>
    </Tooltip>

    <span class="time">
      {{ state.time }}
    </span>
  </div>
</template>

<script setup name="ToolBar">
import { reactive, onMounted } from 'vue';
import { keyNames, hotkeys } from '@/core/initHotKeys';
import useSelect from '@/hooks/select';
const { $this, $t } = useSelect();
const maxStep = 10;
const state = reactive({
  index: 0,
  redoList: [],
  list: [],
  time: '',
});
const getTime = () => {
  const myDate = new Date();
  const str = myDate.toTimeString();
  const timeStr = str.substring(0, 8);
  state.time = timeStr;
};
const save = (event) => {
  // 过滤选择元素事件
  const isSelect = event.action === undefined && event.e;
  if (isSelect) return;
  const data = $this.canvas.editor.getJson();
  if (state.list.length > maxStep) {
    state.list.shift();
  }
  state.list.push(data);
  getTime();
};
// 根据数据渲染
const renderCanvas = (data) => {
  $this.canvas.c.clear();
  $this.canvas.c.loadFromJSON(data, $this.canvas.c.renderAll.bind($this.canvas.c));
  $this.canvas.c.requestRenderAll();
};
// 后退
const undo = () => {
  if (state.list.length) {
    const item = state.list.pop();
    state.redoList.push(item);
    renderCanvas(item);
  }
};
// 重做
const redo = () => {
  if (state.redoList.length) {
    const item = state.redoList.pop();
    state.list.push(item);
    renderCanvas(item);
  }
};
onMounted(() => {
  // 有更新时记录进度
  $this.canvas.c.on({
    'object:modified': save,
    'selection:updated': save,
  });
  hotkeys(keyNames.ctrlz, undo);
});
</script>

<style scoped lang="less">
span.active {
  svg.icon {
    fill: #2d8cf0;
  }
}
.time {
  color: #c1c1c1;
}
</style>
