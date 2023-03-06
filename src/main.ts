import { createApp } from 'vue'
import App from './App'
import router from './router'
import ViewUiPlus from 'view-ui-plus'
import './styles/index.less'

const app = createApp(App)

app.use(router)
    .use(ViewUiPlus)
    .mount('#app')
