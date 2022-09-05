<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-05 22:46:31
 * @Description: 导入模板
-->

<template>
<div style="display:inline-block">
  <Divider plain orientation="left">标题模板</Divider>
   <Tooltip :content="item.label"  v-for="(item, i) in  list" :key="i + '-bai1-button'" placement="top">
     <img class="tmpl-img" :alt="item.label" :src="item.src" @click="getTempData(item.tempUrl)">
  </Tooltip>
  <!-- <Divider plain orientation="left">形状模板</Divider> -->
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
      jsonFile: null,
      list:[
        {
          label: '教师节',
          tempUrl: './template/3a7471f2-b8cf-4939-ad1a-a7d586768640.json',
          src: './template/3a7471f2-b8cf-4939-ad1a-a7d586768640.png',
        },
        {
          label: '教师节',
          tempUrl: './template/ef5eb884-28e0-4d79-9e98-a73d759541f8.json',
          src: './template/ef5eb884-28e0-4d79-9e98-a73d759541f8.png',
        },
      ],
    };
  },
  methods:{
    // 插入文件
    insertSvgFile(){
      this.$Spin.show({
          render: (h) => {
              return h('div','正在加载字体，您耐心等候...')
          }
      });
      downFontByJSON(this.jsonFile).then(() => {
        this.$Spin.hide();
        this.canvas.c.loadFromJSON(this.jsonFile, this.canvas.c.renderAll.bind(this.canvas.c));
      }).catch((e) => {
        this.$Spin.hide();
        this.$Message.error('字体加载失败，请重试')
      })
    },
    // 获取模板数据
    getTempData(tmplUrl){
      this.$Spin.show({
          render: (h) => {
              return h('div','加载数据中...')
          }
      });
      const getTemp = this.$http.get(tmplUrl)
      getTemp.then(res => {
        this.jsonFile = JSON.stringify(res.data)
        this.insertSvgFile()
      })
    }
  }
};
</script>

<style scoped lang="less">
.tmpl-img{
  width: 77px;
  cursor: pointer;
  margin-right: 5px;
}
</style>
