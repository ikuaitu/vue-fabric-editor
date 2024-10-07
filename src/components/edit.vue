<script setup lang="ts">
import useSelect from '@/hooks/select';
const { isMatchType, canvasEditor } = useSelect(['polygon']);
import { Message } from 'view-ui-plus';
const onEditPolygon = () => {
  const obj = canvasEditor.fabricCanvas?.getActiveObject();
  if (obj && obj.type === 'polygon') {
    canvasEditor.activeEdit();
  } else {
    Message.warning('请检查选择polygon');
  }
};
</script>

<template>
  <Tooltip :content="$t('quick.editPoly')" v-if="isMatchType">
    <Button long @click="onEditPolygon" icon="md-brush" type="text"></Button>
  </Tooltip>
</template>

<style scoped lang="less"></style>
