/*
 * @Author: 秦少卫
 * @Date: 2024-05-29 15:39:20
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-09 16:52:59
 * @Description: 通用分页
 */

import qs from 'qs';
import { ref } from 'vue';

const APIHOST = import.meta.env.APP_APIHOST;
export default function usePageList({
  el,
  apiClient,
  filters = {},
  sort = [],
  formatData,
  fields = [],
}) {
  //  滚动条根据页面适应
  const showScroll = ref(false);
  const scrollHeight = ref(0);
  const startPage = async () => {
    // 滚动
    const myTemplBox = document.querySelector(el);
    scrollHeight.value = myTemplBox.offsetHeight;
    showScroll.value = true;

    await startGetList();
  };

  // 素材列表
  const pageData = ref([]);
  const page = ref(1);
  const pagination = reactive({
    page: 0,
    pageCount: 0,
    pageSize: 10,
    total: 0,
  });

  // 是否到达底部
  const isDownBottom = computed(() => {
    return pagination.page === page.value && pagination.page >= pagination.pageCount;
  });

  const pageLoading = ref(false);
  const getPageData = async () => {
    pageLoading.value = true;
    try {
      const query = {
        populate: {
          img: '*',
        },
        filters: {},
        sort: sort,
        fields,
        pagination: {
          page: page.value,
          pageSize: page.value.pageSize,
        },
      };
      const params = addFilterParams(query, filters);
      const res = await apiClient(qs.stringify(params));
      const list = formatData ? formatData(res.data.data) : res.data.data;
      Object.keys(res.data.meta.pagination).forEach((key) => {
        pagination[key] = res.data.meta.pagination[key];
      });
      pageData.value = [...pageData.value, ...list];
    } catch (error) {
      console.log(error);
    }
    // Spin.hide();
    pageLoading.value = false;
  };

  const startGetList = () => {
    pageData.value = [];
    page.value = 1;
    getPageData();
  };

  const nextPage = () => {
    if (page.value >= pagination.pageCount) return;
    page.value++;
    setTimeout(() => {
      getPageData();
    }, 1000);
  };

  const addFilterParams = (query, filters) => {
    Object.keys(filters).forEach((key) => {
      const itemFilter = {};
      Object.keys(filters[key]).forEach((myKey) => {
        const skip = ['$eq', '$contains'];
        const isNone = !filters[key][myKey];
        const isSkip = skip.includes(myKey) && isNone;
        // 不好包含跳过条件
        if (!isSkip) {
          itemFilter[myKey] = filters[key][myKey];
        } else {
          // 跳过条件下 判断是否过滤 默认过滤
          const isFilterEmpty = filters[key].filterEmpty;
          if (!isFilterEmpty) {
            itemFilter[myKey] = filters[key][myKey];
          }
        }
      });
      query.filters[key] = itemFilter;
    });
    return query;
  };

  return {
    pageData, // 分页数据
    showScroll,
    scrollHeight,
    pageLoading,
    isDownBottom, // 是否到达底部
    startPage, // 开始分页
    getPageData, // 获取分页数据
    startGetList, // 从第一个开始
    nextPage, // 下一页
  };
}

const getMaterialInfoUrl = (info) => {
  const imgUrl = info?.data?.attributes?.url || '';
  return APIHOST + imgUrl;
};

const getMaterialPreviewUrl = (info) => {
  const imgUrl = info?.data?.attributes?.formats?.small?.url || info?.data?.attributes?.url || '';
  return APIHOST + imgUrl;
};

export { getMaterialInfoUrl, getMaterialPreviewUrl };
