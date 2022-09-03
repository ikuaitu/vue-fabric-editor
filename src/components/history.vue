<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-03 22:57:06
 * @Description: 回退重做
-->

<template>
    <ButtonGroup size="small" >
      <!-- 后退 -->
      <Button @click="undo" :disabled="!list.length"><Icon type="ios-undo" />{{list.length}}</Button>
      <!-- 重做 -->
      <Button @click="redo" :disabled="!redoList.length"><Icon type="ios-redo" />{{redoList.length}}</Button>
    </ButtonGroup>
</template>

<script>
import select from '@/mixins/select'

const maxStep = 10

export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
      index: 0,
      redoList:[],
      list:[],
    };
  },
  created(){
    // 有更新时记录进度
    this.canvas.c.on({
      'object:modified': this.save,
      'selection:updated': this.save,
    });
  },
  methods:{
    // 保存记录
    save() {
      const data = this.canvas.c.toJSON(['id'])
      if(this.list.length > maxStep){
        this.list.shift()
      }
      this.list.push(data)
    },
    // 后退
    undo(){
      if(this.list.length){
        const item = this.list.pop()
        this.redoList.push(item)
        this.renderCanvas(item)
      }
    },
    // 重做
    redo(){
      if(this.redoList.length){
        const item = this.redoList.pop()
        this.list.push(item)
        this.renderCanvas(item)
      }
    },
    // 根据数据渲染
    renderCanvas(data){
      this.canvas.c.clear();
      this.canvas.c.loadFromJSON(data, this.canvas.c.renderAll.bind(this.canvas.c));
      this.canvas.c.requestRenderAll();
    }
  }
};
</script>

<style scoped lang="less">
span.active {
  svg.icon{
   fill: #2d8cf0;
  }
}
</style>