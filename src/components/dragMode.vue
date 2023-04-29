<!--
 * @Author: 秦少卫
 * @Date: 2023-04-18 08:06:56
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-22 22:55:59
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
  computed: {
    unShow() {
      return this.mSelectMode === 'one' && this.mSelectOneType === 'group';
    },
    createShow() {
      return this.mSelectMode === 'multiple';
    },
  },
  methods: {
    switchMode(val) {
      if (val) {
        this.canvas.editor.editorWorkspace.startDring();
      } else {
        this.canvas.editor.editorWorkspace.endDring();
      }
    },
    handleKeyDown(e) {
      if (this.status) return;
      if (e.code === 'Space') {
        this.status = true;
        this.canvas.editor.editorWorkspace.startDring();
      }
    },
    handleKeyUp(e) {
      if (e.code === 'Space') {
        this.status = false;
        this.canvas.editor.editorWorkspace.endDring();
      }
    },
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
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
