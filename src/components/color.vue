<!--
 * @Author: 秦少卫
 * @Date: 2023-02-16 22:52:00
 * @LastEditors: June
 * @LastEditTime: 2023-04-02 23:49:00
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

    <!-- 颜色选择器 -->
    <ColorPicker v-if="!isGradient" v-model="fill" @on-change="changePureColor" alpha />

    <!-- 渐变选择器 -->
    <Poptip @created="poptipCreated = true" style="width: 100%" v-if="isGradient">
      <div class="gradient-bar" :style="bgStr"></div>
      <template #content>
        <!-- 颜色插件 -->
        <newColorPicker
          v-if="poptipCreated"
          :isGradient="true"
          :gradient="gradient"
          :onEndChange="changeGradientColor"
        ></newColorPicker>
      </template>
    </Poptip>
  </div>
</template>

<script>
import select from '@/mixins/select';
// import { ColorPicker } from '@/lib/index.js';
// import { ColorPicker } from 'vue-color-gradient-picker';
import ColorPicker from 'color-gradient-picker-vue3';
import 'color-gradient-picker-vue3/dist/style.css';

import { fabric } from 'fabric';

function generateFabricGradientFromColorStops(handlers, width, height, orientation, angle) {
  // 角度转换坐标
  const gradAngleToCoords = (paramsAngle) => {
    const anglePI = -parseInt(paramsAngle, 10) * (Math.PI / 180);
    const angleCoords = {
      x1: Math.round(50 + Math.sin(anglePI) * 50) / 100,
      y1: Math.round(50 + Math.cos(anglePI) * 50) / 100,
      x2: Math.round(50 + Math.sin(anglePI + Math.PI) * 50) / 100,
      y2: Math.round(50 + Math.cos(anglePI + Math.PI) * 50) / 100,
    };
    return angleCoords;
  };

  // 生成线性渐变
  function generateLinear(colorStops) {
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
  }

  // 生成径向渐变
  function generateRadial(colorStops) {
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
  }

  let bgGradient = {};
  const colorStops = [...handlers];
  if (orientation === 'linear') {
    bgGradient = generateLinear(colorStops);
  } else if (orientation === 'radial') {
    bgGradient = generateRadial(colorStops);
  }

  return bgGradient;
}

export default {
  name: 'ColorBox',
  mixins: [select],
  components: {
    newColorPicker: { ...ColorPicker },
  },
  props: {
    angleKey: {
      type: [String],
      default: 'gradientAngle',
    },
    color: {
      type: [Object, String],
      default: '',
    },
  },
  watch: {
    color(val) {
      this.checkColor(val);
    },
  },
  created() {
    this.checkColor(this.color);
  },
  data() {
    return {
      poptipCreated: false,
      // 是否渐变
      isGradient: false,
      // 纯色
      fill: '',
      // 渐变
      bgStr: 'background: linear-gradient(124deg, rgb(28, 27, 27) 0%, rgb(255, 0, 0) 100%);',
      gradient: {
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
      },
    };
  },
  methods: {
    // 回显颜色
    checkColor(val) {
      if (typeof val === 'string') {
        this.isGradient = false;
        this.fill = val;
      } else {
        // 渐变
        this.isGradient = true;
        const activeObject = this.canvas.c.getActiveObjects()[0];
        if (activeObject) {
          // 控件属性设置
          this.fabricGradientToCss(val, activeObject);
          // bar背景设置
          this.fabricGradientToBar(val);
        }
      }
    },
    changeGradientColor(val) {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      if (activeObject) {
        const gradient = this.cssToFabricGradient(val, activeObject);
        this.$emit('change', gradient);

        // 保存角度，用于下一次选中展示
        activeObject.set(this.angleKey, val.degree);
        this.setGradientBar(val);
      }
    },
    // 设置渐变颜色条
    setGradientBar(val) {
      this.bgStr = `background:${val.style.replace('radial', 'linear')};`;
    },
    // Fabric渐变bar背景设置
    fabricGradientToBar(val) {
      const str = val.colorStops.map((item) => `${item.color} ${item.offset * 100}%`);
      this.bgStr = `background: linear-gradient(124deg, ${str});`;
    },
    // Fabric渐变转css
    fabricGradientToCss(val, activeObject) {
      // 渐变类型
      this.gradient.type = val.type;
      this.gradient.degree = activeObject.get(this.angleKey, val.degree);
      this.gradient.points = val.colorStops.map((item) => {
        const [red, green, blue, alpha] = item.color.replace(/^rgba?\(|\s+|\)$/g, '').split(',');
        return {
          left: item.offset * 100,
          red: Number(red),
          green: Number(green),
          blue: Number(blue),
          alpha: Number(alpha),
        };
      });
    },
    // css转Fabric渐变
    cssToFabricGradient(val, activeObject) {
      const handlers = val.points.map((item) => ({
        offset: item.left / 100,
        color: `rgba(${item.red}, ${item.green}, ${item.blue}, ${item.alpha})`,
      }));
      const gradient = generateFabricGradientFromColorStops(
        handlers,
        activeObject.width,
        activeObject.height,
        val.type,
        val.degree
      );
      return gradient;
    },
    // 纯色颜色
    changePureColor(val) {
      this.$emit('change', val);
    },
  },
};
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
}
</style>
