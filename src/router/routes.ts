import type { RouteRecordRaw } from 'vue-router';

import { setToken, autoLogin } from '@/api/user';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    beforeEnter: async (to) => {
      // 自动登录功能
      if (to.query.username && to.query.key) {
        const res = await autoLogin({
          username: to.query.username,
          key: to.query.key,
        });
        if (res.data.jwt) {
          setToken(res.data.jwt);
        }
      }
      return true;
    },
    component: () => import('@/views/home/index.vue'),
  },
];

export default routes;
