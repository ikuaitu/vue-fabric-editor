<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-04-09 11:19:07
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-05 00:58:02
 * @FilePath: \vue-fabric-editor\src\components\preview.vue
 * @Description: 预览组件
-->
<template>
  <Button type="text" @click="preview">
    {{ $t('preview') }}
  </Button>
</template>

<script lang="ts" setup>
import { ImagePreview } from 'view-ui-plus';

const canvasEditor: any = inject('canvasEditor');
const preview = () => {
  canvasEditor.preview().then((dataUrl: string) => {
    // const dataUrl = getImgUrl();
    ImagePreview.show({
      previewList: [dataUrl],
    });
  });
};
</script>

<style scoped lang="less"></style>
