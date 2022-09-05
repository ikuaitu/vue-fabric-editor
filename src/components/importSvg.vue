<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-05 22:36:02
 * @Description: 插入SVG元素
-->

<template>
<div style="display:inline-block">
  <Button @click="insert" size="small">插入SVG元素</Button>
  <Modal
        v-model="showModal"
        title="请选择"
        @on-ok="insertSvg"
        @on-cancel="showModal = false">
        <RadioGroup v-model="insertType" type="button" button-style="solid" style="padding-bottom:  10px">
            <Radio label="string">字符串</Radio>
            <Radio label="file">文件</Radio>
        </RadioGroup>
        <!-- 字符串 -->
        <Input v-if="insertType === 'string'" v-model="svgStr" show-word-limit type="textarea" placeholder="请输入SVG字符" />
        <!-- 文件 -->
        <Upload v-if="insertType === 'file'" :before-upload="handleUpload" action="#">
            <Button icon="ios-cloud-upload-outline">选择SVG文件</Button>
        </Upload>
    </Modal>
</div>
</template>

<script>
import { getImgStr } from "@/utils/utils";
import select from '@/mixins/select'
import { v4 as uuid } from 'uuid';
export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
      insertType: 'string',  // 插入类型 file | string
      showModal: false,
      svgStr: '',
      svgFile: null,
    };
  },
  methods:{
    insert(){
      this.svgStr = ''
      this.svgFile = null
      this.showModal = true
    },
    insertSvg(){
      if(this.insertType === 'string'){
        this.insertSvgStr()
      }else{
        this.insertSvgFile()
      }
    },
    // 插入字符串元素
    insertSvgStr(){
      const This = this
      this.fabric.loadSVGFromString(this.svgStr, function(objects, options) {
        const item = This.fabric.util.groupSVGElements(objects, {...options, name: 'defaultSVG', id: uuid()});
        This.canvas.c.add(item).centerObject(item).renderAll();
      });
    },
    // 插入文件元素
    insertSvgFile(){
      const This = this
       this.fabric.loadSVGFromURL(this.svgFile, function(objects, options) {
        const item = This.fabric.util.groupSVGElements(objects, {...options, name: 'defaultSVG', id: uuid()});
        This.canvas.c.add(item).centerObject(item).renderAll();
      });
    },
    handleUpload (file) {
      getImgStr(file).then(res => {
        this.svgFile = res
      })
    },
  }
};
</script>

<style scoped lang="less">
</style>
