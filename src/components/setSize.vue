<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-11 19:11:46
 * @Description: 尺寸设置
-->

<template>
  <div v-if="!mixinState.mSelectMode">
    <Divider plain orientation="left">{{ $t('size') }}</Divider>
    <Form :label-width="40" class="form-wrap">
      <FormItem :label="$t('width')" prop="name">
        <InputNumber disabled v-model="width" @on-change="setSize"></InputNumber>
      </FormItem>
      <FormItem :label="$t('height')" prop="name">
        <InputNumber disabled v-model="height" @on-change="setSize"></InputNumber>
      </FormItem>
    </Form>
    <Button type="primary" @click="showSetSize">调整尺寸</Button>

    <!-- 修改尺寸 -->
    <modalSzie :title="$t('setSizeTip')" ref="modalSizeRef" @set="handleConfirm"></modalSzie>
  </div>
</template>

<script setup name="CanvasSize">
import useSelect from '@/hooks/select';
import modalSzie from '@/components/common/modalSzie';

const { mixinState, canvasEditor } = useSelect();

const DefaultSize = {
  width: 900,
  height: 1200,
};

const modalSizeRef = ref(null);

let width = ref(DefaultSize.width);
let height = ref(DefaultSize.height);

onMounted(() => {
  canvasEditor.setSize(width.value, height.value);
  canvasEditor.on('sizeChange', (w, h) => {
    width.value = w;
    height.value = h;
  });
});

const setSize = () => {
  canvasEditor.setSize(width.value, height.value);
};

const showSetSize = () => {
  modalSizeRef.value.showSetSize(width.value, height.value);
};
const handleConfirm = (w, h) => {
  width.value = w;
  height.value = h;
  setSize();
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

.form-wrap {
  display: flex;
  justify-content: space-around;
  align-content: center;
  margin-bottom: 10px;
}
</style>
