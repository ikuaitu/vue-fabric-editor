<!--
 * @Author: 秦少卫
 * @Date: 2023-02-16 22:52:00
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-17 00:24:40
 * @Description: 颜色选择器
-->
<template>
  <div>
    <!-- 颜色开关 -->
     <iSwitch v-model="isGradient" />
     <newColorPicker
        v-if="isGradient"
        :isGradient="true" :gradient="gradient" :onEndChange="changeColor">
      </newColorPicker>
      <ColorPicker
        v-else
        v-model="fill"
        @on-change="changeCommon"
        alpha
      />
  </div>
</template>

<script>
import select from '@/mixins/select';
import { ColorPicker } from 'vue-color-gradient-picker';
import { fabric } from 'fabric';

function generateFabricGradientFromColorStops(handlers, width, height, orientation, angle) {
  const gradAngleToCoords = (angle1) => {
    const anglePI = (-parseInt(angle1, 10)) * (Math.PI / 180);
    const angleCoords = {
      x1: (Math.round(50 + Math.sin(anglePI) * 50)) / 100,
      y1: (Math.round(50 + Math.cos(anglePI) * 50)) / 100,
      x2: (Math.round(50 + Math.sin(anglePI + Math.PI) * 50)) / 100,
      y2: (Math.round(50 + Math.cos(anglePI + Math.PI) * 50)) / 100,
    };

    return angleCoords;
  };

  let bgGradient = {};
  const colorStops = [...handlers];

  if (orientation === 'linear') {
    const angleCoords = gradAngleToCoords(angle);
    bgGradient = new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: angleCoords.x1 * width,
        y1: angleCoords.y1 * height,
        x2: angleCoords.x2 * width,
        y2: angleCoords.y2 * height,
      },
      colorStops,
    });
  } else if (orientation === 'radial') {
    bgGradient = new fabric.Gradient({
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

  return bgGradient;
}

function getAngleByPoint(start, end) {
  const x = Math.abs(end.x - start.x);
  const y = Math.abs(end.y - start.y);
  const z = Math.sqrt(x ** 2 + y ** 2);
  // 无拖动
  if (x === 0 && y === 0) { return 0; }
  const cos = y / z;
  const radina = Math.acos(cos);// 用反三角函数求弧度
  let angle = Math.floor(180 / (Math.PI / radina));// 将弧度转换成角度
  // 鼠标在第一象限
  if (start.x <= end.x && start.y > end.y) {
    angle = Math.abs(90 - angle);
  }
  // 鼠标在第二象限
  if (start.x > end.x && start.y >= end.y) {
    angle += 90;
  }
  // 鼠标在第三象限
  if (start.x >= end.x && start.y < end.y) {
    angle = 270 - angle;
  }
  // 鼠标在第四象限
  if (start.x < end.x && start.y <= end.y) {
    angle += 270;
  }
  angle = 360 - angle;
  return angle === 360 ? 0 : angle;
}

// const getAngle = ({
//   x1, y1, x2, y2,
// }) => {
//   const radian = Math.atan2(y1 - y2, x1 - x2); // 返回来的是弧度
//   // eslint-disable-next-line no-mixed-operators
//   const angle = 180 / Math.PI * radian; // 根据弧度计算角度
//   return angle;
// };

// const getAngle = ({
//   x1, y1, x2, y2,
// }) => {
//   // eslint-disable-next-line camelcase
//   const diff_x = x1 - x2;
//   // eslint-disable-next-line camelcase
//   const diff_y = y1 - y2;
//   // 返回角度,不是弧度
//   // eslint-disable-next-line camelcase, no-mixed-operators
//   return 360 * Math.atan(diff_y / diff_x) / (2 * Math.PI);
// };

export default {
  name: 'ToolBar',
  mixins: [select],
  components: {
    newColorPicker: { ...ColorPicker },
  },
  props: {
    color: {
      type: [Function, String],
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
      fill: '',
      isGradient: false,
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
    checkColor(val) {
      if (typeof val === 'string') {
        this.isGradient = false;
        this.fill = val;
      } else { // 渐变
        this.isGradient = true;
        const activeObject = this.canvas.c.getActiveObjects()[0];
        if (activeObject) {
          const width = val.coords.x1 + val.coords.x2;
          const height = val.coords.y1 + val.coords.y2;
          Math.atan2(val.coords.y2 - height / 2, val.coords.x2 - width / 2);
          console.log(getAngleByPoint({
            x: val.coords.x1,
            y: val.coords.y1,
          }, {
            x: val.coords.x2,
            y: val.coords.y2,
          }));
        }
        // console.log(val, '111');
        // console.log(getAngle(val.coords));
        // this.gradient =
      }
    },
    changeColor(val) {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      if (activeObject) {
        const handlers = val.points.map((item) => ({
          offset: item.left / 100,
          color: `rgba(${item.red}, ${item.green}, ${item.blue}, ${item.alpha})`,
        }));
        const gradient = generateFabricGradientFromColorStops(handlers, activeObject.width, activeObject.height, val.type, val.degree);
        this.$emit('change', gradient);
      }
    },
    changeCommon(val) {
      this.$emit('change', val);
    },
  },
};
</script>

<style scoped lang="less">
@import url('vue-color-gradient-picker/dist/index.css');

/deep/ .ivu-color-picker {
  display: block;
}

</style>
