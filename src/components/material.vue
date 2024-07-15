<!--
 * @Author: 秦少卫
 * @Date: 2024-05-17 15:31:24
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-07-06 17:16:52
 * @Description: 素材列表
-->

<template>
  <div>
    <!-- 搜索组件 -->
    <searchType
      ref="selectTypeRef"
      :typeListApi="getMaterialTypes"
      @change="searchChange"
    ></searchType>

    <!-- 分类列表 -->
    <typeList
      v-show="!filters.material_type.$contains && !filters.name.$contains"
      :typeApi="getMaterialTypes"
      :typeListApi="getMaterialsByType"
      typeKey="material_type"
      :formatData="formatData"
      @selectType="selectType"
      @click="addItem"
      @dragend="dragItem"
    ></typeList>

    <!-- 搜索分页列表 -->
    <pageList
      v-if="filters.material_type.$contains || filters.name.$contains"
      DOMId="materialList"
      :pageListApi="getMaterials"
      :filters="filters"
      @click="addItem"
      :formatData="formatData"
      @dragend="dragItem"
    ></pageList>
  </div>
</template>

<script setup name="ImportSvg">
import searchType from '@/components/common/searchType';
import typeList from '@/components/common/typeList.vue';
import pageList from '@/components/common/pageList.vue';
import useSelect from '@/hooks/select';
import { getMaterialInfoUrl, getMaterialPreviewUrl } from '@/hooks/usePageList';
import { getMaterialTypes, getMaterialsByType, getMaterials } from '@/api/material';
import useCalculate from '@/hooks/useCalculate';
import { useRoute } from 'vue-router';
import { Utils } from '@kuaitu/core';

const { canvasEditor } = useSelect();

const { isOutsideCanvas } = useCalculate();
const selectTypeRef = ref();

const filters = reactive({
  material_type: {
    $contains: '',
  },
  name: {
    $contains: '',
  },
});

// 分页格式化
const formatData = (data) => {
  return data.map((item) => {
    return {
      id: item.id,
      name: item.attributes.name,
      desc: item.attributes.desc,
      src: getMaterialInfoUrl(item.attributes.img),
      previewSrc: getMaterialPreviewUrl(item.attributes.img),
    };
  });
};

// 搜索改变
const searchChange = async ({ searchKeyWord, typeValue }) => {
  filters.name.$contains = '';
  filters.material_type.$contains = '';
  await nextTick();
  filters.name.$contains = searchKeyWord;
  filters.material_type.$contains = typeValue;
};

// 分类列表选择
const selectType = async (type) => {
  filters.material_type.$contains = type;
  selectTypeRef.value.setType(type);
  await nextTick();
};

// 按照类型渲染
const dragItem = async ({ e }) => {
  if (isOutsideCanvas(e.clientX, e.clientY)) return;
  const imgItem = await canvasEditor.createImgByElement(e.target);
  canvasEditor.addBaseType(imgItem, {
    scale: true,
    event: e,
  });
};

const addItem = async ({ e }) => {
  const imgItem = await canvasEditor.createImgByElement(e.target);
  canvasEditor.addBaseType(imgItem, {
    scale: true,
  });
};

onMounted(async () => {
  // 默认添加图片
  const route = useRoute();
  if (route?.query?.loadFile) {
    const url = route.query.loadFile;
    const image = await Utils.insertImgFile(url);
    addItem({ target: image });
  }
});
</script>

<style scoped lang="less"></style>
