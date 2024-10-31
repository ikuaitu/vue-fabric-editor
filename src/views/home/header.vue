<template>
  <Header v-if="state.show">
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
        <iSwitch
          v-model="state.ruler"
          @on-change="rulerSwitch"
          size="small"
          class="switch"
        ></iSwitch>
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

<script setup>
import logo from '@/components/logo.vue';
import importJson from '@/components/importJSON.vue';
import importFile from '@/components/importFile.vue';
import myTemplName from '@/components/myTemplName.vue';
import history from '@/components/history.vue';
import admin from '@/components/admin';
import previewCurrent from '@/components/previewCurrent';
import waterMark from '@/components/waterMark.vue';
import save from '@/components/save.vue';
import login from '@/components/login';
import lang from '@/components/lang.vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { reactive } from 'vue';

const { t } = useI18n();
const route = useRoute();
const state = reactive({
  show: true,
  ruler: true,
});

const rulerSwitch = (val) => {
  if (val) {
    canvasEditor.rulerEnable();
  } else {
    canvasEditor.rulerDisable();
  }
  document.activeElement.blur();
};
</script>

<style scoped>
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
