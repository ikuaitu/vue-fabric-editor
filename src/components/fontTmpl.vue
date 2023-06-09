<!--
 * @Author: 秦少卫
 * @Date: 2023-04-03 23:01:21
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-06-04 15:31:50
 * @Description: 字体文件
-->

<template>
  <div style="display: inline-block">
    <Divider plain orientation="left">{{ $t('title_template') }}</Divider>
    <Tooltip
      :content="item.label"
      v-for="(item, i) in list"
      :key="`${i}-bai1-button`"
      placement="top"
    >
      <img
        class="tmpl-img"
        :alt="item.label"
        v-lazy="item.src"
        @click="getTempData(item.tempUrl)"
      />
    </Tooltip>
  </div>
</template>

<script>
import select from '@/mixins/select';
// import { downFontByJSON } from '@/utils/utils';
import { v4 as uuid } from 'uuid';
import axios from 'axios';
const repoSrc = import.meta.env.APP_REPO;
export default {
  name: 'ToolBar',
  mixins: [select],
  inject: ['canvas', 'fabric'],
  data() {
    return {
      jsonFile: null,
      list: [
        {
          label: '字体',
          tempUrl: `${repoSrc}font-tmpl/1.json`,
          src: `${repoSrc}font-tmpl/1.png`,
        },
        {
          label: '字体',
          tempUrl: `${repoSrc}font-tmpl/2.json`,
          src: `${repoSrc}font-tmpl/2.png`,
        },
        {
          label: '字体',
          tempUrl: `${repoSrc}font-tmpl/3.json`,
          src: `${repoSrc}font-tmpl/3.png`,
        },
        {
          label: '字体',
          tempUrl: `${repoSrc}font-tmpl/4.json`,
          src: `${repoSrc}font-tmpl/4.png`,
        },
        {
          label: '字体',
          tempUrl: `${repoSrc}font-tmpl/5.json`,
          src: `${repoSrc}font-tmpl/5.png`,
        },
      ],
    };
  },
  methods: {
    // 插入文件
    insertFile(str) {
      this.$Spin.show({
        render: (h) => h('div', this.$t('alert.loading_fonts')),
      });
      const obj = JSON.parse(str);
      obj.id = uuid();
      new this.fabric.Textbox.fromObject(obj, (e) => {
        this.canvas.c.add(e);
        e.center();
        this.canvas.c.setActiveObject(e);
        this.$Spin.hide();
      });
    },
    // 获取模板数据
    getTempData(tmplUrl) {
      this.$Spin.show({
        render: (h) => h('div', this.$t('alert.loading_data')),
      });
      const getTemp = axios.get(tmplUrl);
      getTemp.then((res) => {
        this.insertFile(JSON.stringify(res.data));
      });
    },
  },
};
</script>

<style scoped lang="less">
.tmpl-img {
  width: 86px;
  cursor: pointer;
  margin-right: 5px;
}
</style>
