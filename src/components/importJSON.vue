<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-11 19:15:19
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
    <!-- 修改尺寸 -->
    <modalSzie
      :title="$t('importFiles.createDesign.title')"
      ref="modalSizeRef"
      @set="customSizeCreate"
    ></modalSzie>
  </div>
</template>

<script name="ImportJson" setup>
import useSelect from '@/hooks/select';
import useMaterial from '@/hooks/useMaterial';
import { Message } from 'view-ui-plus';
import modalSzie from '@/components/common/modalSzie';

const { canvasEditor } = useSelect();
const { createTmpl, routerToId } = useMaterial();
const modalSizeRef = ref(null);

const clickHandler = (type) => {
  const handleMap = {
    // 导入文件
    importFiles: canvasEditor.insert,
    // 创建文件
    createDesign,
  };
  handleMap[type]?.();
};

const createDesign = () => {
  modalSizeRef.value.showSetSize();
};

const customSizeCreate = async (w, h) => {
  const res = await createTmpl(w, h);
  routerToId(res.data.data.id);
  Message.success('创建成功');
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
