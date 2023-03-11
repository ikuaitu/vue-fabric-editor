import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { getLocal, setLocal } from '@/utils/local';
import { LANG } from '@/config/constants/app';
import { langList, messageCollection } from '@/locales/lang';
import { reduce } from 'lodash-es';

Vue.use(VueI18n);

function loadLocaleMessages() {
  const res = {};

  /**
   * 寻找语言合集中，对应的语言
   * @param name 语言名字
   * @param target
   * @return {*}
   */
  function findLang(name, target) {
    const collector = (acc, value, key) => {
      const groupItem = value && value[name];
      // 是语言对象
      if (groupItem) {
        acc[key] = groupItem;
      } else if (typeof value === 'object') {
        acc[key] = findLang(name, value);
      }
      return acc;
    };
    return reduce(target, collector, {});
  }

  langList.forEach((langName) => {
    res[langName] = findLang(langName, messageCollection);
  });
  return res;
}

function getLocalLang() {
  let localLang = getLocal(LANG);
  if (!localLang) {
    let defaultLang = navigator.language;
    if (defaultLang) {
      // eslint-disable-next-line prefer-destructuring
      defaultLang = defaultLang.split('-')[0];
      // eslint-disable-next-line prefer-destructuring
      localLang = defaultLang.split('-')[0];
    }
    setLocal(LANG, defaultLang);
  }
  return localLang;
}

const lang = getLocalLang();
console.log(`language: ${lang}`);
export default new VueI18n({
  locale: lang,
  fallbackLocale: lang,
  messages: loadLocaleMessages(),
});
