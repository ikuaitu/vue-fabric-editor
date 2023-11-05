<!--
 * @Author: June
 * @Description:
 * @Date: 2023-11-01 11:54:10
 * @LastEditors: June
 * @LastEditTime: 2023-11-04 16:11:12
-->
<template>
  <Button type="text" @click="addWaterMark">
    {{ $t('waterMark.text') }}
  </Button>

  <Modal
    v-model="showWaterMadal"
    :title="$t('waterMark.modalTitle')"
    @on-ok="onModalOk"
    @on-cancel="onMadalCancel"
  >
    <div class="setting-item">
      <span class="mr-10px">{{ $t('waterMark.setting.name') }}</span>
      <Input
        class="w-320"
        v-model="waterMarkState.text"
        maxlength="15"
        show-word-limit
        :placeholder="$t('placeholder')"
      />
    </div>
    <div class="setting-item">
      <span class="mr-10px">{{ $t('waterMark.setting.size') }}</span>

      <Slider class="w-320" v-model="waterMarkState.size" :min="18" :max="48"></Slider>
    </div>
    <div class="setting-item">
      <span class="mr-10px">{{ $t('waterMark.setting.position.label') }}</span>

      <RadioGroup v-model="waterMarkState.position">
        <Radio label="lt">{{ $t('waterMark.setting.position.lt') }}</Radio>
        <Radio label="rt">{{ $t('waterMark.setting.position.rt') }}</Radio>
        <Radio label="lb">{{ $t('waterMark.setting.position.lb') }}</Radio>
        <Radio label="rb">{{ $t('waterMark.setting.position.rb') }}</Radio>
        <Radio label="full">{{ $t('waterMark.setting.position.full') }}</Radio>
      </RadioGroup>
    </div>
    <div class="setting-item" v-show="waterMarkState.position === 'full'">
      <span class="mr-10px">{{ $t('waterMark.setting.angle') }}</span>

      <div>
        <RadioGroup v-model="waterMarkState.isRotate">
          <Radio :label="0">横向</Radio>
          <Radio :label="1">倾斜</Radio>
        </RadioGroup>
      </div>
    </div>
  </Modal>
</template>

<script name="WaterMark" lang="ts" setup>
import { debounce } from 'lodash-es';
import { Message } from 'view-ui-plus';
import useSelect from '@/hooks/select';

const { canvasEditor }: any = useSelect();
const waterMarkState = reactive({
  text: '',
  size: 24,
  isRotate: 0, // 组件不支持boolean
  font: 'serif', // 可考虑自定义字体
  color: '#ccc', // 可考虑自定义颜色
  position: 'lt', // lt 左上 lr 右上 lb 左下  rb 右下 full 平铺
});

const showWaterMadal = ref(false);
const onMadalCancel = () => {
  waterMarkState.text = '';
  waterMarkState.size = 24;
  waterMarkState.font = 'serif';
  waterMarkState.color = '#ccc';
  waterMarkState.position = 'lt';
  waterMarkState.isRotate = 0;
};

const createCanvas = (width: number, height: number) => {
  const waterCanvas = document.createElement('canvas');
  waterCanvas.width = width;
  waterCanvas.height = height;
  waterCanvas.style.position = 'fixed';
  waterCanvas.style.opacity = '0';
  waterCanvas.style.zIndex = '-1';
  return waterCanvas;
};

