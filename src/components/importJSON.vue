<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-11 13:34:51
 * @Description: 导入JSON文件
-->

<template>
  <div style="display: inline-block">
    <Dropdown @on-click="clickHandler">
      <a href="javascript:void(0)">
        {{ $t('importFiles.file') }}
        <Icon type="ios-arrow-down"></Icon>
      </a>
      <template #list>
        <DropdownMenu>
          <DropdownItem name="createDesign">
            {{ $t('importFiles.createDesign.title') }}
          </DropdownItem>
          <DropdownItem name="importFiles">{{ $t('importFiles.importFiles') }}</DropdownItem>
        </DropdownMenu>
      </template>
    </Dropdown>

    <!-- 创建设计 -->
    <Modal v-model="modal" :title="$t('importFiles.createDesign.title')" footer-hide>
      <h3>
        {{ $t('importFiles.createDesign.customSize') }}
      </h3>
      <Form ref="formInline" inline :label-width="40">
        <FormItem label="宽度">
          <InputNumber v-model="width" :min="1" placeholder="请输入"></InputNumber>
        </FormItem>
        <FormItem label="高度">
          <InputNumber v-model="height" :min="1" placeholder="请输入"></InputNumber>
        </FormItem>
        <FormItem :label-width="0">
          <Button type="primary" @click="customSizeCreate">
            {{ $t('importFiles.createDesign.create') }}
          </Button>
        </FormItem>
      </Form>
      <Divider class="divider" />
      <h3>
        {{ $t('importFiles.createDesign.systemSize') }}
      </h3>
      <CellGroup @on-click="setSize">
        <Cell
          :title="item.name"
          :label="`${item.width}x${item.height}${item.unit}`"
          :arrow="false"
          :key="item.name"
          :name="`${item.width}x${item.height}x${item.unit}`"
          v-for="item in sizeList"
        >
          <template #extra>
            <Icon type="md-add" />
          </template>
        </Cell>
      </CellGroup>
    </Modal>
  </div>
</template>

<script name="ImportJson" setup>
import useSelect from '@/hooks/select';
import useMaterial from '@/hooks/useMaterial';
import { Message } from 'view-ui-plus';
const { canvasEditor } = useSelect();
const { createTmpl, routerToId } = useMaterial();

const clickHandler = (type) => {
  const handleMap = {
    // 导入文件
    importFiles: canvasEditor.insert,
    // 创建文件
    createDesign,
  };
  handleMap[type]?.();
};

const modal = ref(false);
const width = ref(null);
const height = ref(null);
const sizeList = ref([]);
const createDesign = () => {
  width.value = null;
  height.value = null;
  // 获取素材
  canvasEditor.getSizeList().then((res) => {
    sizeList.value = res;
  });
  modal.value = true;
};
const setSize = (itemString) => {
  const [w, h] = itemString.split('x');
  width.value = Number(w);
  height.value = Number(h);
};

const customSizeCreate = async () => {
  if (width.value && height.value) {
    const res = await createTmpl(width.value, height.value);
    routerToId(res.data.data.id);
    modal.value = false;
    Message.success('创建成功');
  } else {
    Message.warning('请检查尺寸');
  }
};
</script>
<style scoped lang="less">
h3 {
  margin-bottom: 10px;
}
.divider {
  margin-top: 0;
}
</style>
