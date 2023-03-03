import { createI18n } from 'vue-i18n'
import zh from 'view-ui-plus/dist/locale/zh-CN';
import en from 'view-ui-plus/dist/locale/en-US';//新版本把'iview'改成'view-design'
import US from './en.json';
import CN from './zh.json'



const messages = {
  en: Object.assign(US, en),  //将自己的英文包和iview提供的结合
  zh: Object.assign(CN, zh)  //将自己的中文包和iview提供的结合
};

const i18n = createI18n({
  allowComposition: true,
  globalInjection: true,
  legacy: false,
  locale: 'zh',
  messages: messages
});

export default i18n