<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-03 22:25:45
 * @Description: 组合元素对齐
-->

<template>
  <ButtonGroup size="small">
      <!-- 水平对齐 -->
      <Button :disabled="notMultiple()" @click="left"><svg t="1650442284704" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2345" width="14" height="14"><path d="M80 24h64v976H80zM198 227h448v190H198zM198 607h746v190H198z" p-id="2346"></path></svg></Button>
      <Button :disabled="notMultiple()" @click="xcenter"><svg t="1650442754876" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1514" width="14" height="14"><path d="M477.312 576V448H266.688a32 32 0 0 1-32-32v-192a32 32 0 0 1 32-32h210.624V34.688a34.688 34.688 0 0 1 69.376 0V192h210.624a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32H546.688v128H896a32 32 0 0 1 32 32v192a32 32 0 0 1-32 32H546.688v157.312a34.688 34.688 0 1 1-69.376 0V832H128a32 32 0 0 1-32-32v-192A32 32 0 0 1 128 576h349.312z" fill="#666666" p-id="1515"></path></svg></Button>
      <Button :disabled="notMultiple()" @click="right"><svg t="1650442299564" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2543" width="14" height="14"><path d="M944 1000h-64V24h64zM826 417H378V227h448zM826 797H80V607h746z" p-id="2544"></path></svg></Button>
      <!-- 垂直对齐 -->
      <Button :disabled="notMultiple()" @click="top"><svg t="1650442692910" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1118" width="14" height="14"><path d="M1170.285714 36.571429a36.571429 36.571429 0 0 1-36.571428 36.571428H36.571429a36.571429 36.571429 0 0 1 0-73.142857h1097.142857a36.571429 36.571429 0 0 1 36.571428 36.571429z m-219.428571 146.285714v512a36.571429 36.571429 0 0 1-36.571429 36.571428h-219.428571a36.571429 36.571429 0 0 1-36.571429-36.571428v-512a36.571429 36.571429 0 0 1 36.571429-36.571429h219.428571a36.571429 36.571429 0 0 1 36.571429 36.571429z m-438.857143 0v804.571428a36.571429 36.571429 0 0 1-36.571429 36.571429h-219.428571a36.571429 36.571429 0 0 1-36.571429-36.571429v-804.571428a36.571429 36.571429 0 0 1 36.571429-36.571429h219.428571a36.571429 36.571429 0 0 1 36.571429 36.571429z" fill="#666666" p-id="1119"></path></svg></Button>
      <Button :disabled="notMultiple()" @click="ycenter"><svg t="1650442732396" class="icon" viewBox="0 0 1243 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1316" width="14" height="14"><path d="M548.571429 472.356571h146.285714V231.643429a36.571429 36.571429 0 0 1 36.571428-36.571429h219.428572a36.571429 36.571429 0 0 1 36.571428 36.571429v240.713142h179.785143a39.643429 39.643429 0 0 1 0 79.286858H987.428571v240.713142a36.571429 36.571429 0 0 1-36.571428 36.571429h-219.428572a36.571429 36.571429 0 0 1-36.571428-36.571429V551.643429h-146.285714V950.857143a36.571429 36.571429 0 0 1-36.571429 36.571428H292.571429a36.571429 36.571429 0 0 1-36.571429-36.571428V551.643429H76.214857a39.643429 39.643429 0 1 1 0-79.286858H256V73.142857A36.571429 36.571429 0 0 1 292.571429 36.571429h219.428571a36.571429 36.571429 0 0 1 36.571429 36.571428v399.213714z" fill="#666666" p-id="1317"></path></svg></Button>
      <Button :disabled="notMultiple()" @click="bottom"><svg t="1650442674784" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="920" width="14" height="14"><path d="M1170.285714 987.428571a36.571429 36.571429 0 0 0-36.571428-36.571428H36.571429a36.571429 36.571429 0 0 0 0 73.142857h1097.142857a36.571429 36.571429 0 0 0 36.571428-36.571429z m-219.428571-146.285714v-512a36.571429 36.571429 0 0 0-36.571429-36.571428h-219.428571a36.571429 36.571429 0 0 0-36.571429 36.571428v512a36.571429 36.571429 0 0 0 36.571429 36.571429h219.428571a36.571429 36.571429 0 0 0 36.571429-36.571429z m-438.857143 0V36.571429a36.571429 36.571429 0 0 0-36.571429-36.571429h-219.428571a36.571429 36.571429 0 0 0-36.571429 36.571429v804.571428a36.571429 36.571429 0 0 0 36.571429 36.571429h219.428571a36.571429 36.571429 0 0 0 36.571429-36.571429z" fill="#666666" p-id="921"></path></svg></Button>
      <!-- 平均对齐 -->
      <Button :disabled="notMultiple()" @click="xequation"><svg t="1650442800956" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1910" width="14" height="14"><path d="M96 0a32 32 0 0 1 32 32v960a32 32 0 0 1-64 0V32A32 32 0 0 1 96 0z m832 0a32 32 0 0 1 32 32v960a32 32 0 0 1-64 0V32a32 32 0 0 1 32-32zM384 800v-576a32 32 0 0 1 32-32h192a32 32 0 0 1 32 32v576a32 32 0 0 1-32 32h-192a32 32 0 0 1-32-32z" fill="#515151" p-id="1911"></path></svg></Button>
      <Button :disabled="notMultiple()" @click="yequation"><svg t="1650442784286" class="icon" viewBox="0 0 1170 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1712" width="14" height="14"><path d="M1170.285714 36.571429a36.571429 36.571429 0 0 1-36.571428 36.571428H36.571429a36.571429 36.571429 0 0 1 0-73.142857h1097.142857a36.571429 36.571429 0 0 1 36.571428 36.571429z m0 950.857142a36.571429 36.571429 0 0 1-36.571428 36.571429H36.571429a36.571429 36.571429 0 0 1 0-73.142857h1097.142857a36.571429 36.571429 0 0 1 36.571428 36.571428zM256 365.714286h658.285714a36.571429 36.571429 0 0 1 36.571429 36.571428v219.428572a36.571429 36.571429 0 0 1-36.571429 36.571428h-658.285714a36.571429 36.571429 0 0 1-36.571429-36.571428v-219.428572a36.571429 36.571429 0 0 1 36.571429-36.571428z" fill="#515151" p-id="1713"></path></svg></Button>
  </ButtonGroup>
