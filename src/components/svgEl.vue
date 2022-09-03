<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-04 00:20:36
 * @Description: 素材面板
-->

<template>
  <div>
    <Divider plain orientation="left">素材</Divider>
    <div class="box">
        <img :src="`/svg/${i}.svg`" alt="" :key="item" v-for="(item, i) in arr" @click="addItem(i)" >
    </div>
  </div>
</template>

<script>
import { v4 as uuid } from 'uuid';
const defaultPosition = {
  left: 100, top: 100,  shadow: '', fontFamily: '1-1'
}
export default {
  name: 'ToolBar',
  inject: ['canvas', 'fabric'],
  data() {
    return {
        arr:[]
    }
  },
  created(){
      this.arr = Array(520)
  },
  methods: {
    // 按照类型渲染
    addItem(i) {
      const url = `/svg/${i}.svg`
      this.fabric.loadSVGFromURL(url, (objects, options) => {
        var item = this.fabric.util.groupSVGElements(objects, {...options, ...defaultPosition,
          id: uuid(),
          name: 'svg元素'
        });
        this.canvas.c.add(item)
        this.canvas.c.renderAll()
      });
    },
  }
};
</script>

<style scoped lang="less">

img {
  display: inline-block;
  width: 53px;
  margin-left: 2px;
  margin-bottom: 2px;
  background: #F5F5F5;
  padding: 6px;
  cursor: pointer;
}
</style>
