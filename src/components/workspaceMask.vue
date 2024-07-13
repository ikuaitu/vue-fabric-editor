<template>
  <div class="mask-wrap">
    <div>开启背景蒙版</div>

    <iSwitch v-model="openMask" size="large" @on-change="onMaskChange">
      <template #open>
        <span>开启</span>
      </template>
      <template #close>
        <span>关闭</span>
      </template>
    </iSwitch>
  </div>
</template>

<script lang="ts" setup>
import useSelect from '@/hooks/select';

const { canvasEditor }: any = useSelect();

const openMask = ref(false);
const onMaskChange = () => {
  canvasEditor?.workspaceMaskToggle();
};

onMounted(() => {
  openMask.value = canvasEditor?.getworkspaceMaskStatus();
});
</script>

<style lang="less" scoped>
.mask-wrap {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
