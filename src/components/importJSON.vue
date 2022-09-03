<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-03 23:02:58
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
import FontFaceObserver from 'fontfaceobserver'
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
      this.getFonts(this.jsonFile).then(() => {
        this.canvas.c.loadFromJSON(this.jsonFile, this.canvas.c.renderAll.bind(this.canvas.c));
      })
    },
    // 获取字体
    getFonts(jsonFile) {
      const skipFonts = ['arial', 'Microsoft YaHei']
      const fontFamilys = JSON.parse(jsonFile).objects.filter(item => {
        // 为text 并且不为跳过字体
        return (item.type.includes('text') && !skipFonts.includes(item.fontFamily))
      }).map(item => item.fontFamily)
      const fontFamilysAll = fontFamilys.map(fontName => {
        const font = new FontFaceObserver(fontName);
        return font.load(null, 150000)
      })
      return Promise.all(fontFamilysAll)
    },
    handleUpload(file) {
      const reader = new FileReader();
      reader.readAsText(file, 'UTF-8');
      reader.onload = () => {
        this.jsonFile = reader.result
      };
      return false;
    },
  }
};
</script>

<style scoped lang="less">
</style>
