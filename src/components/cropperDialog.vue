<template>
  <Modal
    v-model="visible"
    @on-ok="onOk"
    @on-cancel="onCancel"
    title="图片裁剪"
    width="80%"
    style="height: 80%"
  >
    <div class="main">
      <Spin size="large" fix :show="loading">图片加载中...</Spin>
      <div class="options">
        <label>裁剪比例</label>
        <div class="flex mt-2 ratio-item-wrapper">
          <div class="ratio-item" :class="{ active: !fixed }" @click="changeRatio()">自由</div>
          <div
            class="ratio-item"
            :class="{ active: fixed && fixedRatio[0] === 1 && fixedRatio[1] === 1 }"
            @click="changeRatio([1, 1])"
          >
            <div class="ratio-item-content" style="height: 70px; width: 70px">1:1</div>
          </div>
          <div
            class="ratio-item"
            :class="{ active: fixed && fixedRatio[0] === 2 && fixedRatio[1] === 3 }"
            @click="changeRatio([2, 3])"
          >
            <div class="ratio-item-content" style="height: 70px; width: calc(70px * 2 / 3)">
              2:3
            </div>
          </div>
          <div
            class="ratio-item"
            :class="{ active: fixed && fixedRatio[0] === 3 && fixedRatio[1] === 2 }"
            @click="changeRatio([3, 2])"
          >
            <div class="ratio-item-content" style="height: calc(70px * 2 / 3); width: 70px">
              3:2
            </div>
          </div>
          <div
            class="ratio-item"
            :class="{ active: fixed && fixedRatio[0] === 4 && fixedRatio[1] === 3 }"
            @click="changeRatio([4, 3])"
          >
            <div class="ratio-item-content" style="height: calc(70px * 3 / 4); width: 70px">
              4:3
            </div>
          </div>
          <div
            class="ratio-item"
            :class="{ active: fixed && fixedRatio[0] === 3 && fixedRatio[1] === 4 }"
            @click="changeRatio([3, 4])"
          >
            <div class="ratio-item-content" style="width: calc(70px * 3 / 4); height: 70px">
              3:4
            </div>
          </div>
          <div
            class="ratio-item"
            :class="{ active: fixed && fixedRatio[0] === 16 && fixedRatio[1] === 9 }"
            @click="changeRatio([16, 9])"
          >
            <div class="ratio-item-content" style="height: calc(70px * 9 / 16); width: 70px">
              16:9
            </div>
          </div>
          <div
            class="ratio-item"
            :class="{ active: fixed && fixedRatio[0] === 9 && fixedRatio[1] === 16 }"
            @click="changeRatio([9, 16])"
          >
            <div class="ratio-item-content" style="width: calc(70px * 9 / 16); height: 70px">
              9:16
            </div>
          </div>
        </div>
        <label>当前尺寸</label>
        <div class="flex mt-2">
          <Input
            v-model="cropperWidth"
            type="number"
            @change="changeCropperSize('width', Number($event.target.value))"
          />
          <span class="mx-2">X</span>
          <Input
            v-model="cropperHeight"
            type="number"
            @change="changeCropperSize('height', Number($event.target.value))"
          />
        </div>
      </div>
      <div class="cropper-wrapper">
        <VueCropper
          ref="cropperRef"
          :img="img"
          :outputSize="1"
          outputType="png"
          autoCrop
          :fixed="fixed"
          :fixedNumber="fixedRatio"
          centerBox
          :fixedBox="false"
          full
          @realTime="onPreview"
        />
      </div>
      <div class="preview-wrapper">
        <div
          style="height: 100px; width: 100px; border: 1px solid rgba(59, 130, 246, 0.5)"
          :style="previewStyle"
        >
          <div :style="previews.div" v-if="previews">
            <img :src="previews.url" :style="{ ...previews.img, maxWidth: previews.img.width }" />
          </div>
        </div>

        <div class="title">预览</div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import 'vue-cropper/dist/index.css';
import { VueCropper } from 'vue-cropper';
// import { blobToFile } from '../../views/creation/createShortVideo/components/framesContent/utils'

const visible = ref(false);

const cropperRef = ref();

const img = ref();

const previewStyle = ref({
  width: '100px',
  height: '100px',
  overflow: 'hidden',
  margin: '0',
});

const loading = ref(false);

const previews = ref();

const cropperWidth = ref(0);
const cropperHeight = ref(0);

function changeCropperSize(type: 'width' | 'height', value: number) {
  if (fixed.value) {
    if (type === 'width') {
      cropperHeight.value = (value * fixedRatio.value[1]) / fixedRatio.value[0];
    } else {
      cropperWidth.value = (value * fixedRatio.value[0]) / fixedRatio.value[1];
    }
  }
  nextTick(() => {
    cropperRef.value.goAutoCrop(Number(cropperWidth.value), Number(cropperHeight.value));
  });
}

function onPreview(_previews) {
  if (_previews.w === 0 && _previews.h === 0) {
    loading.value = true;
  } else {
    loading.value = false;
  }
  console.log('🚀 ~ onPreview ~ _previews:', _previews);
  cropperWidth.value = _previews.w;
  cropperHeight.value = _previews.h;
  previewStyle.value = {
    width: _previews.w + 'px',
    height: _previews.h + 'px',
    overflow: 'hidden',
    margin: '0',
    zoom: 100 / _previews.w,
  };

  previews.value = _previews;
}

function onCancel() {
  visible.value = false;
}
const fixedRatio = ref([1, 1]);
const fixed = ref(false);
function changeRatio(ratio?: [number, number]) {
  if (ratio) {
    fixed.value = true;
    fixedRatio.value = ratio;
    // 宽度不变，按照比例修改高度
    // cropperHeight.value = (cropperWidth.value * ratio[1]) / ratio[0];
  } else {
    fixed.value = false;
  }
  nextTick(() => {
    cropperRef.value.goAutoCrop(9999, 9999);
  });
}

let _callback = null;
function onOk() {
  cropperRef.value.getCropData((data) => {
    _callback && _callback(data);
    visible.value = false;
  });
}

defineExpose({
  open(data, callback) {
    img.value = data.img;
    _callback = callback;
    visible.value = true;
  },
});
</script>

<style scoped lang="less">
.main {
  display: flex;
  align-items: stretch;
  min-height: 600px;
  position: relative;
}

.options {
  width: 256px;
  .mt-2 {
    margin-top: 8px;
  }
  .flex {
    display: flex;
    align-items: center;
  }
  .mx-2 {
    margin: 0 8px;
  }
}

.cropper-wrapper {
  flex: 1;
  min-height: 100%;
  padding: 0 16px;
}

.title {
  text-align: center;
  font-size: 14px;
  color: #0a0a15;
  margin-top: 12px;
}

.ratio-item-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.ratio-item {
  width: 80px;
  height: 80px;
  // border: 1px solid #99999f;
  background-color: #fcfcfc;
  border-radius: 4px;
  text-align: center;
  line-height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &.active {
    border: 1px solid #2d8cf0;
  }
}

.ratio-item-content {
  background-color: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}

.preview-wrapper {
  width: 100px;
}
</style>
