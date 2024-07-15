/*
 * @Author: 秦少卫
 * @Date: 2024-05-17 11:00:14
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-09 17:02:23
 * @Description: 分页通用
 */

const repoSrc = import.meta.env.APP_APIHOST;
import axios from 'axios';
import qs from 'qs';

// 分类API
const typeApi = (url) => axios.get(`${repoSrc}/api/${url}?pagination[pageSize]=200`);

// 分页API
const pageApi = (url, queryParams) => axios.get(`${repoSrc}/api/${url}?${queryParams}`);

const getInfo = (id) => axios.get(`${repoSrc}/api/templs/${id}`);

function getQueryParams(option, filters) {
  filters.forEach((item) => {
    const { key, value, type } = item;
    if (value) {
      option.filters[key] = { [type]: value };
    }
  });
  return qs.stringify(option);
}

function getPageParams(
  page,
  typeValue,
  searchKeyWord,
  searchTypeKey,
  searchWordKey,
  pageSize,
  fields
) {
  const query = {
    populate: {
      img: '*',
    },
    filters: {},
    fields,
    pagination: {
      page: page,
      pageSize: pageSize,
    },
  };

  const queryParams = getQueryParams(query, [
    {
      key: searchTypeKey,
      value: typeValue,
      type: '$eq',
    },
    {
      key: searchWordKey,
      value: searchKeyWord,
      type: '$contains',
    },
  ]);
  return queryParams;
}

function getMaterialInfoUrl(info) {
  const imgUrl = info?.data?.attributes?.url || '';
  return repoSrc + imgUrl;
}

function getMaterialPreviewUrl(info) {
  const imgUrl = info?.data?.attributes?.formats?.small?.url || info?.data?.attributes?.url || '';
  return repoSrc + imgUrl;
}

export default function usePageList({
  typeUrl,
  listUrl,
  searchTypeKey,
  searchWordKey,
  scrollElement,
  pageSize,
  fields = [],
}) {
  const pageLoading = ref(false);

  // 关键词
  const searchKeyWord = ref('');
  // 分类
  const typeValue = ref('');
  const typeList = ref([]);
  const typeText = computed(() => {
    const info = typeList.value.find((item) => item.value === typeValue.value);
    return info?.lable || '全部';
  });

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
  const isDownBottm = computed(() => {
    return pagination.page === page.value && pagination.page >= pagination.pageCount;
  });
  // 获取分类列表
  const getTypeList = async () => {
    pageLoading.value = true;
    try {
      const res = await typeApi(typeUrl);
      const list = res.data.data.map((item) => {
        return {
          value: item.id,
          label: item.attributes.name,
        };
      });
      typeList.value = [
        {
          label: '全部',
          value: '',
        },
        ...list,
      ];
    } catch (error) {
      typeList.value = [];
    }
    pageLoading.value = false;
  };

  const getPageData = async () => {
    pageLoading.value = true;
    try {
      const params = getPageParams(
        page.value,
        typeValue.value,
        searchKeyWord.value,
        searchTypeKey,
        searchWordKey,
        pageSize,
        fields
      );
      const res = await pageApi(listUrl, params);
      const list = res.data.data.map((item) => {
        return {
          id: item.id,
          name: item.attributes.name,
          desc: item.attributes.desc,
          json: item.attributes?.json,
          src: getMaterialInfoUrl(item.attributes.img),
          previewSrc: getMaterialPreviewUrl(item.attributes.img),
        };
      });
      Object.keys(res.data.meta.pagination).forEach((key) => {
        pagination[key] = res.data.meta.pagination[key];
      });
      pageData.value = [...pageData.value, ...list];
    } catch (error) {
      console.log(error);
    }
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

  const showScroll = ref(false);
  const scrollHeight = ref(0);
  const startPage = async () => {
    // 滚动
    const myTemplBox = document.querySelector(scrollElement);
    scrollHeight.value = myTemplBox.offsetHeight;
    showScroll.value = true;

    await getTypeList();
    await getPageData();
  };

  return {
    startPage,
    searchKeyWord,
    typeValue,
    typeText,
    typeList,
    pageLoading,
    pageData,
    isDownBottm,
    startGetList,
    nextPage,
    scrollHeight,
    showScroll,
    getInfo,
  };
}
