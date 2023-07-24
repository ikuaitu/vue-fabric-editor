<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-24 23:13:24
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
    <Button type="primary" @click="() => (showModal = true)">调整尺寸</Button>

    <Modal
      v-model="showModal"
      :title="$t('setSizeTip')"
      @on-ok="handleConfirm"
      @on-cancel="handleClose"
    >
      <p>{{ $t('default_size') }}</p>
      <ButtonGroup vertical style="margin: 10px 0">
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

      <Form :label-width="40" class="form-wrap" style="justify-content: flex-start">
        <FormItem :label="$t('width')" prop="name" style="margin-right: 10px">
          <InputNumber :min="1" :max="2000" v-model="modalData.width"></InputNumber>
        </FormItem>
        <FormItem :label="$t('height')" prop="name">
          <InputNumber :min="1" :max="2000" v-model="modalData.height"></InputNumber>
        </FormItem>
      </Form>
    </Modal>
  </div>
</template>

<script setup name="CanvasSize">
import { Modal } from 'view-ui-plus';
import useSelect from '@/hooks/select';
import { useI18n } from 'vue-i18n';

const { mixinState, canvasEditor } = useSelect();
const { t } = useI18n();

const DefaultSize = {
  width: 900,
  height: 1200,
};

const showModal = ref(false);
const modalData = reactive({
  width: DefaultSize.width,
  height: DefaultSize.height,
});
let width = ref(DefaultSize.width);
let height = ref(DefaultSize.height);
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
  canvasEditor.setSize(width.value, height.value);
  canvasEditor.on('sizeChange', (width, height) => {
    width.value = width;
    height.value = height;
  });

  // canvas.editor.editorWorkspace.setSize(width.value, height.value);
  // canvas.editor.editorWorkspace = new EditorWorkspace(canvas.c, {
  //   width: width.value,
  //   height: height.value,
  // });
});

const setSizeBy = (w, h) => {
  modalData.width = w;
  modalData.height = h;
};
const setSize = () => {
  canvasEditor.setSize(width.value, height.value);
  // canvas.editor.editorWorkspace.setSize(width.value, height.value);
};

const handleClose = () => {
  showModal.value = false;
};

const handleConfirm = () => {
  width.value = modalData.width;
  height.value = modalData.height;
  setSize();
  handleClose();
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
