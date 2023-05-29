<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: June
 * @LastEditTime: 2023-05-20 22:54:13
 * @Description: 回退重做
-->

<template>
  <div style="display: inline-block">
    <!-- 后退 -->
    <Tooltip :content="$t('history.revocation') + `(${undoStack.length})`">
      <Button @click="undo" type="text" size="small" :disabled="!canUndo">
        <Icon type="ios-undo" size="20" />
      </Button>
    </Tooltip>

    <!-- 重做 -->
    <Tooltip :content="$t('history.redo') + `(${redoStack.length})`">
      <Button @click="redo" type="text" size="small" :disabled="!canRedo">
        <Icon type="ios-redo" size="20" />
      </Button>
    </Tooltip>

    <span class="time" v-if="history.length">
      {{ useDateFormat(history[0].timestamp, 'HH:mm:ss').value }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { useRefHistory, useDateFormat } from '@vueuse/core';
import { keyNames, hotkeys } from '@/core/initHotKeys';
import type { fabric } from 'fabric';
import * as vfe from 'vfe';

const canvas = inject<vfe.ICanvas>('canvas');

const {
  undo: _undo,
  redo: _redo,
  canRedo,
  canUndo,
  commit,
  pause,
  resume,
  clear,
  history,
  source,
  redoStack,
  undoStack,
  isTracking,
} = useRefHistory(ref(), {
  capacity: 50,
});

const save = (event: fabric.IEvent) => {
  // 过滤选择元素事件
  const isSelect = event.action === undefined && event.e;
  if (isSelect || !canvas) return;

  // 丢弃workspace创建前的记录
  if (!canvas.editor.editorWorkspace) {
    source.value = canvas.editor.getJson();
    commit();
    clear();
    return;
  }

  if (isTracking.value) {
    source.value = canvas.editor.getJson();
  }
};

// 后退
const undo = () => {
  _undo();
  renderCanvas();
};
// 重做
const redo = () => {
  _redo();
  renderCanvas();
};

const renderCanvas = () => {
  if (!canvas) return;
  pause();
  canvas.c.clear();
  canvas.c.loadFromJSON(source.value, () => {
    canvas.c.renderAll();
    resume();
  });
};

onMounted(() => {
  canvas?.c.on({
    'object:added': save,
    'object:modified': save,
    'selection:updated': save,
  });
  hotkeys(keyNames.ctrlz, undo);
});

onUnmounted(() => {
  canvas?.c.off({
    'object:added': save,
    'object:modified': save,
    'selection:updated': save,
  });
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

<script lang="ts">
export default {
  name: 'ToolBar',
};
</script>
