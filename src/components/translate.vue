<template>
  <Tooltip :content="$t('quick.translate')" placement="top">
    <div class="box-item" @click="handleTranslate">
      <Icon type="md-repeat" :size="16" />
    </div>
  </Tooltip>
</template>

<script setup>
import useSelect from '@/hooks/select';
import { TRANSLATE_CONFIG, generateSign } from '@/config/translate';

const { canvasEditor } = useSelect();

const handleTranslate = async () => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  if (!activeObject || !activeObject.text) return;
  const query = activeObject.text;
  const salt = new Date().getTime();
  const sign = generateSign(query, salt, TRANSLATE_CONFIG.appid, TRANSLATE_CONFIG.key);

  try {
    const response = await fetch(`/baiduApi/api/trans/vip/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        q: query,
        from: 'en',
        to: 'zh',
        appid: TRANSLATE_CONFIG.appid,
        salt: salt,
        sign: sign,
      }),
    });

    const data = await response.json();
    if (data.trans_result) {
      activeObject.set('text', data.trans_result[0].dst);
      canvasEditor.canvas.renderAll();
    }
  } catch (error) {
    console.error('Translation failed:', error);
  }
};
</script>

<style scoped lang="less">
.box-item {
  padding: 5px 8px;
  cursor: pointer;
  display: inline-block;
  &:hover {
    color: #2d8cf0;
  }
}
</style>
