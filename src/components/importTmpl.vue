<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-17 15:24:00
 * @Description: 导入模板
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
    <div style="height: calc(100vh - 108px)" id="myTemplBox">
      <Scroll
        key="mysscroll"
        v-if="showScroll"
        :on-reach-bottom="nextPage"
        :height="scrollHeight"
        :distance-to-edge="[-1, -1]"
      >
        <!-- 列表 -->
        <div class="list-box">
          <Tooltip :content="info.name" v-for="info in pageData" :key="info.src" placement="top">
            <div class="tmpl-img-box">
              <Image
                lazy
                :src="info.src"
                fit="contain"
                height="100%"
                :alt="info.name"
                @click="beforeClearTip(info.json)"
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

<script setup name="ImportTmpl">
import useSelect from '@/hooks/select';
import usePageList from '@/hooks/pageList';
import { Spin, Modal } from 'view-ui-plus';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
const router = useRouter();
const { t } = useI18n();
const { canvasEditor } = useSelect();

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
  typeUrl: 'templ-types',
  listUrl: 'templs',
  searchTypeKey: 'templ_type',
  searchWordKey: 'name',
  pageSize: 10,
  scrollElement: '#myTemplBox',
});

// 替换提示
const beforeClearTip = (json) => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>${t('replaceTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => getTempData(json),
  });
};

onMounted(() => {
  startPage();
});

// 获取模板数据
const getTempData = (json) => {
  Spin.show({
    render: (h) => h('div', t('alert.loading_data')),
  });
  router.replace('/');
  canvasEditor.loadJSON(JSON.stringify(json), Spin.hide);
};
</script>

<style scoped lang="less">
.search-box {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  .input {
    margin-left: 10px;
  }
  .select {
    width: 100px;
  }
}

.list-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
}

.tmpl-img-box {
  width: 140px;
  cursor: pointer;
  border-radius: 5px;
  overflow: hidden;
  &:hover {
    /deep/.ivu-image-img {
      opacity: 0.8;
    }
  }
}
</style>
