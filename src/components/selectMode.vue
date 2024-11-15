<template>
  <Select v-model="mode" style="width: 120px" @on-change="onChange">
    <Option v-for="item in modeList" :value="item.value" :key="item.value">{{ item.label }}</Option>
  </Select>
</template>

<script setup name="SelectMode" lang="ts">
import useSelect from '@/hooks/select';
import { ref, onMounted } from 'vue';
const mode = ref('select');
const { canvasEditor } = useSelect();

const modeList = [
  {
    label: '框选模式(s)',
    value: 'select',
  },
  {
    label: '擦除模式(e)',
    value: 'earse',
  },
  {
    label: '复原模式(q)',
    value: 'undoEarse',
  },
];
const onChange = () => {
  switch (mode.value) {
    case 'select':
      canvasEditor.select();
      break;
    case 'earse':
      canvasEditor.erase();
      break;
    case 'undoEarse':
      canvasEditor.undoErasing();
      break;
    default:
      break;
  }
};
onMounted(() => {
  canvasEditor.on('modeEvent', (data) => {
    mode.value = data;
  });
});
</script>
