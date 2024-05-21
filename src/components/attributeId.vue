<!--
 * @Author: 秦少卫
 * @Date: 2024-05-21 09:53:33
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-21 15:36:36
 * @Description: file content
-->

<template>
  <div class="box attr-item-box" v-if="mixinState.mSelectMode === 'one'">
    <!-- <h3>数据</h3> -->
    <Divider plain orientation="left"><h4>数据</h4></Divider>

    <Form :label-width="40" class="form-wrap">
      <FormItem :label="$t('attributes.id')">
        <Input
          v-model="baseAttr.id"
          @on-change="changeCommon('id', baseAttr.id)"
          size="small"
        ></Input>
      </FormItem>
    </Form>

    <Row :gutter="10">
      <Col flex="1">
        <Select
          v-model="baseAttr.linkData[0]"
          filterable
          allow-create
          @on-change="changeCommon('linkData', baseAttr.linkData)"
        >
          <Option value="src"></Option>
          <Option value="text"></Option>
        </Select>
      </Col>
      <Col flex="1">
        <Input v-model="baseAttr.linkData[1]" placeholder="请输入" />
      </Col>
    </Row>

    <!-- <Divider plain></Divider> -->
  </div>
</template>

<script setup name="AttrBute">
import useSelect from '@/hooks/select';

const update = getCurrentInstance();
const { mixinState, canvasEditor } = useSelect();

// 属性值
const baseAttr = reactive({
  id: 0,
  linkData: ['', ''],
});

// 属性获取
const getObjectAttr = (e) => {
  const activeObject = canvasEditor.canvas.getActiveObject();
  // 不是当前obj，跳过
  if (e && e.target && e.target !== activeObject) return;
  if (activeObject) {
    baseAttr.id = activeObject.get('id');
    baseAttr.linkData = activeObject.get('linkData') || ['', ''];
  }
};

// 通用属性改变
const changeCommon = (key, value) => {
  const activeObject = canvasEditor.canvas.getActiveObjects()[0];
  if (activeObject) {
    activeObject && activeObject.set(key, value);
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

.ivu-form-item {
  background: #f6f7f9;
  border-radius: 5px;
  padding: 0 5px;
  margin-bottom: 10px;
}

.ivu-row {
  margin-bottom: 10px;
}
</style>
