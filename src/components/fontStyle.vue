<!--
 * @Author: 秦少卫
 * @Date: 2023-08-05 17:47:35
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-17 16:26:25
 * @Description: 字体样式
-->

<template>
  <div>
    <!-- 搜索组件 -->
    <div class="search-box">
      <Select class="select" v-model="typeValue" @on-change="startGetList" :disabled="pageLoading">
        <Option v-for="item in typeList" :value="item.value" :key="item.value">
          {{ item.label }}
        </Option>
      </Select>
      <Input
        class="input"
        :placeholder="`在${typeText}中搜索`"
        v-model="searchKeyWord"
        search
        :disabled="pageLoading"
        @on-search="startGetList"
      />
    </div>
    <!-- 列表 -->
    <div style="height: calc(100vh - 108px)" id="myTemplBox3">
      <Scroll
        key="mysscroll2"
        v-if="showScroll"
        :on-reach-bottom="nextPage"
        :height="scrollHeight"
        :distance-to-edge="[-1, -1]"
      >
        <!-- 列表 -->
        <div class="img-group">
          <Tooltip :content="info.name" v-for="info in pageData" :key="info.src" placement="top">
            <div class="tmpl-img-box">
              <Image
                lazy
                :src="info.src"
                fit="contain"
                height="100%"
                :alt="info.name"
                @click="addItem(info)"
                @dragend="(e) => dragItem(e, info)"
              />
            </div>
          </Tooltip>
        </div>
        <Spin size="large" fix :show="pageLoading"></Spin>

        <Divider plain v-if="isDownBottm">已经到底了</Divider>
      </Scroll>
    </div>
  </div>
</template>

<script setup name="ImportSvg">
import useSelect from '@/hooks/select';
import usePageList from '@/hooks/pageList';
import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';
import { Spin } from 'view-ui-plus';
import { useI18n } from 'vue-i18n';
const { t } = useI18n();

const {
  startPage,
  typeValue,
  typeText,
  typeList,
  pageLoading,
  pageData,
  searchKeyWord,
  isDownBottm,
  startGetList,
  nextPage,
  showScroll,
  scrollHeight,
} = usePageList({
  typeUrl: 'font-style-types',
  listUrl: 'font-styles',
  searchTypeKey: 'font_style_type',
  searchWordKey: 'name',
  pageSize: 50,
  scrollElement: '#myTemplBox3',
});

const { canvasEditor } = useSelect();

// 按照类型渲染
const dragItem = async (e, item) => {
  Spin.show({
    render: (h) => h('div', t('alert.loading_data')),
  });
  await canvasEditor.downFontByJSON(JSON.stringify(item.json));
  const el = JSON.parse(JSON.stringify(item.json));
  el.id = uuid();
  const elType = capitalizeFirstLetter(el.type);
  new fabric[elType].fromObject(el, (fabricEl) => {
    canvasEditor.dragAddItem(fabricEl, e);
    Spin.hide();
  });
};

const addItem = async (item) => {
  Spin.show({
    render: (h) => h('div', t('alert.loading_data')),
  });
  await canvasEditor.downFontByJSON(JSON.stringify(item.json));
  const el = JSON.parse(JSON.stringify(item.json));
  el.id = uuid();
  const elType = capitalizeFirstLetter(el.type);
  new fabric[elType].fromObject(el, (fabricEl) => {
    canvasEditor.dragAddItem(fabricEl);

    Spin.hide();
  });
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

onMounted(async () => {
  startPage();
});
</script>

<style scoped lang="less">
.search-box {
  padding-top: 10px;
  display: flex;
  .input {
    margin-left: 10px;
  }
  .select {
    width: 100px;
  }
}

.img-group {
  background: #eeeeeea1;
  border-radius: 10px;
  padding: 10px;
}
.tmpl-img-box {
  width: 67px;
  height: 100px;
  padding: 5px;
  cursor: pointer;
  border-radius: 10px;

  &:hover {
    background: #e3e3e3;
  }
}

.tip-text {
  display: block;
  text-align: center;
}
</style>
