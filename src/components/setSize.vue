<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2022-09-04 00:21:58
 * @Description: 尺寸设置
-->

<template>
  <div>
    <Divider plain orientation="left">{{ $t('size') }}</Divider>
    <Form :label-width="40">
      <FormItem :label="$t('width')" prop="name">
          <InputNumber :max="2000" :min="1" v-model="width" @on-change="setSize" size="small"></InputNumber>
      </FormItem>
      <FormItem :label="$t('height')" prop="name">
          <InputNumber :max="2000" :min="1" v-model="height" @on-change="setSize" size="small"></InputNumber>
      </FormItem>
    </Form>
    <Divider plain orientation="left">{{ $t('default_size') }}</Divider>
    <ButtonGroup vertical>
      <Button
        v-for="(item, i) in presetSize"
        :key="i + 'presetSize'"
        size="small"
        style="text-align:left"
        @click="setSizeBy(item.width * item.scale, item.height * item.scale)"
        >
        {{ item.label }}:{{ item.width }}x{{ item.height }}*{{ item.scale }}
      </Button>
    </ButtonGroup>
  </div>
</template>

<script>
export default {
  name: 'canvasSize',
  inject: ['canvas', 'fabric'],
  data() {
    return {
      width: 900 * 0.5,
      height: 1200 * 0.5,
      presetSize: [{
        label: this.$t('red_book_vertical'),
        width: 900,
        height: 1200,
        scale: 0.5,
      },
      {
        label: this.$t('red_book_horizontal'),
        width: 1200,
        height: 900,
        scale: 0.5,
      },
      {
        label: this.$t('phone_wallpaper'),
        width: 1080,
        height: 1920,
        scale: 0.4,
      },
      ]
    };
  },
  created() {
    this.setSize()
  },
  methods: {
    setSizeBy(width, height) {
      this.canvas.c.setWidth(width);
      this.canvas.c.setHeight(height);
      this.canvas.c.renderAll()
      this.width = width
      this.height = height
    },
    setSize() {
      this.canvas.c.setWidth(this.width);
      this.canvas.c.setHeight(this.height);
      this.canvas.c.renderAll()
    }
  }
};
</script>

<style scoped lang="less">
/deep/ .ivu-form-item {
    margin-bottom: 0;
}
/deep/ .ivu-divider-plain.ivu-divider-with-text-left{
  margin: 10px 0;
  font-weight: bold;
}
</style>
