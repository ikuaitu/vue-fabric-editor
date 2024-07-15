<!--
 * @Author: ShawnPhang
 * @Date: 2023-05-26 17:42:26
 * @Description: 调色板
 * @LastEditors: June 1601745371@qq.com
 * @LastEditTime: 2024-06-20 17:46:09
-->
<template>
  <div class="color-picker">
    <Tabs v-if="modes.length > 1" :value="mode" @update:value="onChangeMode">
      <TabPanel v-for="label in modes" :key="label" :label="label"></TabPanel>
    </Tabs>
    <div v-else class="title">{{ mode }}</div>

    <template v-if="showGradient">
      <div v-show="mode === '渐变'" class="cp__gradient flex-center">
        <div class="cp__gradient-bar">
          <div
            ref="elGradientTrack"
            class="cpgb__track"
            style="width: 100%"
            :style="{ background: value }"
          >
            <!-- tabindex="-1" 是元素可以触发 keydown 事件 -->
            <div
              v-for="(gradient, index) in gradients"
              :key="index"
              :class="[
                'cpgb__pointer',
                {
                  'cpgb__pointer--active': gradient === activeGradient,
                },
              ]"
              :data-sort="index"
              :style="{
                left: `${gradient.offset * 100}%`,
                background: gradient.color,
              }"
              tabindex="-1"
              @mousedown="onMousedownGradientPointer(gradient)"
              @keydown.stop="onKeyupGradientPointer"
            ></div>
          </div>
        </div>
        <AngleHandleVue v-model="angle" @change="angleChange" />
      </div>
    </template>

    <div ref="elPalette" class="cp__palette" :style="{ background: paletteBackground }">
      <div class="cpp__color-saturation"></div>
      <div class="cpp__color-value"></div>
      <div ref="elPalettePointer" class="cpp__pointer"></div>
    </div>

    <div ref="elSliderHux" class="cp__slider cp__slider-hux">
      <div class="cps__track">
        <div ref="elSliderHuxPointer" class="cpst__pointer"></div>
      </div>
    </div>

    <div ref="elSliderAlpha" class="cp__slider cp__slider-alpha">
      <div class="cpsa__background" :style="sliderAlphaBackgroundStyle"></div>
      <div class="cps__track">
        <div ref="elSliderAlphaPointer" class="cpst__pointer"></div>
      </div>
    </div>

    <div class="cp__box">
      <div class="item" @click="onClickStraw">
        <xiguan v-if="hasEyeDrop" />
        <input v-else class="native" type="color" @input="onClickStraw" />
      </div>
      <!-- <input :value="value" @input="$emit('update:value', $event.target.value)" class="input" /> -->
      <input v-if="mode === '渐变'" class="input" :value="activeGradient.color" />
      <input v-else :value="value" class="input" @blur="onInputBlur" />
      <template v-if="mode === '纯色'">
        <div
          v-for="pc in predefine"
          :key="pc"
          class="item item-color"
          :style="{ background: pc }"
          @click="onClickStraw({ target: { value: pc } })"
        ></div>
      </template>
      <!-- <input :value="alpha" class="w-12" size="small" :min="0" :max="100" @input="onChangeAlpha" @change="onChangeAlpha" /> -->
    </div>
  </div>
</template>

<script>
import './index.css';
export default {
  name: 'ColorPicker',
  inheritAttrs: false,
};
</script>

<script setup>
// import { ref, reactive, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue';
import { registerMoveableElement } from './utils/moveable.ts';
import { hexA2HSLA, HSLA2HexA, hex2RGB, RGB2HSL, hexA2RGBA, RGBA2HexA } from './utils/color.ts';
import { toGradientString, parseBackgroundValue, toolTip } from './utils/helper.ts';
import Tabs from './comps/Tabs.vue';
import xiguan from './comps/svg.vue';
import TabPanel from './comps/TabPanel.vue';
import { debounce } from 'lodash-es';
import AngleHandleVue from './comps/AngleHandle.vue';

const props = defineProps({
  value: {
    type: String,
    default: '#ffffffff',
  },

  modes: {
    type: Array,
    default: () => ['纯色', '渐变'], // 图案
  },

  defaultColor: {
    type: String,
    default: '#ffffffff',
  },

  defaultGradient: {
    type: String,
    default: 'linear-gradient(90deg, #fffae0ff 0%, #ffd1f1ff 100%)',
  },

  defaultImage: {
    type: String,
    default: 'https://st0.dancf.com/csc/157/material-2d-textures/0/20190714-174653-ed3c.jpg',
  },
});

