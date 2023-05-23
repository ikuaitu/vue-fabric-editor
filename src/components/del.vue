<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: June
 * @LastEditTime: 2023-05-19 22:08:43
 * @Description: 删除元素按钮
-->

<template>
  <Tooltip v-if="mixinState.mSelectMode" :content="$t('quick.del')">
    <Button @click="del" icon="ios-trash" type="text"></Button>
  </Tooltip>
</template>

<script setup name="Del">
import useSelect from '@/hooks/select';
import { debounce } from 'lodash-es';

const { canvas, mixinState } = useSelect();

const del = debounce(function () {
  const activeObject = canvas.c.getActiveObjects();
  if (activeObject) {
    activeObject.map((item) => canvas.c.remove(item));
  }
  canvas.c.requestRenderAll();
  canvas.c.discardActiveObject();
}, 300);
</script>
