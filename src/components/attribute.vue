<template>
  <div class="box" v-if="mixinState.mSelectMode === 'one'">
    <!-- 通用属性 -->
    <div v-show="baseType.includes(mixinState.mSelectOneType)">
      <Divider plain orientation="left">{{ $t('attributes.exterior') }}</Divider>
      <!-- 多边形边数 -->
      <Row v-if="mixinState.mSelectOneType === 'polygon'" :gutter="12">
        <Col flex="0.5">
          <InputNumber
            v-model="baseAttr.points.length"
            :min="3"
            :max="30"
            @on-change="changeEdge"
            append="边数"
          ></InputNumber>
        </Col>
      </Row>
      <!-- 颜色 -->
      <colorSelector
        :color="baseAttr.fill"
        @change="(value) => changeCommon('fill', value)"
      ></colorSelector>
    </div>
  </div>
</template>

<script setup name="AttrBute">
import useSelect from '@/hooks/select';
import colorSelector from '@/components/colorSelector.vue';
import { getPolygonVertices } from '@/utils/math';
import InputNumber from '@/components/inputNumber';
import { Spin } from 'view-ui-plus';

const update = getCurrentInstance();
const { mixinState, canvasEditor } = useSelect();

const fontsList = ref([]);
canvasEditor.getFontList().then((list) => {
  fontsList.value = list;
});
// 通用元素
const baseType = [
  'text',
  'i-text',
  'textbox',
  'rect',
  'circle',
  'triangle',
  'polygon',
  'image',
  'group',
  'line',
  'arrow',
  'thinTailArrow',
];
// 文字元素
// 通用属性
const baseAttr = reactive({
  id: '',
  opacity: 0,
  angle: 0,
  fill: '#fff',
  left: 0,
  top: 0,
  strokeWidth: 0,
  strokeDashArray: [],
  stroke: '#fff',
  shadow: {
    color: '#fff',
    blur: 0,
    offsetX: 0,
    offsetY: 0,
  },
  points: {},
  linkData: [null, null],
});

const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return;
  if (activeObject) {
    // base
    baseAttr.fill = activeObject.get('fill');
    baseAttr.points = activeObject.get('points') || {};
  }
};

const selectCancel = () => {
  baseAttr.fill = '';
  update?.proxy?.$forceUpdate();
};

const init = () => {
  // 获取字体数据
  getObjectAttr();
  canvasEditor.on('selectCancel', selectCancel);
  canvasEditor.on('selectOne', getObjectAttr);
  canvasEditor.canvas.on('object:modified', getObjectAttr);
};

// 通用属性改变
const changeCommon = (key, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  activeObject && activeObject.set(key, value);
  canvasEditor.canvas.renderAll();
};

// 修改边数
const changeEdge = (value) => {
  const activeObjects = canvasEditor.canvas.getActiveObjects();
  if (!activeObjects || !activeObjects.length) return;
  activeObjects[0].set(
    'points',
    getPolygonVertices(value, Math.min(activeObjects[0].width, activeObjects[0].height) / 2)
  );
  canvasEditor.canvas.requestRenderAll();
};

onMounted(init);

onBeforeUnmount(() => {
  canvasEditor.off('selectCancel', selectCancel);
  canvasEditor.off('selectOne', getObjectAttr);
  canvasEditor.canvas.off('object:modified', getObjectAttr);
});
</script>

<style scoped lang="less">
// @import url('vue-color-gradient-picker/dist/index.css');
:deep(.ivu-color-picker) {
  display: block;
}
:deep(.ivu-input-number) {
  display: block;
  width: 100%;
}

:deep(.ivu-divider-plain) {
  &.ivu-divider-with-text-left {
    margin: 10px 0;
    font-weight: bold;
    font-size: 16px;
    color: #000000;
  }
}
.box {
  width: 100%;
}

.button-group {
  display: flex;
  width: 100%;
  .ivu-btn,
  .ivu-radio-wrapper {
    flex: 1;
  }
}

// .flex-view {
//   width: 100%;
//   margin-bottom: 5px;
//   padding: 5px;
//   display: inline-flex;
//   justify-content: space-between;
//   border-radius: 5px;
//   background: #f6f7f9;
// }
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
    width: 60px;
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
    & .ivu-radio-wrapper {
      width: 48px;
      line-height: 40px;
      text-align: center;
      svg {
        vertical-align: baseline;
      }
    }
  }

  :deep(.ivu-btn-group-large) {
    & > .ivu-btn {
      font-size: 24px;
    }
  }

  :deep(.ivu-radio-group-button) {
    &.ivu-radio-group-large .ivu-radio-wrapper {
      font-size: 24px;
    }
  }
}

.ivu-row {
  margin-bottom: 8px;

  .ivu-col {
    position: inherit;
    &__box {
      display: flex;
      align-items: center;
      background: #f8f8f8;
      border-radius: 4px;
      gap: 8px;
    }
  }

  .label {
    padding-left: 8px;
  }

  .content {
    flex: 1;

    :deep(.--input),
    :deep(.ivu-select-selection) {
      background-color: transparent;
      border: none !important;
      box-shadow: none !important;
    }
  }
}
</style>
