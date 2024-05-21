<!--
 * @Author: 秦少卫
 * @Date: 2024-05-21 10:10:24
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-21 15:37:03
 * @Description: 阴影
-->

<template>
  <div class="box attr-item-box" v-if="mixinState.mSelectMode === 'one'">
    <!-- <h3>阴影</h3> -->
    <Divider plain orientation="left"><h4>阴影</h4></Divider>
    <!-- 通用属性 -->
    <div>
      <Row :gutter="10">
        <Col flex="1">
          <div class="ivu-col__box">
            <span class="label">{{ $t('color') }}</span>
            <div class="content">
              <ColorPicker v-model="baseAttr.shadow.color" @on-change="changeCommon" alpha />
            </div>
          </div>
        </Col>
        <Col flex="1">
          <InputNumber
            v-model="baseAttr.shadow.blur"
            :defaultValue="0"
            @on-change="changeCommon"
            :append="$t('attributes.blur')"
            :min="0"
          ></InputNumber>
        </Col>
      </Row>
      <div>
        <Row :gutter="10">
          <Col flex="1">
            <InputNumber
              v-model="baseAttr.shadow.offsetX"
              :defaultValue="0"
              @on-change="changeCommon"
              :append="$t('attributes.offset_x')"
            ></InputNumber>
          </Col>
          <Col flex="1">
            <InputNumber
              v-model="baseAttr.shadow.offsetY"
              :defaultValue="0"
              @on-change="changeCommon"
              :append="$t('attributes.offset_y')"
            ></InputNumber>
          </Col>
        </Row>
      </div>
    </div>
    <!-- <Divider plain></Divider> -->
  </div>
</template>

<script setup name="AttrBute">
import useSelect from '@/hooks/select';
import InputNumber from '@/components/inputNumber';

const update = getCurrentInstance();
const { fabric, mixinState, canvasEditor } = useSelect();

// 属性值
const baseAttr = reactive({
  shadow: {},
});

// 属性获取
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return;
  if (activeObject) {
    baseAttr.shadow = activeObject.get('shadow') || {};
  }
};

// 通用属性改变
const changeCommon = () => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject) {
    activeObject.set('shadow', new fabric.Shadow(baseAttr.shadow));
    canvasEditor.canvas.renderAll();
  }
};

const selectCancel = () => {
  update?.proxy?.$forceUpdate();
};

onMounted(() => {
  // 获取字体数据
  getObjectAttr();
  canvasEditor.on('selectCancel', selectCancel);
  canvasEditor.on('selectOne', getObjectAttr);
  canvasEditor.canvas.on('object:modified', getObjectAttr);
});

onBeforeUnmount(() => {
  canvasEditor.off('selectCancel', selectCancel);
  canvasEditor.off('selectOne', getObjectAttr);
  canvasEditor.canvas.off('object:modified', getObjectAttr);
});
</script>

<style scoped lang="less">
:deep(.ivu-input-number) {
  display: block;
  width: 100%;
}

:deep(.ivu-color-picker) {
  display: block;
}
.box {
  width: 100%;
}

.ivu-row {
  margin-bottom: 8px;
  .ivu-col {
    position: inherit;
    &__box {
      display: flex;
      align-items: center;
      background: #f8f8f8;
      border-radius: 4px;
      gap: 8px;
    }
  }

  .label {
    padding-left: 8px;
  }
  .content {
    flex: 1;
    :deep(.--input),
    :deep(.ivu-select-selection) {
      background-color: transparent;
      border: none !important;
      box-shadow: none !important;
    }
  }
}
</style>
