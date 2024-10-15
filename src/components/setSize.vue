<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-10-07 17:25:24
 * @Description: 尺寸设置
-->

<template>
  <div v-if="!isSelect" class="attr-item-box">
    <!-- <h3>{{ $t('bgSeting.size') }}</h3> -->
    <Divider plain orientation="left">
      <h4>{{ $t('bgSeting.size') }}</h4>
    </Divider>
    <Form :label-width="40" inline class="form-wrap">
      <FormItem :label="$t('bgSeting.width')" prop="name">
        <InputNumber disabled v-model="width" readonly @on-change="setSize"></InputNumber>
      </FormItem>
      <FormItem :label="$t('bgSeting.height')" prop="name">
        <InputNumber disabled v-model="height" readonly @on-change="setSize"></InputNumber>
      </FormItem>
      <FormItem :label-width="0">
        <Button type="text" @click="showSetSize">
          <Icon type="md-create" />
        </Button>
      </FormItem>
    </Form>

    <!-- <Divider plain></Divider> -->
    <!-- 修改尺寸 -->
    <modalSzie :title="$t('setSizeTip')" ref="modalSizeRef" @set="handleConfirm"></modalSzie>
  </div>
</template>

<script setup name="CanvasSize">
import useSelect from '@/hooks/select';
import modalSzie from '@/components/common/modalSzie';

const { isSelect, canvasEditor } = useSelect();

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

:deep(.ivu-input-number) {
  width: 70px;
}
.form-wrap {
  display: flex;
}
</style>