const emit = defineEmits(['update:value', 'change', 'native-pick', 'blur']);

const mode = ref(parseBackgroundValue(props.value)); // 颜色、渐变、图片
const angle = ref(90);
const gradients = ref([]);
const hsla = reactive({ h: 0, s: 0, l: 0, a: 0 });
const paletteBackground = ref('#f00');
const hex = ref('#000');
const alpha = ref(0);
let activeGradient = ref({});
const hasEyeDrop = 'EyeDropper' in window;

const elGradientTrack = ref();
const elPalette = ref();
const elPalettePointer = ref();
const elSliderHuxPointer = ref();
const elSliderHux = ref();
const elSliderAlphaPointer = ref();
const elSliderAlpha = ref();
// const elStrawCanvas = ref();

let gradientMoveable = null;
let paletteMoveable = null;
let sliderHuxMoveable = null;
let sliderAlphaMoveable = null;
let mousedownGradientPointer = null;
let backendHex = null;
// 是否可以改变 palette sliderHux sliderAlpha 的 pointer 位置
let canChangeHSLAPointerPos = true;
let canChangeHSLAPointerPosTimer = null;

const predefine = ref([]); // 历史记录

const record = {
  color: props.defaultColor,
  gradient: props.defaultGradient,
  image: props.defaultImage,
};

const showGradient = computed(() => {
  return props.modes.includes('渐变');
});

const sliderAlphaBackgroundStyle = computed(() => {
  const rgb = hex2RGB(hex.value).join(',');
  return {
    background: `linear-gradient(to right, rgba(${rgb}, 0) 0%, rgb(${rgb}) 100%)`,
  };
});

watch(activeGradient, (value) => {
  setColor(value.color);
});

watch(hex, (value) => {
  onChangeHex(value);
});

watch(
  () => props.value,
  (value) => {
    const _mode = parseBackgroundValue(value);
    if (_mode !== mode.value) {
      mode.value = _mode;
    }
    changeMode(_mode);
    recordValue(value);
    addHistory(value);
  }
);

// TODO: 添加选择历史记录
const addHistory = debounce(async (value) => {
  const history = predefine.value;
  // 如果已经存在就提到前面来，避免重复
  const index = history.indexOf(value);
  if (index !== -1) {
    predefine.value.splice(index, 1);
  }
  if (history.length >= 4) {
    predefine.value.splice(history.length - 1, 1);
  }
  // 把最新的颜色放在头部
  const head = [value];
  predefine.value = head.concat(history);
}, 300);

const unwatchHSLA = watch(hsla, onChangeHSLA, { deep: true });
function onChangeHSLA(newHsla) {
  const hexA = HSLA2HexA(...Object.values(newHsla));

  let value;
  if (mode.value === '纯色') {
    value = hexA;
  } else if (mode.value === '渐变') {
    activeGradient.value.color = hexA;
    value = toGradientString(angle.value, gradients.value);
  }
  updateColorData(hexA);
  updateValue(value);
}

