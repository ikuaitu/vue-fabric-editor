<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-08-04 13:26:31
 * @Description: 导入模板
-->

<template>
  <div>
    <div class="search-box">
      <Input v-model="state.search" search @on-change="filterList" />
    </div>

    <Divider plain orientation="left">{{ $t('title_template') }}</Divider>
    <Tooltip
      :content="item.label"
      v-for="(item, i) in state.list"
      :key="`${i}-bai1-button`"
      placement="top"
    >
      <img
        class="tmpl-img"
        :alt="item.label"
        v-lazy="item.src"
        @click="beforeClearTip(item.tempUrl)"
      />
    </Tooltip>
  </div>
</template>

<script setup name="ImportTmpl">
import useSelect from '@/hooks/select';
import axios from 'axios';
import { Spin, Modal } from 'view-ui-plus';
import { useI18n } from 'vue-i18n';

const repoSrc = import.meta.env.APP_REPO;
const { t } = useI18n();
const { canvasEditor } = useSelect();

let templList = [];
const state = reactive({
  search: '',
  jsonFile: null,
  list: [
    // {
    //   label: '海报模板',
    //   tempUrl: `${repoSrc}template/49234261-0187-4fdc-be80-f9dfb14c8bc6.json`,
    //   src: `${repoSrc}template/49234261-0187-4fdc-be80-f9dfb14c8bc6.png`,
    // },
  ],
});

// 插入文件
const insertSvgFile = () => {
  canvasEditor.insertSvgFile(state.jsonFile);
};

// 获取模板列表数据
const getTempList = () => {
  Spin.show({
    render: (h) => h('div', t('alert.loading_data')),
  });
  const getTemp = axios.get(`${repoSrc}template/index.json`);
  getTemp
    .then((res) => {
      templList = res.data.data.map((item) => {
        item.tempUrl = repoSrc + item.tempUrl;
        item.src = repoSrc + item.src;
        return item;
      });

      state.list = templList;
      Spin.hide();
    })
    .catch(Spin.hide);
};
// 模板搜索功能
const filterList = () => {
  console.log(state.search);
  if (!state.search) {
    state.list = templList;
    return;
  }
  state.list = templList.filter((item) => item.label.includes(state.search));
};
// 替换提示
const beforeClearTip = (tmplUrl) => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>${t('replaceTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => getTempData(tmplUrl),
  });
};

// 获取模板数据
const getTempData = (tmplUrl) => {
  Spin.show({
    render: (h) => h('div', t('alert.loading_data')),
  });
  const getTemp = axios.get(tmplUrl);
  getTemp.then((res) => {
    state.jsonFile = JSON.stringify(res.data);
    Spin.hide();
    insertSvgFile();
  });
};

getTempList();
</script>

<style scoped lang="less">
.search-box {
  padding-top: 10px;
}
.tmpl-img {
  width: 140px;
  cursor: pointer;
  margin-right: 5px;
}
</style>
