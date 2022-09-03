<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-04 00:04:40
 * @Description: 锁定元素
-->

<template>
  <i-switch v-if="mSelectMode === 'one'" v-model="isLock" @on-change="doLock" >
      <Icon type="md-lock" slot="open"></Icon>
      <Icon type="md-unlock" slot="close"></Icon>
  </i-switch>
</template>

<script>
import select from '@/mixins/select'
const lockAttrs = ['lockMovementX', 'lockMovementY', 'lockRotation', 'lockScalingX', 'lockScalingY']
export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
      isLock: false
    };
  },
  created(){
     this.event.on('selectOne', (items) => {
       this.isLock = !items[0].hasControls
       this.mSelectActive = items[0]
    })
  },
  methods:{
    doLock(isLock){
      isLock ? this.lock() : this.unLock()
    },
    lock(){
      // 修改自定义属性
      this.mSelectActive.hasControls = false
      // 修改默认属性
      lockAttrs.forEach(key => {
        this.mSelectActive[key] = true
      })

      this.isLock = true
      this.canvas.c.renderAll()
    },
    unLock(){
      // 修改自定义属性
      this.mSelectActive.hasControls = true
      // 修改默认属性
      lockAttrs.forEach(key => {
        this.mSelectActive[key] = false
      })

      this.isLock = false
      this.canvas.c.renderAll()
    },
  }
};
</script>

<style scoped lang="less">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
