<!--
 * @Author: 秦少卫
 * @Date: 2024-04-25 15:30:54
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-30 11:53:28
 * @Description: 我的素材
-->

<template>
  <div class="my-material" v-if="isLogin">
    <Tabs v-model="type">
      <TabPane label="模板" name="templ">
        <myTempl v-if="type === 'templ'"></myTempl>
      </TabPane>
      <TabPane label="图片" name="img">
        <uploadMaterial v-if="type === 'img'"></uploadMaterial>
      </TabPane>
    </Tabs>
  </div>
  <div class="tip" v-else>请先登录</div>
</template>

<script setup name="ImportTmpl">
import { getFileList } from '@/api/user';
import uploadMaterial from './uploadMaterial';
import myTempl from './myTempl';

const type = ref('templ');
const isLogin = ref(false);
const getFileListHandle = () => {
  // 获取素材列表
  getFileList()
    .then(() => {
      isLogin.value = true;
    })
    .catch(() => {
      isLogin.value = false;
    });
};

getFileListHandle();
</script>

<style scoped lang="less">
.tip {
  padding: 20px;
  text-align: center;
}
</style>
