<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-05-10 21:52:37
 * @Description: 尺寸设置f
-->

<template>
  <div v-if="!mixinState.mSelectMode">
    <Divider plain orientation="left">{{ $t('size') }}</Divider>
    <Form :label-width="40">
      <FormItem :label="$t('width')" prop="name">
        <InputNumber :max="2000" :min="1" v-model="width" @on-change="setSize"></InputNumber>
      </FormItem>
      <FormItem :label="$t('height')" prop="name">
        <InputNumber :max="2000" :min="1" v-model="height" @on-change="setSize"></InputNumber>
      </FormItem>
    </Form>
    <Divider plain orientation="left">{{ $t('default_size') }}</Divider>
    <ButtonGroup vertical>
      <Button
        v-for="(item, i) in presetSize"
        :key="`${i}presetSize`"
        size="small"
        style="text-align: left"
        @click="setSizeBy(item.width, item.height)"
      >
        {{ item.label }}:{{ item.width }}x{{ item.height }}
      </Button>
    </ButtonGroup>
  </div>
</template>

<script setup name="CanvasSize">
import useSelect from '@/hooks/select';
import { useI18n } from 'vue-i18n';
import EditorWorkspace from '@/core/EditorWorkspace';

const { canvas, mixinState } = useSelect();
const { t } = useI18n();

let width = ref(900);
let height = ref(1200);
let presetSize = reactive([
  {
    label: t('red_book_vertical'),
    width: 900,
    height: 1200,
  },
  {
    label: t('red_book_horizontal'),
    width: 1200,
    height: 900,
  },
  {
    label: t('phone_wallpaper'),
    width: 1080,
    height: 1920,
  },
]);

onMounted(() => {
  canvas.editor.editorWorkspace = new EditorWorkspace(canvas.c, {
    width: width.value,
    height: height.value,
  });
});

const setSizeBy = (w, h) => {
  width.value = w;
  height.value = h;
  setSize();
};
const setSize = () => {
  canvas.editor.editorWorkspace.setSize(width.value, height.value);
};
</script>

<style scoped lang="less">
:deep(.ivu-form-item) {
  margin-bottom: 0;
}
:deep(.ivu-divider-plain) {
  &.ivu-divider-with-text-left {
    margin: 10px 0;
    font-weight: bold;
  }
}
</style>
