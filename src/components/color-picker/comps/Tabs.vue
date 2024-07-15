<template>
  <div class="my-tabs">
    <div class="my-tabs__header p-0.5 mb-3 rounded bg-gray-100 cursor-pointers">
      <div class="my-tabs__header-shell relative flex justify-between">
        <div
          v-for="(tab, index) in tabs"
          :key="tab.props.label"
          class="my-tab__title relative flex-auto py-1 text-center"
          :class="{ 'my-active': tab.props.label === value }"
          @click="onClickTab(tab, index)"
        >
          {{ tab.props.label }}
        </div>

        <div class="my-tab__slider" :style="sliderStyle"></div>
      </div>
    </div>

    <div class="my-tabs__content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
};
</script>

<script setup>
import { ref, reactive, onMounted, watch, nextTick } from 'vue';

const props = defineProps({
  value: {
    type: String,
    required: true,
  },
});
const emit = defineEmits(['update:value', 'change']);

watch(
  () => props.value,
  () => {
    changeTab();
  }
);

const tabs = ref([]);
const sliderStyle = reactive({ width: 0, left: 0 });
let tabWidth = 0;
onMounted(() => {
  // 初始化数据
  tabWidth = 100 / tabs.value.length;
  sliderStyle.width = `${tabWidth}%`;

  changeTab();
});

let preActiveTabVM = null;
async function changeTab(index = -1) {
  if (index < 0) {
    index = tabs.value.findIndex((vm) => vm.props.label === props.value);
  }
  sliderStyle.left = `${tabWidth * index}%`;

  // 切换 tab 内容
  try {
    await nextTick();
    preActiveTabVM?.exposed?.changeActive?.(false);
    preActiveTabVM = tabs.value[index];
    preActiveTabVM.exposed?.changeActive?.(true);
  } catch (error) {
    console.log(error);
  }
}

function onClickTab(tab, index) {
  emit('update:value', tab.props.label);
  changeTab(index);
}

defineExpose({ tabs });
</script>

<style scoped>
.my-tabs__header {
  margin-bottom: 0.75rem;
  border-radius: 0.25rem;
  --tw-bg-opacity: 1;
  background-color: rgb(243 244 246 / var(--tw-bg-opacity));
  padding: 0px;
  padding: 0.125rem;
}

.my-tabs__header-shell {
  justify-content: space-between;
  position: relative;
  display: flex;
}

.my-tab__title {
  text-align: center;
  position: relative;
  flex: 1 1 auto;
  padding-top: 0.25rem;
  padding-bottom: 0.25rem;
  z-index: 1;
}
.my-tab__title.my-active {
  font-weight: bold;
}

.my-tab__slider {
  position: absolute;
  bottom: 0px;
  top: 0px;
  border-radius: 0.25rem;
  --tw-bg-opacity: 1;
  background-color: rgb(255 255 255 / var(--tw-bg-opacity));
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
    var(--tw-shadow);
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  transition-duration: 150ms;
}
</style>
