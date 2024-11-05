<!--
 * @Author: 秦少卫
 * @Date: 2022-04-21 20:20:20
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-08-05 18:44:54
 * @Description: 缩放元素
-->
<template>
  <div class="box">
    <ButtonGroup>
      <Button @click="big">
        <bigIcon width="14" height="14"></bigIcon>
      </Button>
      <Button @click="small">
        <smallIcon width="14" height="14"></smallIcon>
      </Button>
      <Button @click="rSet" icon="ios-expand"></Button>
      <Button @click="setViewport" icon="md-contract"></Button>
    </ButtonGroup>
  </div>
</template>

<script setup name="Zoom">
import useSelect from '@/hooks/select';
import bigIcon from '@/assets/icon/zoom/big.svg';
import smallIcon from '@/assets/icon/zoom/small.svg';

const { canvasEditor } = useSelect();

const rSet = () => {
  canvasEditor.one();
};
const big = () => {
  canvasEditor.big();
};
const small = () => {
  canvasEditor.small();
};
const setViewport = () => {
  canvasEditor.auto();
};
</script>
<style scoped lang="less">
.box {
  position: absolute;
  right: 10px;
  bottom: 10px;

  :deep(.ivu-btn:hover) {
    svg {
      fill: #57a3f3;
    }
  }
}
</style>
