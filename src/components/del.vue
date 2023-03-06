<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-26 21:39:45
 * @Description: 删除元素按钮
-->

<template>
  <Tooltip v-if="mSelectMode" :content="$t('quick.del')">
    <Button @click="del" icon="ios-trash" type="text"></Button>
  </Tooltip>
</template>

<script>
import select from '@/mixins/select';

export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {};
  },
  methods: {
    del() {
      const activeObject = this.canvas.c.getActiveObjects();
      if (activeObject) {
        activeObject.map((item) => this.canvas.c.remove(item));
      }
      this.canvas.c.requestRenderAll();
      this.canvas.c.discardActiveObject();
    },
  },
};
</script>

<style scoped lang="less"></style>