onMounted(onMountedCallback);
async function onMountedCallback() {
  elPalettePointer.value.style.left = `${hsla.s}%`;
  elPalettePointer.value.style.top = `${100 - hsla.l}%`;
  elSliderHuxPointer.value.style.left = `${(hsla.h / 360) * 100}%`;
  elSliderAlphaPointer.value.style.left = `${hsla.a * 100}%`;

  if (showGradient.value) {
    gradientMoveable = registerMoveableElement(elGradientTrack.value, {
      onmousedown: onMousedownGradient,
      onmousemove: onMousemoveGradient,
      onmouseup: onMouseupGradient,
    });
  }

  function onMousedownGradient(position) {
    if (mousedownGradientPointer) {
      return;
    }

    const index = gradients.value.findIndex((stop) => stop.offset >= position.x);
    const start = gradients.value[index - 1];
    const startRGBA = hexA2RGBA(start.color);
    const end = gradients.value[index];
    const endRGBA = hexA2RGBA(end.color);

    const rgb = [];
    for (let i = 0; i < 3; i += 1) {
      rgb.push(startRGBA[i] + (endRGBA[i] - startRGBA[i]) * position.x);
    }

    const a = end.offset - position.x - (position.x - start.offset) > 0 ? startRGBA[3] : endRGBA[3];

    const color = RGBA2HexA(...rgb, a);
    activeGradient.value = {
      color,
      offset: position.x,
    };

    gradients.value.splice(index, 0, activeGradient.value);
  }

  function onMousemoveGradient(position) {
    if (!mousedownGradientPointer) return;

    activeGradient.value.offset = position.x;
    gradients.value.sort((a, b) => a.offset - b.offset);

    const value = toGradientString(angle.value, gradients.value);
    updateValue(value);
  }

  function onMouseupGradient() {
    mousedownGradientPointer = false;
  }

  paletteMoveable = registerMoveableElement(elPalette.value, {
    onmousemove: onChangeSL,
    onmouseup: onChangeSL,
  });

  function onChangeSL(position) {
    disableChangeHSLA();

    try {
      const x = position.x * 100;
      const y = position.y * 100;

      hsla.s = Math.round(x);
      hsla.l = Math.round(100 - y);

      elPalettePointer.value.style.left = `${x}%`;
      elPalettePointer.value.style.top = `${y}%`;
    } catch (error) {
      console.log(error);
    }
  }

  sliderHuxMoveable = registerMoveableElement(elSliderHux.value, {
    onmousemove: onChangeHux,
    onmouseup: onChangeHux,
  });

  function onChangeHux(position) {
    disableChangeHSLA();

    hsla.h = position.x * 360;
    elSliderHuxPointer.value.style.left = `${position.x * 100}%`;
  }

  sliderAlphaMoveable = registerMoveableElement(elSliderAlpha.value, {
    onmousemove: onChangeAlpha,
    onmouseup: onChangeAlpha,
  });

  function onChangeAlpha(position) {
    disableChangeHSLA();

    hsla.a = position.x;
    elSliderAlphaPointer.value.style.left = `${position.x * 100}%`;
  }

  changeMode(mode.value);
  recordValue(props.value);
}

onBeforeUnmount(() => {
  paletteMoveable?.destroy();
  sliderHuxMoveable?.destroy();
  sliderAlphaMoveable?.destroy();
  unwatchHSLA();

  if (gradientMoveable) {
    gradientMoveable.destroy();
  }
});

function recordValue(value) {
  if (mode.value === '纯色') {
    record.color = value;
  } else if (mode.value === '渐变') {
    record.gradient = value;
  } else if (mode.value === '图案') {
    record.image = value;
  }
}

function updateValue(value) {
  // 纯色时value和props.value 一样导致不更新
  // if (value === props.value) return;
  recordValue(value);
  emit('update:value', value);

  emit('change', {
    mode: mode.value,
    color: value,
    angle: Number(angle.value),
    stops: gradients.value,
  });
}

async function onChangeMode(value) {
  if (value === mode.value) return;
  mode.value = value;

  let color;
  if (value === '纯色') {
    color = record.color;
  } else if (value === '渐变') {
    color = record.gradient;
  } else if (value === '图案') {
    color = record.image;
  }
  updateValue(color);
}

function changeMode(mode) {
  if (mode === '纯色') {
    setColor(props.value);
  } else if (mode === '渐变') {
    if (gradients.value.length === 0) {
      props.value.match(/[^,]+/g).forEach((item, index) => {
        if (index === 0) {
          angle.value = Number(item.match(/\d+/)[0]);
          return;
        }

        let [color, offset] = item.trim().split(' ');
        if (!color.startsWith('#')) color = RGBA2HexA(color);

        offset = offset.match(/\d+/)[0] / 100;
        gradients.value.push({ color, offset });
        activeGradient.value = gradients.value[0];
      });
    } else {
      setColor(activeGradient.value.color);
    }
  }

  // TODO: 图案
}

function updateColorData(hexA) {
  paletteBackground.value = `hsl(${hsla.h}, 100%, 50%)`;
  hex.value = hexA.slice(0, 7);
  backendHex = hex.value;
  alpha.value = Math.round((hsla.a ?? 1) * 100);
}

function setColor(color) {
  // 通过 palette sliderHux sliderAlpha 交互改变 pointer 位置
  // 已经改变 hsla 的值并触发 update:value
  // watch props.value 再调用当前方法时无需再更新 hsla
  if (canChangeHSLAPointerPos) {
    const _hsla = hexA2HSLA(color);
    hsla.h = _hsla[0];
    hsla.s = _hsla[1];
    hsla.l = _hsla[2];
    hsla.a = _hsla[3];

    updateColorData(color);
    try {
      let x = hsla.s;
      const y = Math.round(100 - hsla.l);
      elPalettePointer.value.style.left = `${x}%`;
      elPalettePointer.value.style.top = `${y}%`;

      x = hsla.h / 360;
      elSliderHuxPointer.value.style.left = `${x * 100}%`;

      elSliderAlphaPointer.value.style.left = `${hsla.a * 100}%`;
    } catch (error) {
      console.log(error);
    }
  }
}