const drawWaterMark: Record<string, any> = {
  lt: (width: number, height: number, cb: (imgString: string) => void) => {
    let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
    const w = waterCanvas.width || width;
    let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
    ctx.fillStyle = waterMarkState.color;
    ctx.font = `${waterMarkState.size}px ${waterMarkState.font}`;
    ctx.fillText(waterMarkState.text, 10, waterMarkState.size + 10, w - 20);
    cb && cb(waterCanvas.toDataURL());
    waterCanvas = null;
    ctx = null;
  },
  rt: (width: number, height: number, cb: (imgString: string) => void) => {
    let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
    let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
    const w = waterCanvas.width || width;
    ctx.fillStyle = waterMarkState.color;
    ctx.font = `${waterMarkState.size}px ${waterMarkState.font}`;
    ctx.fillText(
      waterMarkState.text,
      w - ctx.measureText(waterMarkState.text).width - 20,
      waterMarkState.size + 10,
      w - 20
    );
    cb && cb(waterCanvas.toDataURL());
    waterCanvas = null;
    ctx = null;
  },
  lb: (width: number, height: number, cb: (imgString: string) => void) => {
    let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
    let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
    const w = waterCanvas.width || width;
    const h = waterCanvas.height || height;
    ctx.fillStyle = waterMarkState.color;
    ctx.font = `${waterMarkState.size}px ${waterMarkState.font}`;
    ctx.fillText(waterMarkState.text, 10, h - waterMarkState.size, w - 20);
    cb && cb(waterCanvas.toDataURL());
    waterCanvas = null;
    ctx = null;
  },
  rb: (width: number, height: number, cb: (imgString: string) => void) => {
    let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
    let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
    const w = waterCanvas.width || width;
    ctx.fillStyle = waterMarkState.color;
    ctx.font = `${waterMarkState.size}px ${waterMarkState.font}`;
    ctx.fillText(
      waterMarkState.text,
      w - ctx.measureText(waterMarkState.text).width - 20,
      height - waterMarkState.size,
      width - 20
    );
    cb && cb(waterCanvas.toDataURL());
    waterCanvas = null;
    ctx = null;
  },
  full: (width: number, height: number, cb: (imgString: string) => void) => {
    let waterCanvas: HTMLCanvasElement | null = createCanvas(width, height);
    let ctx: CanvasRenderingContext2D | null = waterCanvas.getContext('2d')!;
    const textW = ctx.measureText(waterMarkState.text).width + 40;
    let patternCanvas: HTMLCanvasElement | null = createCanvas(
      waterMarkState.isRotate === 0 ? textW : textW * 2, // 若有倾斜，那么斜边都会大于直角边 按30度算2倍(简单)
      waterMarkState.isRotate === 0 ? waterMarkState.size + 20 : textW + 20
    );
    document.body.appendChild(patternCanvas);
    let ctxWater: CanvasRenderingContext2D | null = patternCanvas.getContext('2d')!;
    ctxWater.textAlign = 'left';
    ctxWater.textBaseline = 'top';
    ctxWater.font = `${waterMarkState.size}px ${waterMarkState.font}`;
    ctxWater.fillStyle = `${waterMarkState.color}`;
    if (waterMarkState.isRotate === 0) {
      ctxWater.fillText(waterMarkState.text, 10, 10);
    } else {
      ctxWater.translate(0, textW - 10);
      ctxWater.rotate((-30 * Math.PI) / 180); // 简单例子 按30度算
      ctxWater.fillText(waterMarkState.text, 0, 0);
    }
    ctx.fillStyle = ctx.createPattern(patternCanvas, 'repeat')!;
    ctx.fillRect(0, 0, width, height);
    cb && cb(waterCanvas.toDataURL());
    waterCanvas = null;
    patternCanvas = null;
    ctx = null;
    ctxWater = null;
  },
};

const onModalOk = () => {
  if (!waterMarkState.text) return Message.warning('水印名字不能为空');
  const workspace = canvasEditor.canvas.getObjects().find((item: any) => item.id === 'workspace');
  const { width, height, left, top } = workspace;
  drawWaterMark[waterMarkState.position](width, height, (imgString: string) => {
    canvasEditor.canvas.overlayImage = null; // 清空覆盖层
    canvasEditor.canvas.setOverlayImage(
      imgString,
      canvasEditor.canvas.renderAll.bind(canvasEditor.canvas),
      {
        left: left || 0,
        top: top || 0,
        originX: 'left',
        originY: 'top',
      }
    );
  });
  onMadalCancel();
};

const addWaterMark = debounce(function () {
  showWaterMadal.value = true;
}, 250);
</script>

<style lang="less" scoped>
.mr-10px {
  margin-right: 10px;
}
.w-320 {
  width: 320px;
}
.setting-item {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  margin-bottom: 10px;
}
</style>
