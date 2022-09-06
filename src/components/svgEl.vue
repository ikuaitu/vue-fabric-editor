<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-07 00:19:55
 * @Description: 素材面板
-->

<template>
  <div>
    <Divider plain orientation="left">卡通</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(460, 489)" @click="addItem" >
    </div>
    <Divider plain orientation="left">卡通水果</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(386, 409)" @click="addItem" >
    </div>
    <Divider plain orientation="left">体育</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(410, 459)" @click="addItem" >
    </div>
    <Divider plain orientation="left">秋天</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(40, 49)" @click="addItem" >
    </div>
    <Divider plain orientation="left">计算机</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(50, 75)" @click="addItem" >
    </div>
    <Divider plain orientation="left">水果</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(76, 89)" @click="addItem" >
    </div>
    <Divider plain orientation="left">服饰</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(89, 136)" @click="addItem" >
    </div>
    <Divider plain orientation="left">旗子</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(137, 151)" @click="addItem" >
    </div>
    <Divider plain orientation="left">树木</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(152, 181)" @click="addItem" >
    </div>
    <Divider plain orientation="left">食物</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(182, 201)" @click="addItem" >
    </div>
    <Divider plain orientation="left">手绘衣服</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(202, 222)" @click="addItem" >
    </div>
    <Divider plain orientation="left">奖牌</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(223, 252)" @click="addItem" >
    </div>
    <Divider plain orientation="left">商务</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(253, 261)" @click="addItem" >
    </div>
    <Divider plain orientation="left">活动</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(262, 270)" @click="addItem" >
    </div>
    <Divider plain orientation="left">水果</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(271, 300)" @click="addItem" >
    </div>
    <Divider plain orientation="left">复古</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(301, 350)" @click="addItem" >
    </div>
    <Divider plain orientation="left">卡通</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(351, 385)" @click="addItem" >
    </div>

    <Divider plain orientation="left">动物</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(490, 519)" @click="addItem" >
    </div>

    <Divider plain orientation="left">手绘</Divider>
    <div class="box">
        <img :src="`./svg/${item}.svg`" alt="" :key="item" v-for="(item) in getIndex(0, 39)" @click="addItem" >
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
  },
  methods: {
    getIndex(start, end){
      const arr = Array(end - (start - 1)).fill('')
      return arr.map((item, i) => (i + start))
    },
    // 按照类型渲染
    addItem(e) {
      
      const url = e.target.src
      console.log(url)
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
