<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-07 00:17:35
 * @Description: 导入模板
-->

<template>
<div style="display:inline-block">
  <Divider plain orientation="left">{{ $t('title_template') }}</Divider>
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
          label: '笔记模板',
          tempUrl: './template/073606d4-22de-491b-8b51-b90d72101d89.json',
          src: './template/073606d4-22de-491b-8b51-b90d72101d89.png',
        },
        {
          label: '醒目封面',
          tempUrl: './template/dcebee41-59b5-408b-a65a-c51bc390be3d.json',
          src: './template/dcebee41-59b5-408b-a65a-c51bc390be3d.png',
        },
        {
          label: '教师节',
          tempUrl: './template/3a7471f2-b8cf-4939-ad1a-a7d586768640.json',
          src: './template/3a7471f2-b8cf-4939-ad1a-a7d586768640.png',
        },
        {
          label: '升职锦囊',
          tempUrl: './template/ef5eb884-28e0-4d79-9e98-a73d759541f8.json',
          src: './template/ef5eb884-28e0-4d79-9e98-a73d759541f8.png',
        },
        {
          label: '古风模板',
          tempUrl: './template/ecc3fca2-f66e-465e-b2c7-80b7522fdb3b.json',
          src: './template/ecc3fca2-f66e-465e-b2c7-80b7522fdb3b.png',
        },
      ],
    };
  },
  methods:{
    // 插入文件
    insertSvgFile(){
      this.$Spin.show({
          render: (h) => {
              return h('div', this.$t('alert.loading_fonts'))
          }
      });
      downFontByJSON(this.jsonFile).then(() => {
        this.$Spin.hide();
        this.canvas.c.loadFromJSON(this.jsonFile, this.canvas.c.renderAll.bind(this.canvas.c));
      }).catch((e) => {
        this.$Spin.hide();
        this.$Message.error(this.$t('alert.loading_fonts_failed'))
      })
    },
    // 获取模板数据
    getTempData(tmplUrl){
      this.$Spin.show({
          render: (h) => {
              return h('div',this.$t('alert.loading_data'))
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
