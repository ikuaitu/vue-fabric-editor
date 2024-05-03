<template>
  <div class="box" v-if="mixinState.mSelectMode === 'one' && isImage">
    <Divider plain orientation="left">图像描边</Divider>

    <div class="hd-wrap">
      <div class="hd">
        <span>启用图像描边</span>
        <Poptip trigger="hover" content="只支持png透明图像">
          <span><Icon type="ios-alert" color="#f34250" /></span>
        </Poptip>
      </div>

      <iSwitch v-model="openImgStroke" size="large" class="switch" @on-change="onSwitchChange">
        <template #open>
          <span>开启</span>
        </template>
        <template #close>
          <span>关闭</span>
        </template>
      </iSwitch>
    </div>

    <template v-if="openImgStroke">
      <div class="hd-wrap">
        <div class="hd">
          <span>是否只显示描边</span>
        </div>

        <iSwitch v-model="isOnlyStroke" size="large" class="switch" @on-change="updateStroke">
          <template #open>
            <span>是</span>
          </template>
          <template #close>
            <span>否</span>
          </template>
        </iSwitch>
      </div>
      <div class="operation">
        <div class="hd">
          <span>描边大小</span>
        </div>
        <div class="flex-1">
          <Slider v-model="strokeWidth" :max="50" @on-change="onSliderChange"></Slider>
        </div>
      </div>

      <div class="operation" style="justify-content: flex-start">
        <div class="hd">
          <span>描边颜色</span>
        </div>

        <div>
          <ColorPicker v-model="strokeColor" @on-change="onColorChange" />
        </div>
      </div>
    </template>
  </div>
</template>

<script name="ImgStroke" lang="ts" setup>
import useSelect from '@/hooks/select';
import { fabric } from 'fabric';

interface IActiveCanvas extends fabric.Canvas {
  [x: string]: any;
  originWidth?: number;
  originHeight?: number;
  originSrc?: string;
}

const { mixinState, canvasEditor } = useSelect();
const isImage = ref(false);
const openImgStroke = ref(false);
const strokeWidth = ref(5);
const strokeColor = ref('#000');
const isOnlyStroke = ref(false);
const getActiveObject = () => canvasEditor.canvas.getActiveObjects()[0] as unknown as IActiveCanvas;

const setOrigin = () => {
  const _activeObject = getActiveObject();
  if (_activeObject?.originSrc) return;
  _activeObject.set('originWidth', _activeObject?.get('width'));
  _activeObject.set('originHeight', _activeObject?.get('height'));
  _activeObject.set('originSrc', _activeObject?.getSrc());
};

const updateStroke = () => {
  setOrigin();
  const strokeType = unref(isOnlyStroke) ? 'destination-out' : 'source-over';
  strokeImage(unref(strokeColor), unref(strokeWidth), strokeType);
};

const closeImgStroke = () => {
  strokeWidth.value = 0;
  updateStroke();
};

const onSwitchChange = async (val: boolean) => {
  if (val) {
    unref(strokeWidth) === 0 && (strokeWidth.value = 5);
    updateStroke();
  } else {
    closeImgStroke();
  }
};

const onSliderChange = (val: number) => {
  strokeWidth.value = val;
  updateStroke();
};

const onColorChange = (val: string) => {
  strokeColor.value = val;
  updateStroke();
};

const handleSelectOne = () => {
  const activeObject = getActiveObject();
  isImage.value = activeObject.type === 'image';
};

onMounted(() => {
  canvasEditor.on('selectOne', handleSelectOne);
});

onBeforeUnmount(() => {
  canvasEditor.off('selectOne', handleSelectOne);
});

async function strokeImage(stroke: string, strokeWidth: number, type = 'source-over') {
  const _activeObject = getActiveObject();
  const w = _activeObject.originWidth || 0,
    h = _activeObject.originHeight || 0,
    src = _activeObject?.originSrc || _activeObject.getSrc();
  let canvas: HTMLCanvasElement | null = document.createElement('canvas');
  const ctx = canvas!.getContext('2d');
  if (!ctx) return;
  // 描边等于0 说明关闭了开关或者不需要描边  直接从原图绘制
  if (strokeWidth === 0) {
    _activeObject.setSrc(src, () => {
      _activeObject.canvas?.renderAll();
    });
    return;
  }
  ctx.save();
  ctx.clearRect(0, 0, canvas!.width, canvas!.height);
  ctx.restore();
  canvas!.width = w + strokeWidth * 2;
  canvas!.height = h + strokeWidth * 2;
  const dArr = [-1, -1, 0, -1, 1, -1, -1, 0, 1, 0, -1, 1, 0, 1, 1, 1];
  const img = await addImage(src);
  if (!img) return;
  for (let i = 0; i < dArr.length; i += 2) {
    ctx.drawImage(
      img,
      strokeWidth + dArr[i] * strokeWidth,
      strokeWidth + dArr[i + 1] * strokeWidth,
      w,
      h
    );
  }
  ctx.globalCompositeOperation = 'source-in';
  ctx.fillStyle = stroke;
  ctx.fillRect(0, 0, w + strokeWidth * 2, h + strokeWidth * 2);
  ctx.globalCompositeOperation = type as any;
  ctx.drawImage(img, strokeWidth, strokeWidth, w, h);
  const res = canvas?.toDataURL();
  canvas = null;
  if (!res) return;
  _activeObject.setSrc(res, () => {
    _activeObject.canvas?.renderAll();
  });
}

async function addImage(src: string): Promise<HTMLImageElement | undefined> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject();
    img.src = src;
  });
}
</script>

<style lang="less" scoped>
:deep(.ivu-divider-plain) {
  &.ivu-divider-with-text-left {
    margin: 10px 0;
    font-weight: bold;
    font-size: 16px;
    color: #000000;
  }
}
.box {
  margin-bottom: 20px;
  .hd-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    .hd {
      flex: 1;
      & > span {
        margin-right: 5px;
      }
    }
  }
  .operation {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
