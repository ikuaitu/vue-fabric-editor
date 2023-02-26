<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-26 20:10:36
 * @Description: 导入JSON文件
-->

<template>
  <div style="display: inline-block">
    <Button @click="insert" type="text" size="small">{{ $t('import_files') }}</Button>
  </div>
</template>

<script>
import select from '@/mixins/select';
import { selectFiles, downFontByJSON } from '@/utils/utils';

export default {
  name: 'ToolBar',
  mixins: [select],
  methods: {
    insert() {
      selectFiles({ accept: '.json' }).then((files) => {
        const [file] = files;
        const reader = new FileReader();
        reader.readAsText(file, 'UTF-8');
        reader.onload = () => {
          this.insertSvgFile(reader.result);
        };
      });
    },
    insertSvgFile(jsonFile) {
      // 加载字体后导入
      downFontByJSON(jsonFile).then(() => {
        this.canvas.c.loadFromJSON(jsonFile, () => {
          this.canvas.c.renderAll.bind(this.canvas.c);
          setTimeout(() => {
            const workspace = this.canvas.c.getObjects().find((item) => item.id === 'workspace');
            workspace.set('selectable', false);
            workspace.set('hasControls', false);
            this.canvas.c.requestRenderAll();
            this.canvas.editor.editorWorkspace.setSize(workspace.width, workspace.height);
            this.canvas.c.renderAll();
            this.canvas.c.requestRenderAll();
          }, 100);
        });
      });
    },
  },
};
</script>

<style scoped lang="less"></style>
