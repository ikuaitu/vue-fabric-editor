<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-10-07 17:21:29
 * @Description: 组合与拆分组合
-->

<template>
  <div v-if="isMultiple || isGroup" class="attr-item-box">
    <div class="bg-item">
      <!-- 组合按钮 多选时不可用 -->
      <Button v-if="isMultiple" long :disabled="!isMultiple" @click="group" type="text">
        <groupIcon width="14" height="14"></groupIcon>
        {{ $t('attrSeting.group') }}
      </Button>
      <!-- 拆分组合按钮，为单选且组元素时可用 -->
      <Button v-if="isGroup" long :disabled="!isGroup" @click="unGroup" type="text">
        <unGroupIcon width="14" height="14"></unGroupIcon>
        {{ $t('attrSeting.unGroup') }}
      </Button>
    </div>

    <!-- <Divider plain v-if="isGroup"></Divider> -->
  </div>
</template>

<script setup name="Group">
import useSelect from '@/hooks/select';
import groupIcon from '@/assets/icon/group/group.svg';
import unGroupIcon from '@/assets/icon/group/unGroup.svg';

const { isGroup, isMultiple, canvasEditor } = useSelect();

// 拆分组
const unGroup = () => {
  canvasEditor.unGroup();
};
const group = () => {
  canvasEditor.group();
};
</script>
<style scoped lang="less">
:deep(.ivu-btn) {
  &[disabled] {
    svg {
      opacity: 0.2;
    }
  }
}
</style>
