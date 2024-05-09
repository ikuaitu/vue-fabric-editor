<!--
 * @Author: 秦少卫
 * @Date: 2023-08-05 17:47:35
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-09 15:05:49
 * @Description: file content
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
                @click="addItem"
                @dragend="dragItem"
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

<script setup name="ImportSvg">
import useSelect from '@/hooks/select';
import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';
import { useRoute } from 'vue-router';
import { Utils } from '@kuaitu/core';

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
canvasEditor.getMaterialTypeList().then((list) => {
  materialTypeList.value = list;
});

// 获取素材列表
const getMaterialList = () => {
  loading.value = true;
  canvasEditor.getMaterialList(materialType.value, page.value, searchKeyword.value).then((res) => {
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

// // 按照类型渲染
const dragItem = (e) => {
  const target = e.target;
  const imgType = canvasEditor.getImageExtension(target.src);
  if (imgType === 'svg') {
    fabric.loadSVGFromURL(target.src, (objects) => {
      const item = fabric.util.groupSVGElements(objects, {
        shadow: '',
        fontFamily: 'arial',
        id: uuid(),
        name: 'svg元素',
      });
      canvasEditor.dragAddItem(item, e);
    });
  } else {
    fabric.Image.fromURL(
      target.src,
      (imgEl) => {
        imgEl.set({
          left: 100,
          top: 100,
        });
        canvasEditor.dragAddItem(imgEl, e);
      },
      { crossOrigin: 'anonymous' }
    );
  }
};

const addItem = (e) => {
  const target = e.target;
  const imgType = canvasEditor.getImageExtension(target.src);
  if (imgType === 'svg') {
    fabric.loadSVGFromURL(target.src, (objects) => {
      const item = fabric.util.groupSVGElements(objects, {
        shadow: '',
        fontFamily: 'arial',
        id: uuid(),
        name: 'svg元素',
      });
      canvasEditor.dragAddItem(item);
    });
  } else {
    fabric.Image.fromURL(
      target.src,
      (imgEl) => {
        imgEl.set({
          left: 100,
          top: 100,
        });
        canvasEditor.dragAddItem(imgEl);
      },
      { crossOrigin: 'anonymous' }
    );
  }
};

const showScroll = ref(false);
const scrollHeight = ref(0);
onMounted(async () => {
  // 默认添加图片
  const route = useRoute();
  if (route?.query?.loadFile) {
    const url = route.query.loadFile;
    const image = await Utils.insertImgFile(url);
    addItem({ target: image });
  }

  // 滚动
  const myTemplBox = document.querySelector('#myTemplBox');
  scrollHeight.value = myTemplBox.offsetHeight - 10;
  showScroll.value = true;
  getMaterialList();
});
</script>

<style scoped lang="less">
.search-box {
  padding-top: 10px;
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
  width: 67px;
  height: 100px;
  padding: 5px;
  cursor: pointer;
  border-radius: 10px;

  &:hover {
    background: #e3e3e3;
  }
}

.tip-text {
  display: block;
  text-align: center;
}
</style>
