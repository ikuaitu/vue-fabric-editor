<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-06-27 23:23:03
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
      this.canvas.editor.pluginEditor.insert();
    },
  },
};
</script>

<style scoped lang="less"></style>
