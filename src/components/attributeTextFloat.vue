<!--
 * @Author: 秦少卫
 * @Date: 2024-06-10 17:52:40
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-10 19:58:38
 * @Description: 小数点下标上标
-->

<template>
  <div v-if="mixinState.mSelectMode === 'one' && isMatchType" class="attr-item-box">
    <div class="flex-view">
      <div class="flex-item">
        <span class="label">{{ $t('textFloat') }}</span>
        <div class="content">
          <Select
            v-model="baseAttr.verticalAlign"
            @on-change="(value) => changeCommon('verticalAlign', value)"
          >
            <Option value="null">无</Option>
            <Option value="bottom">下标</Option>
            <Option value="top">上标</Option>
          </Select>
        </div>
      </div>
    </div>
  </div>
</template>

<script name="Price" setup>
import useSelect from '@/hooks/select';

const { mixinState, canvasEditor } = useSelect();

const baseAttr = reactive({
  verticalAlign: 'null',
});

const matchType = ['i-text', 'textbox', 'text'];

const isMatchType = computed(() => matchType.includes(mixinState.mSelectOneType));
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return;
  if (activeObject && matchType.includes(activeObject.type) && activeObject.text.includes('.')) {
    baseAttr.verticalAlign = activeObject.get('verticalAlign');
  }
};

const changeCommon = (key, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject && activeObject.text.includes('.')) {
    const [init] = activeObject.text.split('.');
    const startIndex = init.length + 1;
    const endIndex = activeObject.text.length;
    activeObject.styles = [];
    // 上标
    if (value === 'top') {
      activeObject.setSuperscript(startIndex, endIndex);
    } else if (value === 'bottom') {
      // 下标
      activeObject.setSelectionStyles(
        {
          fontSize: activeObject.superscript.size * activeObject.fontSize,
        },
        startIndex,
        endIndex
      );
    }
    activeObject.set(key, value);
    canvasEditor.canvas.renderAll();
  }
};

const update = getCurrentInstance();
const selectCancel = () => {
  update?.proxy?.$forceUpdate();
};

onMounted(() => {
  // 获取字体数据
  getObjectAttr();
  canvasEditor.on('selectCancel', selectCancel);
  canvasEditor.on('selectOne', getObjectAttr);
  canvasEditor.canvas.on('object:modified', getObjectAttr);
});

onBeforeUnmount(() => {
  canvasEditor.off('selectCancel', selectCancel);
  canvasEditor.off('selectOne', getObjectAttr);
  canvasEditor.canvas.off('object:modified', getObjectAttr);
});
</script>

<style scoped lang="less">
.flex-view {
  width: 100%;
  margin-bottom: 5px;
  padding: 5px;
  display: inline-flex;
  justify-content: space-between;
  border-radius: 5px;
  background: #f6f7f9;
}
.flex-item {
  display: inline-flex;
  flex: 1;
  .label {
    width: 32px;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    font-size: 14px;
    // color: #333333;
  }
  .content {
    flex: 1;
    // width: 60px;
  }
  .slider-box {
    width: calc(100% - 50px);
    margin-left: 10px;
  }
  .left {
    flex: 1;
  }
  .right {
    flex: 1;
    margin-left: 10px;
    :deep(.ivu-input-number) {
      display: block;
      width: 100%;
    }
  }
  :deep(.ivu-slider-wrap) {
    margin: 13px 0;
  }
  :deep(.ivu-radio-group-button) {
    display: flex;
    flex: 1;
    width: 100%;
    & .ivu-radio-wrapper {
      // width: 48px;
      flex: 1;
      line-height: 40px;
      text-align: center;
      svg {
        vertical-align: baseline;
      }
    }
  }

  :deep(.ivu-btn-group) {
    display: flex;
    flex: 1;
    .ivu-btn {
      flex: 1;
    }
  }

  :deep(.ivu-btn-group-large) {
    & > .ivu-btn {
      font-size: 24px;
      flex: 1;
    }
  }

  :deep(.ivu-radio-group-button) {
    &.ivu-radio-group-large .ivu-radio-wrapper {
      font-size: 24px;
    }
  }
}
</style>
