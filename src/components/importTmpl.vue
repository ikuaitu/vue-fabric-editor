<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-11 18:19:04
 * @Description: 导入模板
-->

<template>
  <div>
    <!-- 搜索组件 -->
    <div class="search-box">
      <Select
        class="select"
        v-model="materialType"
        @on-change="startGetMaterialList"
        :disabled="loading"
      >
        <Option key="全部" value="">全部</Option>
        <Option v-for="item in materialTypeList" :value="item.value" :key="item.value">
          {{ item.label }}
        </Option>
      </Select>
      <Input
        class="input"
        :placeholder="`在${getSearchTypeText()}中搜索`"
        v-model="searchKeyword"
        search
        :disabled="loading"
        @on-search="startGetMaterialList"
      />
    </div>

    <!-- 列表 -->
    <div style="height: calc(100vh - 110px)" id="myTemplBox">
      <Scroll
        key="mysscroll"
        v-if="showScroll"
        :on-reach-bottom="handleReachBottom"
        :height="scrollHeight"
        :distance-to-edge="[-1, -1]"
      >
        <!-- 列表 -->
        <div>
          <Tooltip
            :content="info.name"
            v-for="info in materialList"
            :key="info.src"
            placement="top"
          >
            <div class="tmpl-img-box">
              <Image
                lazy
                :src="info.src"
                fit="contain"
                height="100%"
                :alt="info.name"
                @click="beforeClearTip(info.json)"
              />
            </div>
          </Tooltip>
        </div>
        <Spin size="large" fix :show="loading"></Spin>

        <Divider plain v-if="isDownBottm()">已经到底了</Divider>
      </Scroll>
    </div>
  </div>
</template>

<script setup name="ImportTmpl">
import useSelect from '@/hooks/select';
import { Spin, Modal } from 'view-ui-plus';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
const router = useRouter();
const { t } = useI18n();
const { canvasEditor } = useSelect();

// 素材类型
const materialType = ref('');
materialType.value = '';
// 素材类型列表
const materialTypeList = ref([]);
// 素材列表
const materialList = ref([]);
// 搜索关键字
const searchKeyword = ref('');
// 面板加载
const loading = ref(false);

// 分页信息
const page = ref(1);
const pagination = reactive({
  page: 0,
  pageCount: 0,
  pageSize: 10,
  total: 0,
});

const getSearchTypeText = () => {
  const info = materialTypeList.value.find((item) => item.value === materialType.value);
  const type = info?.label || '全部';
  return type;
};

const isDownBottm = () => {
  return pagination.page === page.value && pagination.page >= pagination.pageCount;
};
// 获取素材分类
canvasEditor.getTemplTypeList().then((list) => {
  materialTypeList.value = list;
});

// 获取素材列表
const getMaterialList = () => {
  loading.value = true;
  canvasEditor.getTemplList(materialType.value, page.value, searchKeyword.value).then((res) => {
    const { list, pagination: resPagination } = res;
    Object.keys(resPagination).forEach((key) => {
      pagination[key] = resPagination[key];
    });
    materialList.value = [...materialList.value, ...list];
    loading.value = false;
  });
};

const startGetMaterialList = () => {
  materialList.value = [];
  page.value = 1;
  getMaterialList();
};

const handleReachBottom = () => {
  if (page.value >= pagination.pageCount) return;
  page.value++;
  setTimeout(() => {
    getMaterialList();
  }, 1000);
};

// 替换提示
const beforeClearTip = (json) => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>${t('replaceTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => getTempData(json),
  });
};

const showScroll = ref(false);
const scrollHeight = ref(0);
onMounted(() => {
  const myTemplBox = document.querySelector('#myTemplBox');
  scrollHeight.value = myTemplBox.offsetHeight - 10;
  showScroll.value = true;
  getMaterialList();
});

// 获取模板数据
const getTempData = (json) => {
  Spin.show({
    render: (h) => h('div', t('alert.loading_data')),
  });
  router.replace('/');
  canvasEditor.loadJSON(JSON.stringify(json), Spin.hide);
};
</script>

<style scoped lang="less">
.search-box {
  padding-top: 10px;
  padding-bottom: 10px;
  display: flex;
  .input {
    margin-left: 10px;
  }
  .select {
    width: 100px;
  }
}

.img-group {
  background: #eeeeeea1;
  border-radius: 10px;
  padding: 10px;
}
.tmpl-img-box {
  width: 140px;
  height: 180px;
  padding: 5px;
  cursor: pointer;
  border-radius: 10px;

  &:hover {
    background: #e3e3e3;
  }
}
</style>
