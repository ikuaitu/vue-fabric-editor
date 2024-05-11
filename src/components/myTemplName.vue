<!--
 * @Author: 秦少卫
 * @Date: 2024-05-11 13:23:48
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-11 17:33:56
 * @Description: 文件名称
-->

<template>
  <div style="display: inline-block" v-if="route?.query?.id">
    <Input
      v-model="fileName"
      placeholder="请输入文件名称"
      style="width: 190px"
      size="small"
      @on-change="changeFileName"
      :loading="loading"
    />
    <Button type="text" @click="saveTempl" :loading="loading">
      <Icon type="ios-cloud-done" :color="loading ? '#ff9900' : '#19be6b'" />
    </Button>
    <Divider type="vertical" />
  </div>
</template>

<script name="ImportJson" setup>
import { debounce } from 'lodash-es';
import useMaterial from '@/hooks/useMaterial';
import { useRoute } from 'vue-router';
import useSelect from '@/hooks/select';
const { getTemplInfo, updataTemplInfo } = useMaterial();

const { canvasEditor } = useSelect();

const fileName = ref('');
const route = useRoute();
const loading = ref(false);

watch(
  () => route.query,
  (query) => {
    if (query?.id) {
      getTemplInfo(query?.id).then((res) => {
        fileName.value = res?.data?.attributes?.name;
      });
    } else {
      fileName.value = false;
    }
  }
);

onMounted(() => {
  if (route?.query?.id) {
    getTemplInfo(route?.query?.id)
      .then((res) => {
        fileName.value = res?.data?.attributes?.name;
        canvasEditor.loadJSON(JSON.stringify(res?.data?.attributes?.json));
      })
      .catch(() => {
        window.location.href = '/';
      });
  }
});
const saveTempl = () => {
  loading.value = true;
  updataTemplInfo(route.query.id, fileName.value)
    .then()
    .finally(() => {
      loading.value = false;
    });
};

const changeFileName = debounce(() => {
  saveTempl();
}, 1000);
</script>
<style scoped lang="less">
h3 {
  margin-bottom: 10px;
}
.divider {
  margin-top: 0;
}
</style>
