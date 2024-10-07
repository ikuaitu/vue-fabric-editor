<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-10-07 17:26:59
 * @Description: 组合元素对齐
-->

<template>
  <div v-if="isMultiple" class="attr-item-box">
    <!-- <h3>对齐</h3> -->
    <Divider plain orientation="left"><h4>对齐</h4></Divider>
    <div class="bg-item">
      <!-- 水平对齐 -->
      <Tooltip :content="$t('attrSeting.align.left')">
        <Button @click="left" size="small" type="text">
          <leftIcon />
        </Button>
      </Tooltip>
      <Tooltip :content="$t('attrSeting.align.centerX')">
        <Button @click="xcenter" size="small" type="text">
          <centerxIcon />
        </Button>
      </Tooltip>
      <Tooltip :content="$t('attrSeting.align.right')">
        <Button @click="right" size="small" type="text">
          <rightIcon />
        </Button>
      </Tooltip>
      <!-- 垂直对齐 -->
      <Tooltip :content="$t('attrSeting.align.top')">
        <Button @click="top" size="small" type="text">
          <topIcon />
        </Button>
      </Tooltip>
      <Tooltip :content="$t('attrSeting.align.centerY')">
        <Button @click="ycenter" size="small" type="text">
          <centeryIcon />
        </Button>
      </Tooltip>
      <Tooltip :content="$t('attrSeting.align.bottom')">
        <Button @click="bottom" size="small" type="text">
          <bottomIcon />
        </Button>
      </Tooltip>
      <!-- 平均对齐 -->
      <Tooltip :content="$t('attrSeting.align.averageX')">
        <Button @click="xequation" size="small" type="text">
          <sxIcon />
        </Button>
      </Tooltip>
      <Tooltip :content="$t('attrSeting.align.averageY')">
        <Button @click="yequation" size="small" type="text">
          <syIcon />
        </Button>
      </Tooltip>
    </div>
    <!-- <Divider plain></Divider> -->
  </div>
</template>

<script name="Align" setup>
import useSelect from '@/hooks/select';

import leftIcon from '@/assets/icon/left.svg';
import rightIcon from '@/assets/icon/right.svg';

import topIcon from '@/assets/icon/top.svg';
import bottomIcon from '@/assets/icon/bottom.svg';

import sxIcon from '@/assets/icon/sx.svg';
import syIcon from '@/assets/icon/sy.svg';

import centerxIcon from '@/assets/icon/centerx.svg';
import centeryIcon from '@/assets/icon/centery.svg';

const { canvasEditor, isMultiple } = useSelect();

// 左对齐
const left = () => {
  canvasEditor.left();
};
// 右对齐
const right = () => {
  canvasEditor.right();
};
// 水平居中对齐
const xcenter = () => {
  canvasEditor.xcenter();
};
// 垂直居中对齐
const ycenter = () => {
  canvasEditor.ycenter();
};
// 顶部对齐
const top = () => {
  canvasEditor.top();
};
// 底部对齐
const bottom = () => {
  canvasEditor.bottom();
};
// 水平平均对齐
const xequation = () => {
  canvasEditor.xequation();
};
// 垂直平均对齐
const yequation = () => {
  canvasEditor.yequation();
};
</script>

<style scoped lang="less">
.icon {
  width: 100%;
  height: auto;
}
</style>
