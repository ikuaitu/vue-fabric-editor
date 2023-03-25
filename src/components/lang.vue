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

<script>
import select from '@/mixins/select';
import { setLocal } from '@/utils/local';
import { LANG } from '@/config/constants/app';

const LANGMAP = {
  zh: '中文',
  en: 'En',
};
export default {
  name: 'saveBar',
  mixins: [select],
  data() {
    return {
      langList: Object.keys(LANGMAP).map((key) => ({ langType: key, langName: LANGMAP[key] })),
    };
  },
  computed: {
    lang() {
      return LANGMAP[this.$i18n.locale];
    },
  },
  methods: {
    // 设置语言
    setLang(type) {
      this.$i18n.locale = type;
      setLocal(LANG, type);
      window.location.reload();
    },
  },
};
</script>

<style scoped lang="less"></style>
