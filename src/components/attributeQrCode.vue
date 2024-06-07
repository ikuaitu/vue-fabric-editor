<!--
 * @Author: 秦少卫
 * @Date: 2024-06-06 20:04:48
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-07 20:56:55
 * @Description: 二维码组件
-->

<template>
  <div
    class="box attr-item-box"
    v-if="
      mixinState.mSelectMode === 'one' && textType.includes(mixinState.mSelectOneType) && isQrcode
    "
  >
    <!-- <h3>字体属性</h3> -->
    <Divider plain orientation="left"><h4>二位码属性</h4></Divider>
    <div>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">内容</span>
          <div class="content">
            <Input v-model="baseAttr.data" @on-change="changeCommon" />
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <div class="content">
            <InputNumber
              v-model="baseAttr.width"
              @on-change="changeCommon"
              append="宽度"
              :min="1"
            ></InputNumber>
          </div>
        </div>
        <div class="flex-item">
          <div class="content">
            <InputNumber
              v-model="baseAttr.margin"
              @on-change="changeCommon"
              append="边距"
              :min="1"
            ></InputNumber>
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">散点</span>
          <div class="content">
            <ColorPicker v-model="baseAttr.dotsColor" @on-change="changeCommon" alpha />
          </div>
        </div>
        <div class="flex-item">
          <span class="label" style="margin-left: 10px">类型</span>
          <div class="content">
            <Select v-model="baseAttr.dotsType" @on-change="changeCommon" style="width: 90px">
              <Option v-for="item in optionsList.DotsType" :value="item" :key="item">
                {{ item }}
              </Option>
            </Select>
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">外角</span>
          <div class="content">
            <ColorPicker v-model="baseAttr.cornersSquareColor" @on-change="changeCommon" alpha />
          </div>
        </div>
        <div class="flex-item">
          <span class="label" style="margin-left: 10px">类型</span>
          <div class="content">
            <Select
              v-model="baseAttr.cornersSquareType"
              @on-change="changeCommon"
              style="width: 90px"
            >
              <Option v-for="item in optionsList.cornersDotType" :value="item" :key="item">
                {{ item }}
              </Option>
            </Select>
          </div>
        </div>
      </div>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">内角</span>
          <div class="content">
            <ColorPicker v-model="baseAttr.cornersDotColor" @on-change="changeCommon" alpha />
          </div>
        </div>
        <div class="flex-item">
          <span class="label" style="margin-left: 10px">类型</span>
          <div class="content">
            <Select v-model="baseAttr.cornersDotType" @on-change="changeCommon" style="width: 90px">
              <Option v-for="item in optionsList.cornersDotType" :value="item" :key="item">
                {{ item }}
              </Option>
            </Select>
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
          <span class="label" style="margin-left: 10px">容错</span>
          <div class="content">
            <Select
              v-model="baseAttr.errorCorrectionLevel"
              @on-change="changeCommon"
              style="width: 90px"
            >
              <Option
                v-for="item in optionsList.errorCorrectionLevelType"
                :value="item"
                :key="item"
              >
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

const update = getCurrentInstance();
const { mixinState, canvasEditor } = useSelect();

// 文字元素
const textType = ['image'];
const extensionType = ref('');

const isQrcode = computed(() => extensionType.value === 'qrcode');

// 属性值
const baseAttr = reactive({
  data: '',
  width: 300,
  margin: 10,
  errorCorrectionLevel: 'M',
  dotsColor: 'red',
  dotsType: 'rounded',
  cornersSquareColor: 'black',
  cornersSquareType: 'dot',
  cornersDotColor: 'black',
  cornersDotType: 'square',
  background: '#ffffff',
});

// 属性获取
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return;
  extensionType.value = activeObject?.extensionType || '';
  if (
    activeObject &&
    textType.includes(activeObject.type) &&
    activeObject?.extensionType === 'qrcode'
  ) {
    const extension = activeObject.get('extension');
    Object.keys(extension).forEach((key) => {
      baseAttr[key] = extension[key];
    });
  }
};

// 通用属性改变
const changeCommon = () => {
  canvasEditor.setQrCode(toRaw(baseAttr));
  canvasEditor.canvas.renderAll();
};

const selectCancel = () => {
  extensionType.value = '';
  update?.proxy?.$forceUpdate();
};

// 容错率

const res = canvasEditor.getQrCodeTypes();
const optionsList = reactive(res);

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
