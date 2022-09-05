<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-05 22:46:24
 * @Description: 导入JSON文件
-->

<template>
  <div style="display: inline-block">
    <Button @click="insert" size="small">导入文件</Button>
    <Modal
      v-model="showModal"
      title="请选择"
      @on-ok="insertSvgFile"
      @on-cancel="(showModal = false), (jsonFile = null)"
    >
      <Upload :before-upload="handleUpload" action="#">
        <Button icon="ios-cloud-upload-outline">选择JSON文件</Button>
      </Upload>
    </Modal>
  </div>
</template>

<script>
import select from '@/mixins/select'
import { downFontByJSON } from '@/utils/utils'
export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
      showModal: false,
      jsonFile: null,
    };
  },
  methods: {
    insert() {
      this.svg = ''
      this.showModal = true
    },
    insertSvgFile() {
      if (!this.jsonFile) {
        this.$Message.error('请选择文件')
        return
      }
      // 加载字体后导入
      downFontByJSON(this.jsonFile).then(() => {
        this.canvas.c.loadFromJSON(this.jsonFile, this.canvas.c.renderAll.bind(this.canvas.c));
      })
    },
    handleUpload(file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        this.jsonFile = reader.result
        console.log(this.jsonFile)
      };
      return false;
    },
  }
};
</script>

<style scoped lang="less">
</style>
