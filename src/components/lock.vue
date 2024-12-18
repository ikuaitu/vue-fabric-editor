<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-10-07 17:20:59
 * @Description: 锁定元素
-->

<template>
  <Tooltip :content="isLock ? $t('quick.unlock') : $t('quick.lock')" v-if="isOne">
    <Button long v-if="isLock" @click="doLock(false)" icon="md-lock" type="text"></Button>
    <Button long v-else @click="doLock(true)" icon="md-unlock" type="text"></Button>
  </Tooltip>
</template>

<script setup name="Lock">
import useSelect from '@/hooks/select';
import { onBeforeUnmount, onMounted } from 'vue';

const { canvasEditor, isOne } = useSelect();
const isLock = ref(false);
const doLock = (isLock) => {
  isLock ? canvasEditor.lock() : canvasEditor.unLock();
};

const handleSelected = (items) => {
  isLock.value = items[0].lockMovementX;
};

onMounted(() => {
  canvasEditor.on('selectOne', handleSelected);
});

onBeforeUnmount(() => {
  canvasEditor.off('selectOne', handleSelected);
});
</script>

<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
