<!--
 * @Author: wuchenguang1998
 * @Date: 2024-05-13 22:34:03
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-21 16:42:31
 * @Description: 隐藏或显示元素
-->

<template>
  <Tooltip :content="$t('quick.hide')" v-if="mixinState.mSelectMode === 'one'">
    <Button long v-if="isHide" @click="doHide(false)" icon="md-eye-off" type="text"></Button>
    <Button long v-else @click="doHide(true)" icon="md-eye" type="text"></Button>
  </Tooltip>
</template>

<script setup name="Hide">
import useSelect from '@/hooks/select';
import { onBeforeUnmount, onMounted } from 'vue';

const { mixinState, canvasEditor } = useSelect();
const isHide = ref(false);

const doHide = (hide) => {
  // 修改visible属性
  const activeObject = canvasEditor.canvas.getActiveObject();
  activeObject.set('visible', !hide);
  canvasEditor.canvas.requestRenderAll();
  isHide.value = hide;
};

const handleSelected = () => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  isHide.value = !activeObject.visible;
};

onMounted(() => {
  canvasEditor.on('selectOne', handleSelected);
});

onBeforeUnmount(() => {
  canvasEditor.off('selectOne', handleSelected);
});
</script>
