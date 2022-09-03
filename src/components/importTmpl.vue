<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-03 23:03:20
 * @Description: 导入模板
-->

<template>
<div style="display:inline-block">
  <Divider plain orientation="left">便签模板</Divider>
   <Tooltip :content="item.label"  v-for="(item, i) in  cangList" :key="i + '-bai1-button'" placement="top">
     <img class="tmpl-img" :alt="item.label" :src="item.src" @click="getTempData(item.tempUrl)">
  </Tooltip>
  <!-- 紫色模板 -->
  <Divider plain orientation="left">可用模板</Divider>
  <Button v-for="(item, i) in  keList" :key="i + '-zi-button'" size="small" @click="getTempData(item.tempUrl)">{{item.label}}</Button>
</div>
</template>

<script>
import select from '@/mixins/select'

import FontFaceObserver from 'fontfaceobserver'
export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
      jsonFile: null,
      keList:[
        {
          label: '大字',
          tempUrl: '/template/text.json',
        },
        {
          label: '封面模板',
          tempUrl: '/template/yangshi/fengmian.json',
        },
      ],
      cangList:[
      {
        label: '成语',
        tempUrl: '/template/6870dc08-34a8-420e-b92e-edd862bda729.json',
        src: './svgImg/06f2b39a-03c0-416b-98ca-2af954468bcb.svg',
        },
        {
        label: '成语',
        tempUrl: '/template/64e58c78-cd10-479c-8783-6d34cc4c6725.json',
        src: './svgImg/e356cc49-2c04-4096-840f-65822633bc01.svg',
      },
      {
        label: '成语',
        tempUrl: '/template/9f8557b5-3e58-4f9f-9cbf-ac2fe14b966e.json',
        src: './svgImg/e356cc49-2c04-4096-840f-65822633bc01.svg',
      },
        {
        label: '成语',
        tempUrl: '/template/zhijia.json',
        src: './svgImg/zhijia.svg',
      },
        {
        label: '成语',
        tempUrl: '/template/zhijia1.json',
        src: './svgImg/zhijia1.svg',
      },
      {
        label: '成语',
        tempUrl: '/template/zhao/xinchengyu.json',
        src: './svgImg/517576e9-b59d-4360-9802-75d8e96b9407.svg',
      },
        {
        label: '好看成语',
        tempUrl: '/template/xin/chengyu.json',
        src: './svgImg/7b7ce1fa-24a7-4eed-845f-90f7b4883124.svg',
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
      this.getFonts(this.jsonFile).then(() => {
        this.$Spin.hide();
        this.canvas.c.loadFromJSON(this.jsonFile, this.canvas.c.renderAll.bind(this.canvas.c));
      }).catch((e) => {
        this.$Spin.hide();
        this.$Message.error('字体加载失败，请重试')
      })
    },
    // 获取字体
    getFonts(jsonFile){
      const skipFonts = ['arial','Microsoft YaHei']
      const fontFamilys = JSON.parse(jsonFile).objects.filter(item => {
        // 为text 并且不为跳过字体
        return (item.type.includes('text') && !skipFonts.includes(item.fontFamily))
      }).map(item => item.fontFamily)
      const fontFamilysAll = fontFamilys.map(fontName => {
         const font = new FontFaceObserver(fontName);
         return font.load(null,150000)
      })
      return Promise.all(fontFamilysAll)
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
