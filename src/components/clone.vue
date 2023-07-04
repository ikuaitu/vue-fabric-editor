<template>
  <Tooltip v-if="mixinState.mSelectMode === 'one'" :content="$t('quick.copy')">
    <Button @click="clone" icon="ios-copy" type="text"></Button>
  </Tooltip>
</template>

<script setup name="Clone">
import useSelect from '@/hooks/select';
import { debounce } from 'lodash-es';

const { canvas, mixinState, canvasEditor } = useSelect();
const clone = debounce(function () {
  // canvas.editor.clone();
  canvasEditor.clone();
}, 300);
</script>
