<template>
  <Header class="home-header">
    <div class="home-header_left">
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
        <iSwitch
          v-model="ruler"
          @on-change="(val: boolean) => emits('rulerSwitch', val)"
          size="small"
          class="switch"
        ></iSwitch>
      </Tooltip>
      <Divider type="vertical" />
      <history></history>
    </div>

    <div class="home-header_right">
      <a href="https://github.com/nihaojob/vue-fabric-editor" target="_blank">
        <img
          src="https://camo.githubusercontent.com/f440bed74efe64ce92599748090837ec92cc33ead4bf29d115d9745af1415c19/68747470733a2f2f62616467656e2e6e65742f6769746875622f73746172732f6e6968616f6a6f622f7675652d6661627269632d656469746f72"
          alt="vue-fabric-editor"
          class="home-header_right_img"
        />
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

<script name="homeHeader" setup lang="ts">
// 导入元素
import importJson from '@/components/importJSON.vue';
import importFile from '@/components/importFile.vue';

import logo from '@/components/logo.vue';
import myTemplName from '@/components/myTemplName.vue';
import previewCurrent from '@/components/previewCurrent.vue';
import save from '@/components/save.vue';
import lang from '@/components/lang.vue';
import waterMark from '@/components/waterMark.vue';
import login from '@/components/login.vue';
import admin from '@/components/admin.vue';

defineProps({
  canvasEditor: {
    type: Object,
    default: () => ({}),
  },
});

const emits = defineEmits(['rulerSwitch']);

const ruler = defineModel<boolean>('ruler', {
  type: Boolean,
  default: false,
});
</script>

<style lang="less" scoped>
.home-header {
  --height: 45px;
  padding: 0 20px;
  border-bottom: 1px solid #eef2f8;
  background: #fff;
  height: var(--height);
  line-height: var(--height);
  display: flex;
  justify-content: space-between;
}
.home-header_left,
.home-header_right {
  display: flex;
  align-items: center;
}
.home-header_right_img {
  display: block;
  margin-right: 10px;
}
</style>
