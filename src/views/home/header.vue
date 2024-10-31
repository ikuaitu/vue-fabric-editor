<template>
  <Header v-if="$props.show">
    <div class="left">
      <logo></logo>
      <Divider type="vertical" />

      <!-- 导入 -->
      <import-Json></import-Json>
      <Divider type="vertical" />
      <import-file></import-file>
      <Divider type="vertical" />
      <Button type="text" to="/template" target="_blank">全部模板</Button>
      <Divider type="vertical" />

      <myTemplName></myTemplName>
      <!-- 标尺开关 -->
      <Tooltip :content="$t('grid')">
        <iSwitch v-model="ruler" @on-change="rulerSwitch" size="small" class="switch"></iSwitch>
      </Tooltip>
      <Divider type="vertical" />
      <history></history>
    </div>

    <div class="right">
      <a href="https://pro.kuaitu.cc/" target="_blank" alt="商业版">
        <img width="15" :src="proIcon" alt="vue-fbric-editor" />
      </a>
      <!-- 管理员模式 -->
      <admin />
      <!-- 预览 -->
      <previewCurrent />
      <waterMark />
      <save></save>
      <login></login>
      <lang></lang>
    </div>
  </Header>
</template>

<script setup lang="ts" name="HomeHeader">
import proIcon from '@/assets/icon/proIcon.png';
import logo from '@/components/logo.vue';
// 导入元素
import importJson from '@/components/importJSON.vue';
import importFile from '@/components/importFile.vue';
import myTemplName from '@/components/myTemplName.vue';
import history from '@/components/history.vue';
import admin from '@/components/admin.vue';
import previewCurrent from '@/components/previewCurrent.vue';
import waterMark from '@/components/waterMark.vue';
import save from '@/components/save.vue';
import login from '@/components/login.vue';
import lang from '@/components/lang.vue';
import type { IEditor } from '@kuaitu/core';

const props = defineProps<{
  show: boolean;
  canvasEditor: IEditor;
}>();

const ruler = defineModel<boolean>('ruler', {
  default: true,
});

const rulerSwitch = (val: boolean) => {
  if (val) {
    props.canvasEditor.rulerEnable();
  } else {
    props.canvasEditor.rulerDisable();
  }
  // 使标尺开关组件失焦，避免响应键盘的空格事件
  // @ts-expect-error type error
  document.activeElement.blur();
};
</script>

<style lang="less" scoped>
.left,
.right {
  display: flex;
  align-items: center;
  img {
    display: block;
    margin-right: 10px;
  }
}
</style>
