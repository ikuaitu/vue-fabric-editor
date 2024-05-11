<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-11 15:36:50
 * @Description: 导入模板
-->

<template>
  <div>
    <!-- 搜索组件 -->
    <div class="search-box">
      <Input
        class="input"
        placeholder="请输入关键词"
        v-model="searchKeyword"
        search
        :disabled="loading"
        @on-search="startGetMaterialList"
      />
    </div>

    <!-- 列表 -->
    <div style="height: calc(100vh - 180px)" id="myFileTemplBox">
      <Scroll
        key="myFileTemplBox"
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
              <Icon type="ios-trash" class="del-btn" color="red" @click="removeTempl(info.id)" />
              <Image
                lazy
                :src="info.src"
                fit="contain"
                height="100%"
                :alt="info.name"
                @click="beforeClearTip(info.json, info.id)"
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
import qs from 'qs';
import useSelect from '@/hooks/select';
import { Message } from 'view-ui-plus';
import { Spin, Modal } from 'view-ui-plus';
import { useI18n } from 'vue-i18n';
import { getTmplList } from '@/api/user';
import useMaterial from '@/hooks/useMaterial';
const { routerToId, removeTemplInfo } = useMaterial();

const APIHOST = import.meta.env.APP_APIHOST;

const { t } = useI18n();
const { canvasEditor } = useSelect();

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

const isDownBottm = () => {
  return pagination.page === page.value && pagination.page >= pagination.pageCount;
};

// 获取素材列表
const getMaterialList = () => {
  loading.value = true;
  getTmplListHandler(page.value, searchKeyword.value).then((res) => {
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
const beforeClearTip = (json, id) => {
  Modal.confirm({
    title: t('tip'),
    content: `<p>${t('replaceTip')}</p>`,
    okText: t('ok'),
    cancelText: t('cancel'),
    onOk: () => getTempData(json, id),
  });
};

const showScroll = ref(false);
const scrollHeight = ref(0);
onMounted(() => {
  const myTemplBox = document.querySelector('#myFileTemplBox');
  scrollHeight.value = myTemplBox.offsetHeight - 10;
  showScroll.value = true;
  getMaterialList();
});

// 获取模板数据
const getTempData = (json, id) => {
  Spin.show({
    render: (h) => h('div', t('alert.loading_data')),
  });
  // console.log(json, 111);
  routerToId(id);
  canvasEditor.loadJSON(JSON.stringify(json), Spin.hide);
};

const getTmplListHandler = (index, searchKeyword) => {
  const query = {
    populate: {
      img: '*',
    },
    filters: {},
    pagination: {
      page: index,
      pageSize: 50,
    },
  };
  const queryParams = getQueryParams(query, [
    {
      key: 'name',
      value: searchKeyword,
      type: '$contains',
    },
  ]);
  return getTmplList(queryParams)
    .then((res) => {
      const list = res.data.data.map((item) => {
        return {
          id: item.id,
          name: item.attributes.name,
          desc: item.attributes.desc,
          json: item.attributes.json,
          src: getMaterialInfoUrl(item.attributes.img),
          previewSrc: getMaterialPreviewUrl(item.attributes.img),
        };
      });
      return { list, pagination: res?.data?.meta?.pagination };
    })
    .catch((err) => {
      return err;
    });
};

const getQueryParams = (option, filters) => {
  filters.forEach((item) => {
    const { key, value, type } = item;
    if (value) {
      option.filters[key] = { [type]: value };
    }
  });
  return qs.stringify(option);
};

const getMaterialInfoUrl = (info) => {
  const imgUrl = info?.data?.attributes?.url || '';
  return APIHOST + imgUrl;
};

const getMaterialPreviewUrl = (info) => {
  const imgUrl = info?.data?.attributes?.formats?.medium?.url || info?.data?.attributes?.url || '';
  return APIHOST + imgUrl;
};

const removeTempl = (id) => {
  removeTemplInfo(id).then(() => {
    Message.success('删除成功');
    startGetMaterialList();
  });
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
  position: relative;

  &:hover {
    background: #e3e3e3;
    .del-btn {
      right: 5px;
    }
  }
}

.del-btn {
  z-index: 1;
  position: absolute;
  top: 5px;
  right: 1000000px;
}
</style>
