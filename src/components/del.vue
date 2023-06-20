<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-06-20 13:26:20
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
  canvas.editor.pluginEditor.del();
  // const activeObject = canvas.c.getActiveObjects();
  // if (activeObject) {
  //   activeObject.map((item) => canvas.c.remove(item));
  // }
  // canvas.c.requestRenderAll();
  // canvas.c.discardActiveObject();
}, 300);
</script>
