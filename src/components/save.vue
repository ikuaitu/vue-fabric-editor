<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-04 00:12:54
 * @Description: 保存文件
-->

<template>
  <div>
    <Button @click="clear">清空</Button>
    <Dropdown style="margin-left: 10px" @on-click="saveWith">
      <Button type="primary">保存 <Icon type="ios-arrow-down"></Icon></Button>
      <DropdownMenu slot="list">
        <DropdownItem name="clipboard">复制到剪切板</DropdownItem>
        <DropdownItem name="saveImg">保存为图片</DropdownItem>
        <DropdownItem name="saveSvg">保存为SVG</DropdownItem>
        <DropdownItem name="saveJson" divided>保存为JSON文件</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import select from '@/mixins/select'
import { v4 as uuid } from 'uuid';
export default {
  name: 'saveBar',
  mixins: [select],
  data() {
    return {
    };
  },
  methods: {
    saveWith(type) {
      this[type]()
    },
    saveJson() {
      const dataUrl = this.canvas.c.toJSON(['id'])
      const fileStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataUrl, null, '\t'))}`;
      this.downFile(fileStr,'json')
    },
    saveSvg() {
      const dataUrl = this.canvas.c.toSVG()
      const fileStr = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(dataUrl)}`;
      this.downFile(fileStr,'svg')
    },
    saveImg() {
      const option = { name: 'New Image', format: 'png', quality: 1, multiplier: 2 }
      const dataUrl = this.canvas.c.toDataURL(option)
      this.downFile(dataUrl,'png')
    },
    downFile(fileStr, fileType){
      const anchorEl = document.createElement('a');
      anchorEl.href = fileStr;
      anchorEl.download = uuid() + '.' + fileType;
      document.body.appendChild(anchorEl); // required for firefox
      anchorEl.click();
      anchorEl.remove();
    },
    clipboard() {
      const jsonStr = this.canvas.c.toJSON(['id'])
      this._mixinClipboard(JSON.stringify(jsonStr, null, '\t'))
    },
    clear() {
      this.canvas.c.clear();
      this.canvas.c.setBackgroundColor('#ffffff', this.canvas.c.renderAll.bind(this.canvas.c))
    },
  }
};
</script>

<style scoped lang="less">
</style>
