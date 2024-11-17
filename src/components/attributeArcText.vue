<template>
  <div class="box attr-item-box" v-if="isOne && isMatchType">
    <Divider plain orientation="left">
      <h4>字体变形属性</h4>
    </Divider>
    <div class="flex-view">
      <div class="flex-item">
        <div class="label">开启</div>
        <Switch v-model="enable" @on-change="onChange" />
      </div>
    </div>
    <div class="flex-view" v-show="enable">
      <div class="flex-item">
        <div class="label">弧度</div>
        <div class="content">
          <Slider
            v-model="radius"
            :max="2000"
            style="width: 100%"
            @on-change="onChangeSlider"
          ></Slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup name="AttributeArcText">
import useSelect from '@/hooks/select';
import { ArcText } from '@kuaitu/core';
import { fabric } from 'fabric';
const textType = ['i-text', 'textbox', 'text', 'arc-text'];
const { canvasEditor, isMatchType, isOne, selectType } = useSelect(textType);
const enable = ref(false);
const radius = ref(331);
const originType = ref();
const baseAttr = reactive({
  fontSize: 0,
  fontFamily: '',
  lineHeight: 0,
  charSpacing: 0,
  fontWeight: '',
  textBackgroundColor: '#fff',
  textAlign: '',
  fontStyle: '',
  underline: false,
  linethrough: false,
  overline: false,
  text: '',
  left: 0,
  top: 0,
  width: 0,
  height: 0,
  fill: '',
});
// 属性获取
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return;
  if (activeObject && isMatchType) {
    baseAttr.fontSize = activeObject.get('fontSize');
    baseAttr.fontFamily = activeObject.get('fontFamily');
    baseAttr.lineHeight = activeObject.get('lineHeight');
    baseAttr.textAlign = activeObject.get('textAlign');
    baseAttr.underline = activeObject.get('underline');
    baseAttr.linethrough = activeObject.get('linethrough');
    baseAttr.charSpacing = activeObject.get('charSpacing');
    baseAttr.overline = activeObject.get('overline');
    baseAttr.fontStyle = activeObject.get('fontStyle');
    baseAttr.textBackgroundColor = activeObject.get('textBackgroundColor');
    baseAttr.fontWeight = activeObject.get('fontWeight');
    baseAttr.top = activeObject.get('top');
    baseAttr.left = activeObject.get('left');
    baseAttr.text = activeObject.get('text');
    baseAttr.width = activeObject.get('width');
    baseAttr.height = activeObject.get('height');
    baseAttr.fill = activeObject.get('fill');
    enable.value = activeObject.get('type') === 'arc-text';
  }
};
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const onChange = () => {
  const text = baseAttr.text;
  const activeObject = canvasEditor.canvas.getActiveObject();
  const objectProperties = activeObject.toObject();
  let textItem = null;
  if (enable.value) {
    const type = activeObject.get('type');
    if (type !== 'arc-text') {
      originType.value = type;
    }
    textItem = new ArcText(text, {
      originType: originType.value,
      fontSize: baseAttr.fontSize,
      fontWeight: baseAttr.fontWeight,
      fontFamily: baseAttr.fontFamily,
      fontStyle: baseAttr.fontStyle,
      lineHeight: baseAttr.lineHeight,
      charSpacing: baseAttr.charSpacing || 1,
      textAlign: baseAttr.textAlign,
      underline: baseAttr.underline,
      overline: baseAttr.overline,
      linethrough: baseAttr.linethrough,
      textBackgroundColor: baseAttr.textBackgroundColor,
      fill: baseAttr.fill,
      radius: 311, // 自定义属性
      curvature: 30, // 自定义属性
      type: 'arc-text',
      left: baseAttr.left,
      top: baseAttr.top,
      width: baseAttr.width,
      height: baseAttr.height,
    });
  } else {
    const type = canvasEditor.canvas.getActiveObject().get('originType');
    const elType = capitalizeFirstLetter(type);
    textItem = new fabric[elType](text, {
      ...objectProperties,
    });
  }
  canvasEditor.del();
  canvasEditor.addBaseType(textItem);
};
const onChangeSlider = () => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  activeObject.setRadius(radius.value);
  canvasEditor.canvas.renderAll();
};
onMounted(() => {
  canvasEditor.on('selectOne', getObjectAttr);
  canvasEditor.canvas.on('object:modified', getObjectAttr);
});
onBeforeUnmount(() => {
  canvasEditor.off('selectOne', getObjectAttr);
  canvasEditor.canvas.off('object:modified', getObjectAttr);
});
</script>

<style scoped lang="less">
:deep(.ivu-input-number) {
  display: block;
  width: 100%;
}

:deep(.ivu-color-picker) {
  display: block;
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
    margin-left: 8px;
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

.font-selector {
  :deep(.ivu-select-item) {
    padding: 1px 4px;
  }

  .font-item {
    height: 40px;
    width: 280px;
    background-size: auto 28px;
    background-repeat: no-repeat;
  }
}

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
  display: flex;
  flex: 1;
  align-items: center;

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
    display: flex;
    align-items: center;
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
