<!--
 * @Author: 秦少卫
 * @Date: 2023-04-18 08:06:56
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-06-15 23:44:23
 * @Description: 拖拽模式
-->

<template>
  <div class="box">
    <Switch size="large" v-model="status" @on-change="switchMode">
      <template #open>
        <span>Drag</span>
      </template>
    </Switch>
  </div>
</template>

<script>
import select from '@/mixins/select';

export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
      status: false,
    };
  },
  methods: {
    switchMode(val) {
      if (val) {
        this.canvas.editor.pluginEditor.startDring();
      } else {
        this.canvas.editor.pluginEditor.endDring();
      }
    },
  },
  mounted() {
    this.canvas.editor.pluginEditor.on('startDring', () => (this.status = true));
    this.canvas.editor.pluginEditor.on('endDring', () => (this.status = false));
  },
  beforeUnmount() {
    this.canvas.editor.pluginEditor.off('startDring');
    this.canvas.editor.pluginEditor.off('endDring');
  },
};
</script>
<style scoped lang="less">
.box {
  position: absolute;
  right: 193px;
  bottom: 14px;
}
</style>
