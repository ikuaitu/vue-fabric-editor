import Vue from "vue";
import VueI18n from "vue-i18n";
import { getLocal, setLocal } from '@/utils/local'
import { LANG } from '@/config/constants/app'
Vue.use(VueI18n);

function loadLocaleMessages() {
  const locales = require.context(
    "./locales",
    true,
    /[A-Za-z0-9-_,\s]+\.json$/i
  );
  const messages = {};
  locales.keys().forEach(key => {
    const matched = key.match(/([A-Za-z0-9-_]+)\./i);
    if (matched && matched.length > 1) {
      const locale = matched[1];
      messages[locale] = locales(key);
    }
  });
  return messages;
}

function getLocalLang() {
  const localLang = getLocal(LANG)
  if(!localLang) {
    setLocal(LANG, 'ch')
  }
  return localLang ? localLang : 'ch'
}
const lang = getLocalLang()

export default new VueI18n({
  locale: lang,
  fallbackLocale: lang,
  messages: loadLocaleMessages()
});
