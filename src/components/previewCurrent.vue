<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-04-09 11:19:07
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-04 23:52:02
 * @FilePath: \vue-fabric-editor\src\components\preview.vue
 * @Description: 预览组件
-->
<template>
  <Button type="text" @click="preview">
    {{ $t('preview') }}
  </Button>
</template>

<script lang="ts" setup>
import { fabric } from 'fabric';
import { ImagePreview } from 'view-ui-plus';
import vfe from 'vfe';

const canvas = inject('canvas') as vfe.ICanvas;
const getImgUrl = () => {
  const dataUrl = canvas.editor.pluginEditor.preview();
  return dataUrl;
};
const preview = () => {
  const dataUrl = getImgUrl();
  ImagePreview.show({
    previewList: [dataUrl],
  });
};
</script>

<style scoped lang="less"></style>
