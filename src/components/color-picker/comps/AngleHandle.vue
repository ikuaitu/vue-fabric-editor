<!--
 * @Author: ShawnPhang
 * @Date: 2023-11-29 10:34:54
 * @Description: 角度手柄
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-11-29 19:24:14
-->
<template>
  <div class="angle-input-box">
    <input
      ref="numInput"
      v-model="num"
      class="angle-input"
      @focus="visiable = true"
      @blur="visiable = false"
      @input="inputChange"
    />
    <div
      v-show="visiable"
      class="AngleHandle"
      @mousedown="touch($event, true)"
      @mouseup="touch($event, false)"
    >
      <div class="angle" @mouseup="turn" @mousemove="turn">
        <div :style="`transform: rotate(${angleInDegrees}deg)`" class="line"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, computed } from 'vue';

export default defineComponent({
  props: ['modelValue'],
  emits: ['change', 'update:modelValue'],
  setup(props, { emit }) {
    const num = ref(90);
    const numInput = ref(null);
    const angleInDegrees = computed(() => {
      return num.value - 90;
    });
    let inProcess = false;
    const visiable = ref(false);

    const inputChange = (e: any) => {
      emit('change', e);
    };
    watch(
      () => num.value,
      (v) => {
        props.modelValue !== num.value && emit('update:modelValue', v);
        emit('change');
      }
    );
    watch(
      () => props.modelValue,
      (v) => {
        num.value = v;
      }
    );

    const turn = (e: any) => {
      if (!inProcess) {
        return;
      }
      const origin = { x: 27, y: 27 };
      // 计算相对于原点的坐标差值
      const deltaX = e.offsetX - origin.x;
      const deltaY = e.offsetY - origin.y;
      // 计算夹角（弧度）
      const angleInRadians = Math.atan2(deltaY, deltaX);
      // 将弧度转换为角度
      const angleInDegrees = (angleInRadians * 180) / Math.PI;
      num.value = Math.round(angleInDegrees + 90);
    };

    const touch = (e: any, isHandle: boolean) => {
      e.preventDefault();
      inProcess = isHandle;
    };
    return { inputChange, num, turn, touch, angleInDegrees, numInput, visiable };
  },
});
</script>

<style lang="less">
.angle-input {
  width: 38px;
  margin-left: 5px;
  padding: 0 0 0 4px;
  border: 1px solid #e8eaec;
  border-radius: 4px;
  position: relative;
}
.angle-input-box {
  position: relative;
}
.angle-input-box::after {
  content: '°';
  width: 5px;
  height: 2px;
  position: absolute;
  right: 2px;
  top: 0;
}

.AngleHandle {
  position: absolute;
  z-index: 2;
  right: 2px;
  margin-top: 3px;
  background: #ffffff;
  width: 60px;
  height: 60px;
  border-radius: 7px;
  box-shadow: 0 0 2px rgb(0 0 0 / 60%);
  display: flex;
  align-items: center;
  justify-content: center;
  .angle {
    width: 54px;
    height: 54px;
    position: relative;
    overflow: hidden;
    background: #f1f2f4;
    border-radius: 50%;
    user-select: none;
    cursor: pointer;
  }
  .line {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 50%;
    height: 1px;
    background: #999999;
    pointer-events: none;
    transform-origin: left top;
  }
  .line::before {
    position: absolute;
    content: '';
    left: -1px;
    top: -1px;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #999999;
  }
  .line::after {
    position: absolute;
    content: '';
    right: 0;
    top: -2px;
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #999999;
  }
}
</style>
