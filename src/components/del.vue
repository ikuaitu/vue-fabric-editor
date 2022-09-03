<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-03 22:35:59
 * @Description: 删除元素按钮
-->

<template>
  <Button v-if="mSelectMode" @click="del" icon="ios-trash" size="small"></Button>
</template>

<script>
import select from '@/mixins/select'

export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
    };
  },
  methods:{
    del(){
      const activeObject = this.canvas.c.getActiveObjects();
      activeObject && activeObject.map(item => this.canvas.c.remove(item))
      this.canvas.c.requestRenderAll()
      this.canvas.c.discardActiveObject()
    },
  }
};
</script>

<style scoped lang="less">
</style>
