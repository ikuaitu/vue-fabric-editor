<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-24 23:13:02
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

const { mixinState, canvasEditor } = useSelect();

const del = debounce(function () {
  canvasEditor.del();
}, 300);
</script>
