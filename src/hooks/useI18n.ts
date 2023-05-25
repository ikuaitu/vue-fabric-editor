/*
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-05-10 21:47:33
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-05-10 21:50:30
 * @FilePath: \vue-fabric-editor\src\hooks\useI18n.js
 * @Description: 封装国际化为hook
 */
import { ComponentInternalInstance, getCurrentInstance } from 'vue';

export default function useI18n() {
  const instance = getCurrentInstance() as ComponentInternalInstance;
  return instance.appContext.config.globalProperties.$t;
}
