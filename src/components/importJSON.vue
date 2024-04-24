<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-22 16:26:27
 * @Description: 导入JSON文件
-->

<template>
  <div style="display: inline-block">
    <Button @click="insert" type="text" size="small">{{ $t('import_files') }}</Button>
  </div>
</template>

<script name="ImportJson" setup>
import useSelect from '@/hooks/select';

const { canvasEditor } = useSelect();
const insert = () => {
  canvasEditor.insert();
};
</script>