function onMousedownGradientPointer(stop) {
  mousedownGradientPointer = true;
  activeGradient.value = stop;
}

function onKeyupGradientPointer(event) {
  event.stopPropagation();
  event.preventDefault();
  if (!['Backspace', 'Delete'].includes(event.key)) return;
  if (gradients.value.length === 2) return;

  const index = gradients.value.indexOf(activeGradient.value);
  gradients.value.splice(index, 1);
  activeGradient.value = gradients.value[0];
}

function onChangeHex(value) {
  if (/^#(?:[0-9a-f]{3}){1,2}$/i.test(value)) {
    const rgb = hex2RGB(value);
    const [h, s, l] = RGB2HSL(...rgb);
    hsla.h = h;
    hsla.s = s;
    hsla.l = l;

    try {
      elPalettePointer.value.style.left = `${hsla.s}%`;
      elPalettePointer.value.style.top = `${100 - hsla.l}%`;
      elSliderHuxPointer.value.style.left = `${(hsla.h / 360) * 100}%`;

      hex.value = value;
    } catch (error) {
      console.log(error);
    }
  } else {
    // hex.value = backendHex
  }
}

// function onChangeAlpha(value) {
// hsla.a = value / 100;
//  elSliderAlphaPointer.value.style.left = `${value}%`;
// }

function disableChangeHSLA() {
  canChangeHSLAPointerPos = false;

  if (canChangeHSLAPointerPosTimer) clearTimeout(canChangeHSLAPointerPosTimer);
  canChangeHSLAPointerPosTimer = setTimeout(() => {
    canChangeHSLAPointerPos = true;
  }, 16);
}

async function onClickStraw(val) {
  let result = '';
  if (val && val.target.value) {
    const color = val.target.value;
    result = color + (color.length === 7 ? 'ff' : '');
  } else {
    const eyeDropper = new window.EyeDropper(); // 初始化一个EyeDropper对象
    toolTip('按Esc可退出');
    try {
      const drop = await eyeDropper.open(); // 开始拾取颜色
      const colorHexValue = drop.sRGBHex;
      result = colorHexValue + 'ff';
    } catch (e) {
      console.log('用户取消了取色');
    }
  }
  if (mode.value === '渐变') {
    activeGradient.value.color = result;
    activeGradient.value = { ...activeGradient.value };
  } else {
    emit('update:value', result);
  }
  emit('native-pick', result);
}

const onInputBlur = (e) => {
  const fixColor = patchHexColor(e.target.value);
  emit('blur', fixColor);
  emit('update:value', fixColor);
};

function patchHexColor(str) {
  let hex = str.replace(/\s/g, ''); // 移除空格
  if (!str.startsWith('#')) {
    hex = '#' + hex;
  }
  if (hex.length < 9) {
    hex = hex.padEnd(9, 'f');
  }
  return hex;
}

function angleChange() {
  updateValue(toGradientString(angle.value, gradients.value));
}

defineExpose({
  updateValue,
});
</script>

<style lang="less" scoped>
*,
::before,
::after {
  box-sizing: border-box;
  border-width: 0;
  border-style: solid;
  border-color: #e5e7eb;
}
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.title {
  margin-bottom: 0.75rem;
  font-size: 15px;
  font-weight: 600;
}
.color-picker {
  -webkit-user-select: none;
  user-select: none;
  min-width: 220px;
}

.cp__gradient {
  &-bar {
    display: flex;
    justify-content: center;
    height: 16px;
    width: 100%;
    padding: 0 8px;
  }
}

.cpgb__track {
  position: relative;
  cursor: pointer;
}

.cpgb__pointer {
  cursor: grab;
  position: absolute;
  top: -0px;
  top: -0.125rem;
  height: 1.25rem;
  --tw-translate-x: -50%;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
    skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
    scaleY(var(--tw-scale-y));
  border-width: 2px;
  border-style: solid;
  --tw-border-opacity: 1;
  border-color: rgb(255 255 255 / var(--tw-border-opacity));
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
    var(--tw-shadow);
  outline: 2px solid transparent;
  outline-offset: 2px;
  width: 18px;

  &--active {
    z-index: 1;
    border-radius: 3px;
    box-shadow: 0 0 4px 0 rgb(0 0 0 / 20%), 0 0 0 1.2px #2254f4;
  }
}

