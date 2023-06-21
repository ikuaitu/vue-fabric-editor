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

<script setup ame="Drag">
import useSelect from '@/hooks/select';
const status = ref(false);
const { canvas } = useSelect();

const switchMode = (val) => {
  if (val) {
    canvas.editor.editorWorkspace.startDring();
  } else {
    canvas.editor.editorWorkspace.endDring();
  }
};
const handleKeyDown = (e) => {
  if (status.value) return;
  if (e.code === 'Space') {
    status.value = true;
    canvas.editor.editorWorkspace.startDring();
  }
};
const handleKeyUp = (e) => {
  if (e.code === 'Space') {
    status.value = false;
    canvas.editor.editorWorkspace.endDring();
  }
};

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown);
  window.addEventListener('keyup', handleKeyUp);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
  window.removeEventListener('keyup', handleKeyUp);
});
</script>
<style scoped lang="less">
.box {
  position: absolute;
  right: 193px;
  bottom: 14px;
}
</style>
