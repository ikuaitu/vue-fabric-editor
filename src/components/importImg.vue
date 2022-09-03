<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-03 23:09:47
 * @Description: 插入图片
-->

<template>
  <div style="display: inline-block">
    <Button @click="insert" size="small">插入图片</Button>
    <Modal
      v-model="showModal"
      title="请选择"
      @on-ok="insertImgFile"
      @on-cancel="showModal = false,imgFile = null "
    >
      <Upload :before-upload="handleUpload" action="#">
        <Button icon="ios-cloud-upload-outline">选择图片文件</Button>
      </Upload>
    </Modal>
  </div>
</template>

<script>
import select from '@/mixins/select'
import { v4 as uuid } from 'uuid';
export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
      showModal: false,
      imgFile: null,
    };
  },
  methods: {
    insert() {
      this.imgFile = ''
      this.showModal = true
    },
    insertImgFile() {
      const imgEl = document.createElement('img');
      imgEl.src = this.imgFile
      // 插入页面
      document.body.appendChild(imgEl);
      imgEl.onload = () => {
        // 创建图片对象
        const imgInstance = new this.fabric.Image(imgEl, {
          id: uuid(),
          name: '图片1',
          left: 100, top: 100,
        });
        // 设置缩放
        imgInstance.scale(0.2);
        this.canvas.c.add(imgInstance)
        this.canvas.c.setActiveObject(imgInstance);
        this.canvas.c.renderAll()
        // 删除页面中的图片元素
        imgEl.remove()
      }
    },
    // 选择文件
    handleUpload(file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imgFile = reader.result
      };
      return false;
    },
  }
};
</script>

<style scoped lang="less">
</style>