.cp__palette {
  height: 140px;
  position: relative;
  margin-top: 0.75rem;
  margin-top: 0.875rem;
  cursor: pointer;
  overflow: hidden;
  border-radius: 0.25rem;
  .cpp__color-saturation,
  .cpp__color-value {
    position: absolute;
    bottom: 0px;
    right: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
  }

  .cpp__color-saturation {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
    --tw-gradient-from: #fff var(--tw-gradient-from-position);
    --tw-gradient-to: rgb(255 255 255 / 0) var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
  }

  .cpp__color-value {
    background-image: linear-gradient(to top, var(--tw-gradient-stops));
    --tw-gradient-from: #000 var(--tw-gradient-from-position);
    --tw-gradient-to: rgb(0 0 0 / 0) var(--tw-gradient-to-position);
    --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to);
  }

  .cpp__pointer {
    position: absolute;
    height: 0.75rem;
    width: 0.75rem;
    --tw-translate-x: -0.25rem;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
      skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
      scaleY(var(--tw-scale-y));
    --tw-translate-x: -0.375rem;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
      skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
      scaleY(var(--tw-scale-y));
    --tw-translate-y: -0.25rem;
    transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
      skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
      scaleY(var(--tw-scale-y));
    border-radius: 9999px;
    border-width: 2px;
    --tw-border-opacity: 1;
    border-color: rgb(255 255 255 / var(--tw-border-opacity));
    --tw-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
    --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);
    box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000),
      var(--tw-shadow);
  }
}

.cp__slider {
  position: relative;
  margin-top: 0.75rem;
  margin-top: 0.875rem;
  height: 0.5rem;
  border-radius: 0.25rem;
  &-hux {
    background: linear-gradient(
      90deg,
      red 0,
      #ff0 17%,
      #0f0 33%,
      #0ff 50%,
      #00f 67%,
      #f0f 83%,
      red
    );
  }

  &-alpha {
    background: linear-gradient(
        to top right,
        hsla(0, 0%, 80%, 0.4) 25%,
        transparent 0,
        transparent 75%,
        hsla(0, 0%, 80%, 0.4) 0,
        hsla(0, 0%, 80%, 0.4)
      ),
      linear-gradient(
        to top right,
        hsla(0, 0%, 80%, 0.4) 25%,
        transparent 0,
        transparent 75%,
        hsla(0, 0%, 80%, 0.4) 0,
        hsla(0, 0%, 80%, 0.4)
      );
    background-size: 6px 6px;
    background-position: 0 0, 3px 3px;
  }

  .cpsa__background {
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 6%);
    height: 100%;
    border-radius: 0.25rem;
  }
}
.cp__box {
  margin-top: 0.75rem;
  margin-top: 0.875rem;
  display: flex;
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-left: 6px;
    width: 24px;
    height: 24px;
    box-sizing: border-box;
    border-radius: 4px;
  }
  .item-color {
    box-shadow: inset 0 0 0 1px rgb(0 0 0 / 6%);
  }
  .item:first-of-type {
    margin: 0;
  }
  .item:hover {
    transform: scale(1.08);
  }
  .input {
    width: 4.7rem;
    margin-left: 2px;
  }
  .native {
    width: 100%;
    height: 100%;
  }
}

.cps__track {
  position: absolute;
  left: 0.25rem;
  right: 0.25rem;
  top: 0px;
}

.cpst__pointer {
  cursor: pointer;
  box-shadow: 0 0 2px rgb(0 0 0 / 60%);
  position: absolute;
  top: 0px;
  box-sizing: content-box;
  height: 0.5rem;
  width: 0.5rem;
  --tw-translate-x: -0.5rem;
  --tw-translate-y: -0.25rem;
  transform: translate(var(--tw-translate-x), var(--tw-translate-y)) rotate(var(--tw-rotate))
    skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x))
    scaleY(var(--tw-scale-y));
  border-radius: 9999px;
  border-width: 4px;
  --tw-border-opacity: 1;
  border-color: rgb(255 255 255 / var(--tw-border-opacity));
}
</style>
