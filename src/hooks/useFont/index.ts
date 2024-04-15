/*
 * @Author: June
 * @Description: 获取免费字体
 * @Date: 2024-03-24 10:19:05
 * @LastEditors: June
 * @LastEditTime: 2024-03-24 11:00:31
 */
import FontFaceObserver from 'fontfaceobserver';
import fontList from '@/assets/fonts/font';
import axios from 'axios';
import { Spin, Message } from 'view-ui-plus';

const repoSrc = import.meta.env.APP_REPO;

const _fontList = ref<any[]>([]);

export function useFont() {
  const initFont = () => {
    if (unref(_fontList).length > 0) return;
    axios.get(`${repoSrc}/font/free-font.json`).then((res) => {
      _fontList.value = [...Object.entries(res.data).map(([, value]) => value)];
    });
  };

  const fontsList = computed(() => [...fontList, ...unref(_fontList)]);

  const loadFont = (fontName: string) => {
    if (!fontName) return false;
    return new Promise((resolve: any) => {
      Spin.show();
      const font = new FontFaceObserver(fontName);
      font
        .load(null, 150000)
        .then(() => {
          Message.success('字体加载成功');
          Spin.hide();
          resolve(true);
        })
        .catch(() => {
          Message.error('字体加载失败');
          Spin.hide();
          resolve(false);
        });
    });
  };

  onMounted(initFont);
  return {
    initFont,
    fontsList,
    loadFont,
  };
}
