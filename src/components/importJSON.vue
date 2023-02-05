<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-05 01:04:52
 * @Description: 导入JSON文件
-->

<template>
  <div style="display: inline-block">
    <Button @click="insert" size="small">{{ $t('import_files') }}</Button>
    <Modal
      v-model="showModal"
      :title="$t('please_choose')"
      @on-ok="insertSvgFile"
      @on-cancel="(showModal = false), (jsonFile = null)"
    >
      <Upload :before-upload="handleUpload" action="#">
        <Button icon="ios-cloud-upload-outline">{{ $t('select_json') }}</Button>
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
        this.$Message.error(this.$t('alert.select_file'))
        return
      }
      // 加载字体后导入
      downFontByJSON(this.jsonFile).then(() => {
        this.canvas.c.loadFromJSON(this.jsonFile, () => {
          this.canvas.c.renderAll.bind(this.canvas.c)
          setTimeout(() => {
            const workspace = this.canvas.c.getObjects().find(item => item.id === 'workspace')
            workspace.set('selectable',false)
            workspace.set('hasControls',false)
            this.canvas.c.requestRenderAll()
            this.canvas.editor.editorWorkspace.setSize(workspace.width,workspace.height)
            this.canvas.c.renderAll()
            this.canvas.c.requestRenderAll()
          }, 100);
        });
      })
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
