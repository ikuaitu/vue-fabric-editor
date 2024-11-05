<!--
 * @Author: 秦少卫
 * @Date: 2024-06-06 16:27:21
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-10-07 17:30:43
 * @Description: 条形码插件
-->

<template>
  <div class="box attr-item-box" v-if="isOne && isMatchType && isBarcode">
    <!-- <h3>字体属性</h3> -->
    <Divider plain orientation="left"><h4>条形码属性</h4></Divider>
    <div>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">代码</span>
          <div class="content">
            <Input v-model="baseAttr.value" @on-change="changeCommon" />
          </div>
        </div>
      </div>

      <div class="flex-view" v-if="baseAttr.displayValue">
        <div class="flex-item">
          <span class="label">文字</span>
          <div class="content">
            <Input v-model="baseAttr.text" @on-change="changeCommon" />
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">显示</span>
          <div class="content">
            <Switch v-model="baseAttr.displayValue" @on-change="changeCommon" />
          </div>
        </div>
        <div class="flex-item" v-if="baseAttr.displayValue">
          <span class="label">垂直</span>
          <div class="content">
            <Select v-model="baseAttr.textPosition" @on-change="changeCommon">
              <Option value="bottom">bottom</Option>
              <Option value="top">top</Option>
            </Select>
          </div>
        </div>
      </div>

      <div class="flex-view" v-if="baseAttr.displayValue">
        <div class="flex-item">
          <RadioGroup
            class="button-group"
            v-model="baseAttr.textAlign"
            @on-change="changeCommon"
            type="button"
          >
            <Radio v-for="(item, i) in textAlignList" :label="item" :key="item">
              <span v-html="textAlignListSvg[i]"></span>
            </Radio>
          </RadioGroup>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">条码</span>
          <div class="content">
            <ColorPicker v-model="baseAttr.lineColor" @on-change="changeCommon" alpha />
          </div>
        </div>
        <div class="flex-item" v-if="baseAttr.displayValue">
          <div class="content">
            <InputNumber
              v-model="baseAttr.fontSize"
              @on-change="changeCommon"
              append="字号"
              :min="1"
            ></InputNumber>
          </div>
        </div>
      </div>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">背景</span>
          <div class="content">
            <ColorPicker v-model="baseAttr.background" @on-change="changeCommon" alpha />
          </div>
        </div>
        <div class="flex-item">
          <span class="label" style="margin-left: 10px">类型</span>
          <div class="content">
            <Select v-model="baseAttr.format" @on-change="changeCommon" style="width: 90px">
              <Option v-for="item in barcodeTypeList" :value="item" :key="item">
                {{ item }}
              </Option>
            </Select>
          </div>
        </div>
      </div>
    </div>
    <!-- <Divider plain></Divider> -->
  </div>
</template>

<script setup name="AttrBute">
import useSelect from '@/hooks/select';
import InputNumber from '@/components/inputNumber';
import { toRaw } from 'vue';

import left from '@/assets/icon/barcode/left.svg?raw';
import right from '@/assets/icon/barcode/right.svg?raw';
import center from '@/assets/icon/barcode/center.svg?raw';

const update = getCurrentInstance();
const { isOne, canvasEditor, isMatchType } = useSelect(['image']);

// 文字元素
const extensionType = ref('');

const isBarcode = computed(() => extensionType.value === 'barcode');

// 属性值
const baseAttr = reactive({
  value: '',
  format: '',
  text: '12121',
  textAlign: 'left',
  textPosition: 'bottom',
  fontSize: 12,
  background: '',
  lineColor: '',
  displayValue: false,
});

// 字体对齐方式
const textAlignList = ['left', 'center', 'right'];
// 对齐图标
const textAlignListSvg = [left, center, right];

// 属性获取
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return;
  extensionType.value = activeObject?.extensionType || '';
  if (activeObject && isMatchType && activeObject?.extensionType === 'barcode') {
    baseAttr.value = activeObject.get('extension').value;
    baseAttr.format = activeObject.get('extension').format;
    baseAttr.text = activeObject.get('extension').text;
    baseAttr.textAlign = activeObject.get('extension').textAlign;
    baseAttr.textPosition = activeObject.get('extension').textPosition;
    baseAttr.fontSize = activeObject.get('extension').fontSize;
    baseAttr.background = activeObject.get('extension').background;
    baseAttr.lineColor = activeObject.get('extension').lineColor;
    baseAttr.displayValue = activeObject.get('extension').displayValue;
  }
};

// 通用属性改变
const changeCommon = () => {
  canvasEditor.setBarcode(toRaw(baseAttr));
  canvasEditor.canvas.renderAll();
};

const selectCancel = () => {
  extensionType.value = '';
  update?.proxy?.$forceUpdate();
};

const barcodeTypeList = ref([]);
barcodeTypeList.value = canvasEditor.getBarcodeTypes();

onMounted(() => {
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
.font-selector {
  :deep(.ivu-select-item) {
    padding: 1px 4px;
  }

  .font-item {
    height: 40px;
    width: 330px;
    background-size: auto 40px;
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
    align-content: center;
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
