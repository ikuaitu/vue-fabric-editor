<!--
 * @Author: 秦少卫
 * @Date: 2023-02-16 22:52:00
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-24 23:15:36
 * @Description: 颜色选择器
-->
<template>
  <div class="box">
    <!-- 颜色开关 -->
    <iSwitch v-model="isGradient" size="large" class="switch">
      <template #open>
        <span>渐变</span>
      </template>
      <template #close>
        <span>纯色</span>
      </template>
    </iSwitch>
    <!-- 渐变 -->
    <div v-if="isGradient">
      <div class="gradient-bar" :style="bgStr"></div>
      <!-- 颜色插件 -->
      <div class="ivu-poptip-inner">
        <gradientColorPicker
          :is-gradient="true"
          :gradient="currentGradient"
          :on-end-change="changeGradientColor"
        />
      </div>
    </div>

    <!-- <div class="ivu-poptip-popper ivu-poptip-inner">
      <gradientColorPicker
        :is-gradient="true"
        :gradient="currentGradient"
        :on-end-change="changeGradientColor"
      />
    </div> -->
    <!-- 纯色选择器 -->
    <ColorPicker v-show="!isGradient" v-model="fill" @on-change="changePureColor" alpha />
  </div>
</template>

<script setup name="ColorSelector">
import 'color-gradient-picker-vue3/dist/style.css';
import gradientColorPicker from 'color-gradient-picker-vue3';
import { fabric } from 'fabric';
import useSelect from '@/hooks/select';
const { canvasEditor } = useSelect();
const generateFabricGradientFromColorStops = (handlers, width, height, orientation, angle) => {
  // 角度转换坐标
  const gradAngleToCoords = (paramsAngle) => {
    const anglePI = -parseInt(paramsAngle, 10) * (Math.PI / 180);
    return {
      x1: Math.round(50 + Math.sin(anglePI) * 50) / 100,
      y1: Math.round(50 + Math.cos(anglePI) * 50) / 100,
      x2: Math.round(50 + Math.sin(anglePI + Math.PI) * 50) / 100,
      y2: Math.round(50 + Math.cos(anglePI + Math.PI) * 50) / 100,
    };
  };

  // 生成线性渐变
  const generateLinear = (colorStops) => {
    const angleCoords = gradAngleToCoords(angle);
    return new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: angleCoords.x1 * width,
        y1: angleCoords.y1 * height,
        x2: angleCoords.x2 * width,
        y2: angleCoords.y2 * height,
      },
      colorStops,
    });
  };

  // 生成径向渐变
  const generateRadial = (colorStops) => {
    return new fabric.Gradient({
      type: 'radial',
      coords: {
        x1: width / 2,
        y1: height / 2,
        r1: 0,
        x2: width / 2,
        y2: height / 2,
        r2: width / 2,
      },
      colorStops,
    });
  };

  let bgGradient = {};
  const colorStops = [...handlers];
  if (orientation === 'linear') {
    bgGradient = generateLinear(colorStops);
  } else if (orientation === 'radial') {
    bgGradient = generateRadial(colorStops);
  }

  return bgGradient;
};
const props = defineProps({
  angleKey: {
    type: String,
    default: 'gradientAngle',
  },
  color: {
    type: [Object, String],
    default: '',
  },
});
const emitChange = defineEmits(['change']);
// const poptipCreated = ref(false);
// 是否渐变
const isGradient = ref(false);
// 纯色
const fill = ref('');
// 渐变
const bgStr = ref('background: linear-gradient(124deg, rgb(28, 27, 27) 0%, rgb(255, 0, 0) 100%);');
const currentGradient = reactive({
  type: 'linear',
  degree: 0,
  points: [
    {
      left: 0,
      red: 0,
      green: 0,
      blue: 0,
      alpha: 1,
    },
    {
      left: 100,
      red: 255,
      green: 0,
      blue: 0,
      alpha: 1,
    },
  ],
});
// const onPoptipCreated = () => {
// poptipCreated.value = true;
// };
// 回显颜色
const checkColor = (val) => {
  if (typeof val === 'string') {
    isGradient.value = false;
    fill.value = val;
  } else {
    // 渐变
    isGradient.value = true;
    const activeObject = canvasEditor.canvas.getActiveObjects()[0];
    if (activeObject) {
      // 控件属性设置
      fabricGradientToCss(val, activeObject);
      // bar背景设置
      fabricGradientToBar(val);
    }
  }
};
const changeGradientColor = (val) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject) {
    const currentGradient = cssToFabricGradient(val, activeObject);
    // TODO:
    emitChange('change', currentGradient);

    // 保存角度，用于下一次选中展示
    activeObject.set(props.angleKey, val.degree);
    setGradientBar(val);
  }
};
// 设置渐变颜色条
const setGradientBar = (val) => {
  bgStr.value = `background:${val.style.replace('radial', 'linear')};`;
};
// Fabric渐变bar背景设置
const fabricGradientToBar = (val) => {
  const str = val.colorStops.map((item) => `${item.color} ${item.offset * 100}%`);
  bgStr.value = `background: linear-gradient(124deg, ${str});`;
};
// Fabric渐变转css
const fabricGradientToCss = (val, activeObject) => {
  // 渐变类型
  currentGradient.type = val.type;
  currentGradient.degree = activeObject.get(props.angleKey, val.degree);
  currentGradient.points = val.colorStops.map((item) => {
    const [red, green, blue, alpha] = item.color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
    return {
      left: item.offset * 100,
      red: Number(red),
      green: Number(green),
      blue: Number(blue),
      alpha: Number(alpha),
    };
  });
};
// css转Fabric渐变
const cssToFabricGradient = (val, activeObject) => {
  const handlers = val.points.map((item) => ({
    offset: item.left / 100,
    color: `rgba(${item.red}, ${item.green}, ${item.blue}, ${item.alpha})`,
  }));
  return generateFabricGradientFromColorStops(
    handlers,
    activeObject.width,
    activeObject.height,
    val.type,
    val.degree
  );
};
// 纯色颜色
const changePureColor = (val) => {
  emitChange('change', val);
};
watch(
  () => props.color,
  (val) => {
    checkColor(val);
  }
);
onMounted(() => {
  checkColor(props.color);
});
</script>

<style scoped lang="less">
.box {
  padding: 10px 0;
}

// 渐变条
.gradient-bar {
  width: 100%;
  height: 30px;
  cursor: pointer;
  border-radius: 5px;
}

.switch {
  margin-bottom: 10px;
}

// 提示弹框
:deep(.ivu-color-picker) {
  display: block;
}

:deep(.ivu-poptip-body) {
  padding: 5px;
}

:deep(.ivu-poptip) {
  width: 100%;

  .ivu-poptip-rel {
    width: 100%;
  }
}

// 渐变选择器
:deep(.ui-color-picker) {
  .picker-area,
  .gradient-controls,
  .color-preview-area {
    padding: 0;
  }
  border-radius: 10px;
  padding: 8px;
  margin: 0;
  margin-top: 10px;
  width: 100%;
}
</style>
