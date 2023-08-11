<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-08-11 10:12:00
 * @Description: 导入模板
-->

<template>
  <div>
    <div class="search-box">
      <Cascader
        :data="[allType, ...state.materialTypelist]"
        v-model="state.materialType"
        @on-change="handleChange"
      >
        <Button icon="ios-menu"></Button>
      </Cascader>
      <Input
        class="input"
        :placeholder="state.placeholder"
        v-model="state.search"
        search
        @on-change="search"
      />
    </div>

    <div :key="item.value" v-for="item in state.materialist">
      <Divider plain orientation="left">{{ item.label }}</Divider>
      <Tooltip
        :content="info.label"
        v-for="(info, i) in item.list"
        :key="`${i}-bai1-button`"
        placement="top"
      >
        <img
          class="tmpl-img"
          :alt="info.label"
          v-lazy="info.src"
          @click="beforeClearTip(info.tempUrl)"
        />
      </Tooltip>
    </div>
  </div>
</template>

<script setup name="ImportTmpl" lang="ts">
import useSelect from '@/hooks/select';
import axios from 'axios';
import { Spin, Modal } from 'view-ui-plus';
import { useI18n } from 'vue-i18n';
import { cloneDeep } from 'lodash-es';

const { t } = useI18n();
const { canvasEditor } = useSelect();

interface materialTypeI {
  value: string;
  label: string;
  list?: materialItemI[];
}

interface materialItemI {
  value: string;
  label: string;
  tempUrl: string;
  src: string;
}

const allType: materialTypeI = {
  value: '',
  label: '全部',
};

const state = reactive({
  search: '',
  placeholder: <undefined | string>'',
  jsonFile: <any>null,
  materialType: [''], // 选中分类
  materialTypelist: <materialTypeI[]>[], // 分类列表
  materialist: <materialTypeI[]>[], // 列表内容
});

// 获取素材分类
canvasEditor.getMaterialType('template').then((list: materialTypeI[]) => {
  state.materialTypelist = [...list];
  state.materialist = list;
});

// 插入文件
const insertSvgFile = () => {
  canvasEditor.insertSvgFile(state.jsonFile);
};

// 替换提示
const beforeClearTip = (tmplUrl: string) => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>${t('replaceTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => getTempData(tmplUrl),
  });
};

// 获取模板数据
const getTempData = (tmplUrl: string) => {
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
// 切换素材类型
const handleChange = (e, item) => {
  // 搜索框文字设置
  const { label, value } = item[0];
  state.placeholder = label;
  state.search = '';
  filterTypeList(value);
};

// 模板搜索功能
const filterTypeList = (value: string) => {
  // 全部类型
  if (!value) {
    state.materialist = cloneDeep(state.materialTypelist);
  } else {
    // 当前分类详情
    const materialTypeInfoList =
      state.materialTypelist.filter((item) => item.value === value) || [];
    state.materialist = materialTypeInfoList;
  }

  // 展示分类
  if (state.search) {
    const list = cloneDeep(state.materialist);
    // 按照搜索内容展示
    state.materialist = list.map((item) => {
      if (item.list) {
        item.list = item.list.filter((info) => info.label.includes(state.search));
      }
      return item;
    });
  }
};

const search = () => {
  const [typeValue] = state.materialType;
  filterTypeList(typeValue);
};
</script>

<style scoped lang="less">
.search-box {
  padding-top: 10px;
  display: flex;
  .input {
    margin-left: 10px;
  }
}
.tmpl-img {
  width: 132px;
  cursor: pointer;
  margin-right: 5px;
}
</style>
