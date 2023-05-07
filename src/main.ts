import { createApp } from 'vue';
import App from './App';
import router from './router';
import ViewUiPlus from 'view-ui-plus';
import 'view-ui-plus/dist/styles/viewuiplus.css';
import './styles/index.less';
import VueLazyLoad from 'vue3-lazyload';

// 自定义字体文件
import '@/assets/fonts/font.css';
// import axios from 'axios';

import i18n from './language/index';

const app = createApp(App);
// app.config.globalProperties.$http = axios;

app.use(router).use(i18n).use(VueLazyLoad, {}).use(ViewUiPlus).mount('#app');
