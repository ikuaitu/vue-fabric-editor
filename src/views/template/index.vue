<!--
 * @Author: 秦少卫
 * @Date: 2024-05-17 15:30:21
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-12 22:52:04
 * @Description: file content
-->
<template>
  <div class="home">
    <Layout>
      <!-- 头部区域 -->
      <Header :style="{ position: 'fixed', width: '100%', zIndex: 99 }">
        <div class="left">
          <logo></logo>
          <!-- 导入 -->
          <Divider type="vertical" />
          在线设计工具
        </div>

        <div class="right">
          <Button type="primary" to="/" size="smail" target="_blank">新建设计</Button>
          <Divider type="vertical" />
          <a href="https://github.com/nihaojob/vue-fabric-editor" target="_blank">
            <img
              src="https://camo.githubusercontent.com/f440bed74efe64ce92599748090837ec92cc33ead4bf29d115d9745af1415c19/68747470733a2f2f62616467656e2e6e65742f6769746875622f73746172732f6e6968616f6a6f622f7675652d6661627269632d656469746f72"
              alt="vue-fbric-editor"
            />
          </a>
          <!-- 预览 -->
          <login></login>
          <lang></lang>
        </div>
      </Header>

      <!-- banner -->
      <Content :style="{ margin: '40px 20px 0', minHeight: '500px', minWidth: '1200px' }">
        <banner></banner>
        <div class="search-box">
          <Input
            size="large"
            class="search-input"
            clearable
            search
            v-model="filters.name.$containsi"
            enter-button
            placeholder="请输入关键词"
            @on-search="search"
          />
          <TagSelect v-model="filters.templ_type.$in" @on-change="search">
            <TagSelectOption :name="item.id" :key="item.id" v-for="item in typeList">
              {{ item.name }}
            </TagSelectOption>
          </TagSelect>
        </div>

        <!-- grid布局 -->
        <div
          class="img-box grid"
          id="imgBox"
          v-masonry
          transition-duration="0.3s"
          :gutter="10"
          item-selector=".grid-item"
        >
          <div v-masonry-tile class="img-item grid-item" v-for="info in templList" :key="info.id">
            <Tooltip :content="info.name" placement="top">
              <img :src="info.src" :alt="info.name" @click="toInfo(info)" />
            </Tooltip>
          </div>
        </div>
        <Page
          class="page"
          :total="total"
          v-model="page"
          @on-change="getTmplListHandel"
          @on-page-size-change="(val) => (pageSize = val)"
          :page-size="pageSize"
          show-sizer
        />
      </Content>
      <Footer class="layout-footer-center">
        2024 &copy; 北京迅单科技有限公司 京ICP备2022034407号-2
      </Footer>
    </Layout>
  </div>
</template>

<script name="Home" setup>
import { toRaw } from 'vue';
import { Spin } from 'view-ui-plus';
import qs from 'qs';

import { useRouter } from 'vue-router';
const router = useRouter();
// 路由
import banner from './components/banner.vue';
// 顶部组件
import logo from '@/components/logo.vue';
import lang from '@/components/lang.vue';
import login from '@/components/login';

import { getMaterialPreviewUrl } from '@/hooks/usePageList';
import { getTmplTypes, getTmplList } from '@/api/material';

// 分类列表
const typeList = ref([]);
const getTypeListHandel = async () => {
  const res = await getTmplTypes();
  typeList.value = res.data.data.map((item) => {
    return {
      id: item.id,
      name: item.attributes.name,
    };
  });
};
getTypeListHandel();

// 模板列表
const templList = ref([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);

const filters = reactive({
  name: {
    $containsi: '',
  },
  templ_type: {
    $in: [],
  },
});

const getTmplListHandel = async () => {
  const params = {
    populate: {
      img: '*',
    },
    filters: toRaw(filters),
    fields: ['name'],
    pagination: {
      page: page.value,
      pageSize: pageSize.value,
    },
  };
  Spin.show();
  try {
    const res = await getTmplList(qs.stringify(params));

    total.value = res.data.meta.pagination.total;
    templList.value = res.data.data.map((item) => ({
      id: item.id,
      name: item.attributes.name,
      src: getMaterialPreviewUrl(item.attributes.img),
    }));
  } catch (error) {
    console.log(error);
  }
  Spin.hide();
};

const search = () => {
  page.value = 1;
  getTmplListHandel();
};
getTmplListHandel();

const toInfo = (info) => {
  const href = router.resolve({
    path: '/',
    query: {
      tempId: info.id,
    },
  });
  console.log(href, 1111);
  // 点击事件
  window.open(href.href, '_blank');
};
</script>
<style lang="less" scoped>
// header
:deep(.ivu-layout-header) {
  --height: 45px;
  padding: 0 0px;
  border-bottom: 1px solid #eef2f8;
  background: #fff;
  height: var(--height);
  line-height: var(--height);
  display: flex;
  justify-content: space-between;

  .left,
  .right {
    display: flex;
    align-items: center;
    img {
      display: block;
      margin-right: 10px;
    }
  }
}

// footer
.layout-footer-center {
  text-align: center;
}

// 搜索弹框
.search-box {
  width: 1200px;
  margin: 20px auto;
  border-radius: 10px;
  background: #ffffffed;
  padding: 20px;
  border: 2px solid #fff;

  :deep(.ivu-tag-select) {
    line-height: 32px;
    max-height: none;
    margin-left: 0;
    margin-top: 20px;
    .ivu-tag {
      font-size: 20px;
      line-height: 32px;
      height: 32px;
    }
  }
}

// 流布局
.img-box {
  width: 1200px;
  margin: 0 auto;
  .grid-item {
    width: 232px;
    cursor: pointer;
    margin-bottom: 5px;

    img {
      width: 100%;
      border-radius: 10px;
      &:hover {
        // animation: 3s linear 1s slidein;
        transform: scale(1.02);
      }
    }
  }
}

// 分页
.page {
  margin: 20px auto;
  text-align: center;
}
</style>
