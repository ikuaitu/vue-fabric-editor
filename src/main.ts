import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

import App from './App.vue'
import router from './router'

import ViewUIPlus from 'view-ui-plus'
import 'view-ui-plus/dist/styles/viewuiplus.css'

import i18n from './language/index'

const app = createApp(App)

app
  .use(i18n)
  .use(createPinia())
  .use(router)
  .use(ViewUIPlus, {
    i18n: (key, value) => i18n.t(key, value)
  })
  .mount('#app')

console.log(app, 'app')
