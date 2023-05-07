<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: June
 * @LastEditTime: 2023-04-02 23:51:49
 * @Description: 尺寸设置
-->

<template>
  <div v-if="!mSelectMode">
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

<script>
import select from '@/mixins/select';
import EditorWorkspace from '@/core/EditorWorkspace';

export default {
  name: 'canvasSize',
  mixins: [select],
  inject: ['canvas', 'fabric'],
  data() {
    return {
      width: 900,
      height: 1200,
      presetSize: [
        {
          label: this.$t('red_book_vertical'),
          width: 900,
          height: 1200,
        },
        {
          label: this.$t('red_book_horizontal'),
          width: 1200,
          height: 900,
        },
        {
          label: this.$t('phone_wallpaper'),
          width: 1080,
          height: 1920,
        },
      ],
    };
  },
  mounted() {
    this.canvas.editor.editorWorkspace = new EditorWorkspace(this.canvas.c, {
      width: this.width,
      height: this.height,
    });
  },
  methods: {
    setSizeBy(width, height) {
      this.width = width;
      this.height = height;
      this.setSize();
    },
    setSize() {
      this.canvas.editor.editorWorkspace.setSize(this.width, this.height);
    },
  },
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
