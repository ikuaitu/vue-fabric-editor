<template>
  <Dropdown @on-click="setLang">
    <Button type="text">
      {{ lang | langMap }}
      <Icon type="ios-arrow-down"></Icon>
    </Button>
    <DropdownMenu slot="list">
      <DropdownItem v-for="lang in langList" :key="lang.langType" :name="lang.langType">
        {{ lang.langName }}
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>
</template>

<script>
import select from '@/mixins/select';
import { setLocal } from '@/utils/local';
import { LANG } from '@/config/constants/app';

const LANGMAP = {
  zh: '中文',
  en: 'En',
  pt: 'Portugal',
};
export default {
  name: 'saveBar',
  mixins: [select],
  data() {
    return {
      langList: Object.keys(LANGMAP).map((key) => ({ langType: key, langName: LANGMAP[key] })),
    };
  },
  filters: {
    langMap(key) {
      return LANGMAP[key];
    },
  },
  computed: {
    lang() {
      return this.$i18n.locale;
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
