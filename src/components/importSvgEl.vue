<!--
 * @Author: 秦少卫
 * @Date: 2023-08-05 17:47:35
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-08-07 22:59:07
 * @Description: file content
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
          @click="addItem"
          v-lazy="info.src"
          @dragend="dragItem"
        />
      </Tooltip>
    </div>
  </div>
</template>

<script setup name="ImportSvg" lang="ts">
import useSelect from '@/hooks/select';
import { cloneDeep } from 'lodash-es';
import { v4 as uuid } from 'uuid';

const { fabric, canvasEditor } = useSelect();

const defaultPosition = {
  left: 100,
  top: 100,
  shadow: '',
  fontFamily: '1-1',
};

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
canvasEditor.getMaterialType('svg').then((list: materialTypeI[]) => {
  state.materialTypelist = [...list];
  state.materialist = list;
});

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

const dragItem = (event) => {
  const url = event.target.src;
  // 会有性能开销 dragAddItem复用更简洁
  fabric.loadSVGFromURL(url, (objects) => {
    const item = fabric.util.groupSVGElements(objects, {
      shadow: '',
      fontFamily: 'arial',
      id: uuid(),
      name: 'svg元素',
    });
    canvasEditor.dragAddItem(event, item);
  });
};

// 按照类型渲染
const addItem = (e) => {
  const url = e.target.src;
  fabric.loadSVGFromURL(url, (objects, options) => {
    const item = fabric.util.groupSVGElements(objects, {
      ...options,
      ...defaultPosition,
      id: uuid(),
      name: 'svg元素',
    });
    canvasEditor.canvas.add(item);
    canvasEditor.canvas.setActiveObject(item);
    canvasEditor.canvas.requestRenderAll();
  });
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
  display: inline-block;
  width: 53px;
  margin-left: 2px;
  margin-bottom: 2px;
  background: #f5f5f5;
  padding: 6px;
  cursor: pointer;
  // width: 135px;
  // cursor: pointer;
  // margin-right: 5px;
}
</style>
