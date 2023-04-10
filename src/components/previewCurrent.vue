<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-04-09 11:19:07
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-04-10 22:04:33
 * @FilePath: \vue-fabric-editor\src\components\preview.vue
 * @Description: 预览组件
-->
<template>
  <div class="preview-wrap">
    <Button style="margin-left: 10px" type="text" @click="preview">
      {{ $t('preview') }}
    </Button>
    <Modal
      v-model="modal"
      title="预览图片"
      :width="imgWidth"
      footer-hide
      class-name="preview-modal-wrap"
    >
      <img :src="src" :height="imgHight" />
    </Modal>
  </div>
</template>

<script>
import select from '@/mixins/select';
export default {
  name: 'previewCurrent',
  mixins: [select],
  data() {
    return {
      imgWidth: '100vw',
      imgHight: '100vh',
      src: '',
      modal: false,
    };
  },
  methods: {
    preview() {
      this.modal = true;
      // 预览前取消画布所有元素的选中状态
      this.canvas.c.discardActiveObject();
      this.canvas.c.renderAll();
      // 2. 将当前画布转化为图片的base64地址
      const workspace = this.canvas.c.getObjects().find((item) => item.id === 'workspace');
      const { left, top, width, height } = workspace;
      const option = {
        name: 'New Image',
        format: 'png',
        quality: 1,

        width,
        height,
        left,
        top,
      };
      this.canvas.c.setViewportTransform([1, 0, 0, 1, 0, 0]);
      const dataUrl = this.canvas.c.toDataURL(option);
      this.imgWidth = width;
      this.imgHight = height;
      this.src = dataUrl;
    },
  },
};
</script>

<style scoped lang="less">
.modal-wrap {
  padding: 0;
}
.preview-wrap {
  display: inline-block;
}
</style>
