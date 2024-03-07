<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-02-06 17:00:13
 * @Description: 回退重做
-->

<template>
  <div style="display: inline-block">
    <!-- 后退 -->
    <Tooltip :content="$t('history.revocation') + `(${canUndo})`">
      <Button @click="undo" type="text" size="small">
        <Icon type="ios-undo" size="20" />
      </Button>
    </Tooltip>

    <!-- 重做 -->
    <Tooltip :content="$t('history.redo') + `(${canRedo})`">
      <Button @click="redo" type="text" size="small">
        <Icon type="ios-redo" size="20" />
      </Button>
    </Tooltip>
    <!-- <span class="time" v-if="history.length">
      {{ useDateFormat(history[0].timestamp, 'HH:mm:ss').value }}
    </span> -->
  </div>
</template>

<script setup lang="ts">
import { useDateFormat } from '@vueuse/core';
import useSelect from '@/hooks/select';
const { canvasEditor } = useSelect() as { canvasEditor: any };
console.log('canvasEditor', canvasEditor.getHistory());
const history = reactive(canvasEditor.getHistory());
const canUndo = reactive(canvasEditor.canUndo());
const canRedo = reactive(canvasEditor.canRedo());
const comUndo = computed(() => canvasEditor.canUndo());
// 后退
const undo = () => {
  canvasEditor.undo();
};
// 重做
const redo = () => {
  canvasEditor.redo();
};
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