</template>

<script>
import select from '@/mixins/select'

export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
      id:'',
      list: []
    };
  },
  methods:{
    // 非多选时，禁止组合对齐操作
    notMultiple(){
      return this.mSelectMode !== 'multiple'
    },
    // 左对齐
    left(){
      const activeObject = this.canvas.c.getActiveObject();
      if (activeObject && activeObject.type === 'activeSelection') {
          const activeSelection = activeObject;
          const activeObjectLeft = -(activeObject.width / 2);
          activeSelection.forEachObject(item => {
            item.set({
                  left: activeObjectLeft,
              });
              item.setCoords();
              this.canvas.c.renderAll();
          });
      }
    },
    // 右对齐
    right(){
      const activeObject = this.canvas.c.getActiveObject();
      if (activeObject && activeObject.type === 'activeSelection') {
            const activeSelection = activeObject;
            const activeObjectLeft = (activeObject.width / 2);
            activeSelection.forEachObject(item => {
              item.set({
                    left: activeObjectLeft - (item.width * item.scaleX),
                });
                item.setCoords();
                this.canvas.c.renderAll();
            });
        }
    },
    // 水平居中对齐
    xcenter(){
      const activeObject = this.canvas.c.getActiveObject();
      if (activeObject && activeObject.type === 'activeSelection') {
            const activeSelection = activeObject;
            activeSelection.forEachObject(item => {
                item.set({
                    left: 0 - ((item.width * item.scaleX) / 2),
                });
                item.setCoords();
                this.canvas.c.renderAll();
            });
        }
    },
    // 垂直居中对齐
    ycenter(){
      const activeObject = this.canvas.c.getActiveObject();
      if (activeObject && activeObject.type === 'activeSelection') {
            const activeSelection = activeObject;
            activeSelection.forEachObject(item => {
                item.set({
                    top: 0 - ((item.height * item.scaleY) / 2),
                });
                item.setCoords();
                this.canvas.c.renderAll();
            });
        }
    },
    // 顶部对齐
    top(){
      const activeObject = this.canvas.c.getActiveObject();
      if (activeObject && activeObject.type === 'activeSelection') {
            const activeSelection = activeObject;
            console.log(activeSelection)
            const activeObjectTop = -(activeObject.height / 2);
            activeSelection.forEachObject(item => {
              item.set({
                    top: activeObjectTop,
                });
                item.setCoords();
                this.canvas.c.renderAll();
            });
        }
    },
    // 底部对齐
    bottom(){
      const activeObject = this.canvas.c.getActiveObject();
      if (activeObject && activeObject.type === 'activeSelection') {
            const activeSelection = activeObject;
            const activeObjectTop = (activeObject.height / 2);
            activeSelection.forEachObject(item => {
              item.set({
                    top: activeObjectTop - (item.height * item.scaleY),
                });
                item.setCoords();
                this.canvas.c.renderAll();
            });
        }
    },
    // 水平平均对齐
    xequation(){
        const activeObject = this.canvas.c.getActiveObject();
        if (activeObject && activeObject.type === 'activeSelection') {
          const activeSelection = activeObject;
          // 排序
          activeSelection._objects.sort((a, b) => {
            return a.left - b.left;
          })

          // 平均间距计算
          const itemSpac = spacWidth()
          // 组原点高度
          const yHeight = (activeObject.width/2)

          activeObject.forEachObject((item, i) => {
            // 获取当前元素之前所有元素的高度
            const preHeight = getItemLeft(i)
            // 顶部距离 间距 * 索引 + 之前元素高度 - 原点高度
            const top = itemSpac * i + preHeight - yHeight
            item.set('left', top)
          })
          this.canvas.c.renderAll();
        }

        // 获取平均间距
        function spacWidth(){
          let count = getAllItemHeight()
          const allSpac = activeObject.width - count
          return allSpac / (activeObject._objects.length - 1)
        }

        // 获取所有元素高度
        function getAllItemHeight(){
          let count = 0;
          activeObject.forEachObject(item => { 
            count += getItemWidth(item)
          })
          return count
        }

        // width属性不准确，需要坐标换算
        function getItemWidth(item){
          return item.aCoords.tr.x - item.aCoords.tl.x
        }
        // 获取当前元素之前所有元素的高度
        function getItemLeft(i){
          if (i === 0) return 0
          let width = 0
          for (let index = 0; index < i; index++) {
            width += getItemWidth(activeObject._objects[index])
          }
          return width
        }
    },
    // 垂直平均对齐
    yequation(){

      const activeObject = this.canvas.c.getActiveObject();
      if (activeObject && activeObject.type === 'activeSelection') {
        const activeSelection = activeObject;
        // 排序
        activeSelection._objects.sort((a, b) => {
          return a.top - b.top;
        })

        // 平均间距计算
        const itemSpac = spacHeight()
        // 组原点高度
        const yHeight = (activeObject.height/2)

        activeObject.forEachObject((item, i) => {
          // 获取当前元素之前所有元素的高度
          const preHeight = getItemTop(i)
          // 顶部距离 间距 * 索引 + 之前元素高度 - 原点高度
          const top = itemSpac * i + preHeight - yHeight
          item.set('top', top)
        })
        this.canvas.c.renderAll();
      }

      // 获取平均间距
      function spacHeight(){
        let count = getAllItemHeight()
        const allSpac = activeObject.height - count
        return allSpac / (activeObject._objects.length - 1)
      }

      // 获取所有元素高度
      function getAllItemHeight(){
        let count = 0;
        activeObject.forEachObject(item => { 
          count += getItemHeight(item)
        })
        return count
      }

      // width属性不准确，需要坐标换算
      function getItemHeight(item){
        return item.aCoords.bl.y - item.aCoords.tl.y
      }
      // 获取当前元素之前所有元素的高度
      function getItemTop(i){
        if (i === 0) return 0
        let height = 0
        for (let index = 0; index < i; index++) {
          height += getItemHeight(activeObject._objects[index])
        }
        return height
      }
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .ivu-btn[disabled]{
  svg{ opacity: 0.2;}
}
</style>
