<template>
  <div class="masonry-container" ref="containerRef" @scroll="handleScroll">
    <div class="masonry-list" :style="listStyle">
      <div class="masonry-item" v-for="{ item, style } in renderList" :key="item.id" :style="style">
        <slot name="item" :item="item"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CSSProperties, computed, onMounted, onUnmounted, reactive, ref, watch } from 'vue';

import debounce from 'lodash-es/debounce';
import { throttle } from 'lodash-es';

export interface IVirtualWaterFallProps {
  gap: number;
  column: number;
  pageSize: number;
  enterSize?: number;
  request: ICardItem[] | ((page: number, pageSize: number) => Promise<ICardItem[]>);
}

export interface ICardItem {
  id: number | string;
  width: number;
  height: number;
  [key: string]: any;
}

export interface IColumnQueue {
  list: IRenderItem[];
  height: number;
}

// 渲染视图项
export interface IRenderItem {
  item: ICardItem;
  y: number;
  h: number;
  style: CSSProperties;
}

export interface IItemRect {
  width: number;
  height: number;
}

export interface IBookColumnQueue {
  list: IBookRenderItem[];
  height: number;
}

export interface IBookRenderItem {
  item: ICardItem;
  y: number;
  h: number;
  imageHeight: number;
  style: CSSProperties;
}

export interface IBookItemRect {
  width: number;
  height: number;
  imageHeight: number;
}

const props = defineProps<IVirtualWaterFallProps>();

defineSlots<{
  item(props: { item: ICardItem }): any;
}>();

const containerRef = ref<HTMLDivElement | null>(null);

const resizeObserver = new ResizeObserver(() => {
  handleResize();
});

const dataState = reactive({
  loading: false,
  isFinish: false,
  currentPage: 1,
  list: [] as ICardItem[],
});

const scrollState = reactive({
  viewWidth: 0,
  viewHeight: 0,
  start: 0,
});

const queueState = reactive({
  queue: new Array(props.column).fill(0).map<IColumnQueue>(() => ({ list: [], height: 0 })),
  len: 0,
});

const itemSizeInfo = computed(() =>
  dataState.list.reduce<Map<ICardItem['id'], IItemRect>>((pre, current) => {
    const itemWidth = Math.floor(
      (scrollState.viewWidth - (props.column - 1) * props.gap) / props.column
    );
    pre.set(current.id, {
      width: itemWidth,
      height: Math.floor((itemWidth * current.height) / current.width),
    });
    return pre;
  }, new Map())
);

const end = computed(() => scrollState.viewHeight + scrollState.start);

const cardList = computed(() =>
  queueState.queue.reduce<IRenderItem[]>((pre, { list }) => pre.concat(list), [])
);

const renderList = computed(() =>
  cardList.value.filter((i) => i.h + i.y > scrollState.start && i.y < end.value)
);

const computedHeight = computed(() => {
  let minIndex = 0,
    minHeight = Infinity,
    maxHeight = -Infinity;
  queueState.queue.forEach(({ height }, index) => {
    if (height < minHeight) {
      minHeight = height;
      minIndex = index;
    }
    if (height > maxHeight) {
      maxHeight = height;
    }
  });
  return {
    minIndex,
    minHeight,
    maxHeight,
  };
});

const listStyle = computed(
  () => ({ height: `${computedHeight.value.maxHeight}px` } as CSSProperties)
);

watch(
  () => props.column,
  () => {
    handleResize();
  }
);

const addInQueue = (size = props.pageSize) => {
  for (let i = 0; i < size; i++) {
    const minIndex = computedHeight.value.minIndex;
    const currentColumn = queueState.queue[minIndex];
    const before = currentColumn.list[currentColumn.list.length - 1] || null;
    const dataItem = dataState.list[queueState.len];
    const item = generatorItem(dataItem, before, minIndex);
    currentColumn.list.push(item);
    currentColumn.height += item.h;
    queueState.len++;
  }
};

const generatorItem = (item: ICardItem, before: IRenderItem | null, index: number): IRenderItem => {
  const rect = itemSizeInfo.value.get(item.id);
  const width = rect!.width;
  const height = rect!.height;
  let y = 0;
  if (before) y = before.y + before.h + props.gap;

  return {
    item,
    y,
    h: height,
    style: {
      width: `${width}px`,
      height: `${height}px`,
      transform: `translate(${index === 0 ? 0 : (width + props.gap) * index}px, ${y}px)`,
    },
  };
};

const loadDataList = async () => {
  if (dataState.isFinish) return;
  dataState.loading = true;
  let list = [];
  if (!Array.isArray(props.request)) {
    list = await props.request(dataState.currentPage++, props.pageSize);
  } else {
    list = props.request;
  }
  if (!list.length) {
    dataState.isFinish = true;
    return;
  }
  dataState.list = list;
  dataState.loading = false;
  return list.length;
};

const handleScroll = throttle(() => {
  const { scrollTop, clientHeight } = containerRef.value!;
  scrollState.start = scrollTop;
  console.log('handleScroll', dataState.list);
  if (scrollTop + clientHeight > computedHeight.value.minHeight) {
    !dataState.loading &&
      loadDataList().then((len) => {
        len && addInQueue(len);
      });
  }
});

const handleResize = debounce(() => {
  initScrollState();
  reComputedQueue();
}, 300);

const reComputedQueue = () => {
  queueState.queue = new Array(props.column)
    .fill(0)
    .map<IColumnQueue>(() => ({ list: [], height: 0 }));
  queueState.len = 0;
  addInQueue(dataState.list.length);
};

const initScrollState = () => {
  scrollState.viewWidth = containerRef.value!.clientWidth;
  scrollState.viewHeight = containerRef.value!.clientHeight;
  scrollState.start = containerRef.value!.scrollTop;
};

const init = async () => {
  initScrollState();
  resizeObserver.observe(containerRef.value!);
  const len = await loadDataList();
  len && addInQueue(len);
};

onMounted(() => {
  init();
});

onUnmounted(() => {
  resizeObserver.unobserve(containerRef.value!);
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
