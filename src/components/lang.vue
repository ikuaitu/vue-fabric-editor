<template>
  <Dropdown @on-click="setLang">
    <Button type="text">
      {{ lang }}
      <Icon type="ios-arrow-down"></Icon>
    </Button>
    <template #list>
      <DropdownMenu>
        <DropdownItem v-for="lang in langList" :key="lang.langType" :name="lang.langType">
          {{ lang.langName }}
        </DropdownItem>
      </DropdownMenu>
    </template>
  </Dropdown>
</template>

<script setup name="saveBar">
import { setLocal } from '@/utils/local';
import { LANG } from '@/config/constants/app';
import { reactive, computed } from 'vue';
import { getCurrentInstance } from 'vue';

const $i18n = getCurrentInstance().appContext.config.globalProperties.$i18n;
const LANGMAP = {
  zh: '中文',
  en: 'En',
};

let langList = reactive(
  Object.keys(LANGMAP).map((key) => ({ langType: key, langName: LANGMAP[key] }))
);

const lang = computed(() => {
  return LANGMAP[$i18n.locale];
});

// 设置语言
const setLang = (type) => {
  $i18n.locale = type;
  setLocal(LANG, type);
  window.location.reload();
};
</script>

<style scoped lang="less"></style>
