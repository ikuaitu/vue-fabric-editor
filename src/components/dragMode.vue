<!--
 * @Author: 秦少卫
 * @Date: 2023-04-18 08:06:56
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-05 00:52:07
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
        this.canvasEditor.startDring();
      } else {
        this.canvasEditor.endDring();
      }
    },
  },
  mounted() {
    this.canvasEditor.on('startDring', () => (this.status = true));
    this.canvasEditor.on('endDring', () => (this.status = false));
  },
  beforeUnmount() {
    this.canvasEditor.off('startDring');
    this.canvasEditor.off('endDring');
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
