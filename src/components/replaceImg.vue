<!--
 * @Author: 秦少卫
 * @Date: 2023-04-06 22:26:57
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-06 22:56:53
 * @Description: 图片替换
-->

<template>
  <div v-if="mSelectMode === 'one' && type === 'image'" class="box attr-item">
    <Button @click="repleace" type="text" long>替换图片</Button>
  </div>
</template>

<script>
import select from '@/mixins/select';
import { getImgStr, selectFiles, insertImgFile } from '@/utils/utils';

export default {
  name: 'replaceImg',
  mixins: [select],
  inject: ['canvas', 'fabric'],
  data() {
    return {
      id: '',
    };
  },
  created() {
    this.event.on('selectOne', () => {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      if (activeObject) {
        this.type = activeObject.type;
        this.$forceUpdate();
      }
    });
  },
  methods: {
    // 替换图片
    async repleace() {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      if (activeObject && activeObject.type === 'image') {
        // 图片
        const [file] = await selectFiles({ accept: 'image/*', multiple: false });
        // 转字符串
        const fileStr = await getImgStr(file);
        // 字符串转El
        const imgEl = await insertImgFile(fileStr);
        const width = activeObject.get('width');
        const height = activeObject.get('height');
        const scaleX = activeObject.get('scaleX');
        const scaleY = activeObject.get('scaleY');
        activeObject.setSrc(imgEl.src, () => {
          activeObject.set('scaleX', (width * scaleX) / imgEl.width);
          activeObject.set('scaleY', (height * scaleY) / imgEl.height);
          this.canvas.c.renderAll();
        });
        imgEl.remove();
      }
    },
  },
};
</script>

<style scoped lang="less"></style>
