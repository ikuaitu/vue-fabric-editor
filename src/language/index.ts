/*
 * @Author: June
 * @Description:
 * @Date: 2023-10-29 12:18:14
 * @LastEditors: June
 * @LastEditTime: 2023-11-01 12:01:24
 */
import { createI18n } from 'vue-i18n';
import zh from 'view-ui-plus/dist/locale/zh-CN';
import en from 'view-ui-plus/dist/locale/en-US'; //新版本把'iview'改成'view-design'
import US from './en.json';
import CN from './zh.json';
import { getLocal, setLocal } from '@/utils/local';
import { LANG } from '@/config/constants/app';

const messages = {
  en: Object.assign(US, en), //将自己的英文包和iview提供的结合
  zh: Object.assign(CN, zh), //将自己的中文包和iview提供的结合
};

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

const i18n = createI18n({
  allowComposition: true,
  globalInjection: true,
  legacy: false,
  locale: lang,
  messages,
});

export default i18n;
export const t = (key: any) => {
  return i18n.global.t(key);
};
