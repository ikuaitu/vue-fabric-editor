<!--
 * @Author: AliceLanniste
 * @Date: 2024-06-26 10：05
 * @Description: 橡皮檫功能呢
-->

<template>
  <Tooltip :content="$t('quick.erase')" v-if="mixinState.mSelectMode === 'one'">
    <Button long @click="doErase(true)" icon="md-brush" type="text"></Button>
  </Tooltip>
</template>

<script setup name="Erase">
import useSelect from '@/hooks/select';
import { onBeforeUnmount, onMounted } from 'vue';
import { fabric } from 'fabric';
import 'fabric-eraser-brush';

const { mixinState, canvasEditor } = useSelect();
const isErase = ref(false);

const doErase = (val) => {
  isErase.value = val;
  if (isErase.value) {
    let canvas = canvasEditor.canvas;
    canvas.isDrawingMode = true;
    canvas.freeDrawingBrush = new fabric.EraserBrush(canvas);
    canvas.freeDrawingBrush.width = 15; // optional
  }
};
</script>
