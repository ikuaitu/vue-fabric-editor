<!--
 * @Author: 秦少卫
 * @Date: 2024-06-11 16:34:23
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-12 15:41:52
 * @Description: 分页组件
-->

<template>
  <!-- 列表 -->
  <div class="page-list-box" style="height: calc(100vh - 100px)" :id="props.DOMId">
    <Scroll
      :key="props.DOMId"
      v-if="showScroll"
      :on-reach-bottom="nextPage"
      :height="scrollHeight"
      :distance-to-edge="[-1, -1]"
    >
      <div class="img-box" v-if="pageData.length">
        <!-- 列表 -->
        <div class="img-item" v-for="info in pageData" :key="info.id">
          <Tooltip :content="info.name" placement="top">
            <Image
              lazy
              :src="info.src"
              @click="(e) => emit('click', { info, e })"
              @dragend="(e) => emit('dragend', { info, e })"
              fit="contain"
              width="100%"
              height="100%"
              :alt="info.name"
            />
          </Tooltip>
        </div>
      </div>
      <Spin size="large" fix :show="pageLoading"></Spin>
      <Divider plain v-if="isDownBottom">{{ pageData.length ? '已经到底了' : '暂无内容' }}</Divider>
    </Scroll>
  </div>
</template>

<script name="ImportJson" setup>
import usePageList from '@/hooks/usePageList';

const emit = defineEmits(['back', 'click', 'dragend']);

const props = defineProps({
  pageListApi: {
    type: Function,
  },
  filters: {
    type: Object,
  },
  DOMId: {
    type: String,
    default: '',
  },
  formatData: {
    type: Function,
  },
});

const sort = [];

// 通用分页
const {
  pageData,
  showScroll,
  scrollHeight,
  isDownBottom,
  pageLoading,
  startPage,
  startGetList,
  nextPage,
} = usePageList({
  el: '#' + props.DOMId,
  apiClient: props.pageListApi,
  filters: props.filters,
  sort,
  fields: [],
  formatData: props.formatData,
});

onMounted(async () => {
  startPage();
});

defineExpose({
  startGetList,
  startPage,
});
</script>
<style scoped lang="less">
.page-list-box {
  margin-top: 10px;
}
:deep(.ivu-scroll-container) {
  div.ivu-scroll-loader:first-child {
    height: 0;
  }
}
:deep(.ivu-divider-horizontal) {
  &.ivu-divider-with-text-center {
    margin-bottom: 0;
  }
}
:deep(.ivu-tooltip-rel) {
  display: block;
  position: relative;
  width: 100%;
  height: 100%;
}

:deep(.ivu-tooltip) {
  display: block;
  height: 100%;
  width: 100%;
}

.img-box {
  display: grid;
  display: grid;
  grid-template-columns: repeat(3, 90px);
  grid-auto-rows: 90px;
  grid-row-gap: 10px;
  justify-content: space-between;
  padding: 8px;
  background: #f1f2f4;
  border-radius: 10px;
  margin-bottom: 10px;
  .img-item {
    border-radius: 5px;
    padding: 5px;
    cursor: pointer;
    &:hover {
      background: #bababa;
    }
  }
}
</style>
