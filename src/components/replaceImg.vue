<!--
 * @Author: 秦少卫
 * @Date: 2023-04-06 22:26:57
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-05 01:04:30
 * @Description: 图片替换
-->

<template>
  <div v-if="mixinState.mSelectMode === 'one' && type === 'image'" class="box attr-item">
    <Button @click="repleace" type="text" long>{{ $t('repleaceImg') }}</Button>
  </div>
</template>

<script setup name="ReplaceImg">
import useSelect from '@/hooks/select';

import { getImgStr, selectFiles, insertImgFile } from '@/utils/utils';

const update = getCurrentInstance();
const event = inject('event');
const { mixinState, canvasEditor } = useSelect();
const type = ref('');

// 替换图片
const repleace = async () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
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
      canvasEditor.canvas.renderAll();
    });
    imgEl.remove();
  }
};

const init = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject) {
    type.value = activeObject.type;
    update?.proxy?.$forceUpdate();
  }
};

onMounted(() => {
  event.on('selectOne', init);
});

onBeforeUnmount(() => {
  event.off('selectOne', init);
});
</script>
