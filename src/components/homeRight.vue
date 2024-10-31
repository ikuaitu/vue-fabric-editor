<template>
  <!-- 属性区域 380-->
  <div class="right-bar">
    <div v-if="show" style="padding-top: 10px">
      <!-- 未选择元素时 展示背景设置 -->
      <div v-show="!mixinState.mSelectMode">
        <set-size></set-size>
        <bg-bar></bg-bar>
      </div>

      <!-- 多选时展示 -->
      <div v-show="mixinState.mSelectMode === 'multiple'">
        <!-- 分组 -->
        <group></group>
        <!-- <Divider plain></Divider> -->
        <!-- 组对齐方式 -->
        <align></align>
        <!-- 居中对齐 -->
        <center-align></center-align>
      </div>

      <div v-show="mixinState.mSelectMode === 'one'" class="attr-item-box">
        <!-- <h3>快捷操作</h3> -->
        <!-- 分组 -->
        <group></group>
        <!-- <Divider plain></Divider> -->
        <Divider plain orientation="left">
          <h4>快捷操作</h4>
        </Divider>
        <div class="bg-item" v-show="mixinState.mSelectMode">
          <lock></lock>
          <dele></dele>
          <clone></clone>
          <hide></hide>
          <edit></edit>
        </div>
        <!-- <Divider plain></Divider> -->
        <!-- 居中对齐 -->
        <center-align></center-align>
        <!-- 替换图片 -->
        <replaceImg></replaceImg>
        <!-- 图片裁切 -->
        <clip-image></clip-image>
        <!-- 翻转 -->
        <flip></flip>
        <!-- 条形码属性 -->
        <attributeBarcode></attributeBarcode>
        <!-- 二维码 -->
        <attributeQrCode></attributeQrCode>
        <!-- 图片滤镜 -->
        <filters></filters>
        <!-- 图片描边 -->
        <imgStroke />
        <!-- 颜色 -->
        <attributeColor></attributeColor>
        <!-- 字体属性 -->
        <attributeFont></attributeFont>
        <!-- 字体小数点 -->
        <attributeTextFloat></attributeTextFloat>
        <!-- 文字内容  -->
        <attribute-text-content></attribute-text-content>
        <!-- 位置信息 -->
        <attributePostion></attributePostion>
        <!-- 阴影 -->
        <attributeShadow></attributeShadow>
        <!-- 边框 -->
        <attributeBorder></attributeBorder>
        <!-- 圆角 -->
        <attributeRounded></attributeRounded>
        <!-- 关联数据 -->
        <attributeId></attributeId>

        <!-- 新增字体样式使用 -->
        <Button @click="canvasEditor.getFontJson()" size="small">获取元素数据</Button>
      </div>
    </div>
    <!-- <attribute v-if="state.show"></attribute> -->
  </div>
  <!-- 右侧关闭按钮 -->
  <div
    :class="`close-btn right-btn ${attrBarShow && 'right-btn-open'}`"
    @click="attrBarShow = !attrBarShow"
  ></div>
</template>

<script setup lang="ts">
import align from '@/components/align.vue';
import centerAlign from '@/components/centerAlign.vue';
import flip from '@/components/flip.vue';
import clone from '@/components/clone.vue';
import hide from '@/components/hide.vue';
import group from '@/components/group.vue';
import bgBar from '@/components/bgBar.vue';
import setSize from '@/components/setSize.vue';
import replaceImg from '@/components/replaceImg.vue';
import filters from '@/components/filters.vue';
import imgStroke from '@/components/imgStroke.vue';
import attributePostion from '@/components/attributePostion.vue';
import attributeId from '@/components/attributeId.vue';
import attributeShadow from '@/components/attributeShadow.vue';
import attributeBorder from '@/components/attributeBorder.vue';
import attributeRounded from '@/components/attributeRounded.vue';
import attributeFont from '@/components/attributeFont.vue';
import attributeTextFloat from '@/components/attributeTextFloat.vue';
import attributeColor from '@/components/attributeColor.vue';
import attributeBarcode from '@/components/attributeBarcode.vue';
import attributeQrCode from '@/components/attributeQrCode.vue';
import lock from '@/components/lock.vue';
import dele from '@/components/del.vue';
import { inject } from 'vue';

const mixinState = inject('mixinState');
const canvasEditor = inject('canvasEditor');

const show = defineModel('show', { type: Boolean });
const attrBarShow = defineModel('attrBarShow', { type: Boolean });
</script>

<style lang="less" scoped>
// 右侧容器
.right-bar {
  width: 304px;
  height: 100%;
  padding: 10px;
  overflow-y: auto;
  background: #fff;
}
</style>
