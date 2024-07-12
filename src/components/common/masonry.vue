<template>
  <div class="masonry-container" ref="containerRef" @scroll="handleScroll">
    <div class="masonry-list">
      <div
        class="masonry-item"
        v-for="(item, index) in dataState.cardList"
        :key="item.id"
        :style="{
          width: `${dataState.cardPos[index].width}px`,
          height: `${dataState.cardPos[index].height}px`,
          transform: `translate(${dataState.cardPos[index].x}px, ${dataState.cardPos[index].y}px)`,
        }"
      >
        <slot name="item" :item="item" :index="index"></slot>
      </div>
    </div>
    <Spin size="large" fix :show="dataState.loading"></Spin>
  </div>
</template>

<script setup lang="ts">
import { throttle } from 'lodash-es';
interface IVirtualWaterFallProps {
  gap: number;
  column: number;
  bottom: number;
  pageSize: number; // 单次请求数据数量
  request?: (page: number, pageSize: number) => Promise<ICardItem[]>;
}

interface ICardItem {
  id: number | string;
  url: string;
  width: number;
  height: number;
  [key: string]: any;
}

interface ICardPos {
  width: number;
  height: number;
  x: number;
  y: number;
}

const props = defineProps<IVirtualWaterFallProps>();

defineSlots<{
  item(props: { item: ICardItem; index: number }): any;
}>();
const dataState = reactive({
  isFinish: false,
  page: 1,
  cardWidth: 0,
  cardList: [] as ICardItem[],
  cardPos: [] as ICardPos[],
  loading: false,
  columnHeight: new Array(props.column).fill(0) as number[],
});

const containerRef = ref<HTMLDivElement | null>(null);

const getCardList = async (page: number, pageSize: number) => {
  if (dataState.isFinish) return;
  dataState.loading = true;
  const list = await props.request(page, pageSize);
  dataState.page++;
  dataState.loading = false;
  if (!list.length) {
    dataState.isFinish = true;
    return;
  }
  dataState.cardList = [...dataState.cardList, ...list];

  computedCardPos(list);
};

const computedWidth = async () => {
  const containerWidth = containerRef.value.clientWidth;
  dataState.cardWidth = (containerWidth - props.gap * (props.column - 1)) / props.column;
  await getCardList(dataState.page, props.pageSize);
};

const init = async () => {
  if (containerRef.value) {
    await computedWidth();
  }
};

const minColumn = computed(() => {
  let minIndex = -1,
    minHeight = Infinity;

  dataState.columnHeight.forEach((item, index) => {
    if (item < minHeight) {
      minHeight = item;
      minIndex = index;
    }
  });

  return {
    minIndex,
    minHeight,
  };
});

const computedCardPos = (list: ICardItem[]) => {
  list.forEach((item, index) => {
    const cardHeight = Math.floor((item.height * dataState.cardWidth) / item.width);
    if (index < props.column && dataState.cardList.length <= props.pageSize) {
      dataState.cardPos.push({
        width: dataState.cardWidth,
        height: cardHeight,
        x: index ? index * (dataState.cardWidth + props.gap) : 0,
        y: 0,
      });

      dataState.columnHeight[index] = cardHeight + props.gap;
    } else {
      const { minIndex, minHeight } = minColumn.value;
      dataState.cardPos.push({
        width: dataState.cardWidth,
        height: cardHeight,
        x: minIndex ? minIndex * (dataState.cardWidth + props.gap) : 0,
        y: minHeight,
      });
      dataState.columnHeight[minIndex] += cardHeight + props.gap;
    }
  });
};

const handleScroll = throttle(() => {
  const { scrollTop, clientHeight, scrollHeight } = containerRef.value!;
  const bottom = scrollHeight - clientHeight - scrollTop;
  if (bottom <= props.bottom) {
    !dataState.loading && getCardList(dataState.page, props.pageSize);
  }
}, 50);

onMounted(() => {
  init();
});
</script>

<style scoped lang="less">
.masonry {
  &-container {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }
  &-list {
    position: relative;
    width: 100%;
  }
  &-item {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
  }
}
</style>
