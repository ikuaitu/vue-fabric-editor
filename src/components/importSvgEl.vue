<!--
 * @Author: 秦少卫
 * @Date: 2024-05-17 15:31:24
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-17 15:31:25
 * @Description: file content
-->
<!--
 * @Author: 秦少卫
 * @Date: 2023-08-05 17:47:35
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-17 15:16:59
 * @Description: file content
-->

<template>
  <div>
    <!-- 搜索组件 -->
    <div class="search-box">
      <Select class="select" v-model="typeValue" @on-change="startGetList" :disabled="pageLoading">
        <Option v-for="item in typeList" :value="item.value" :key="item.value">
          {{ item.label }}
        </Option>
      </Select>
      <Input
        class="input"
        :placeholder="`在${typeText}中搜索`"
        v-model="searchKeyWord"
        search
        :disabled="pageLoading"
        @on-search="startGetList"
      />
    </div>
    <!-- 列表 -->
    <div style="height: calc(100vh - 108px)" id="myTemplBox1">
      <Scroll
        key="mysscroll2"
        v-if="showScroll"
        :on-reach-bottom="nextPage"
        :height="scrollHeight"
        :distance-to-edge="[-1, -1]"
      >
        <!-- 列表 -->
        <div class="img-group">
          <Tooltip :content="info.name" v-for="info in pageData" :key="info.src" placement="top">
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
        <Spin size="large" fix :show="pageLoading"></Spin>

        <Divider plain v-if="isDownBottm">已经到底了</Divider>
      </Scroll>
    </div>
  </div>
</template>

<script setup name="ImportSvg">
import useSelect from '@/hooks/select';
import useCalculate from '@/hooks/useCalculate';
import usePageList from '@/hooks/pageList';
import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';
import { useRoute } from 'vue-router';
import { Utils } from '@kuaitu/core';

const {
  startPage,
  typeValue,
  typeText,
  typeList,
  pageLoading,
  pageData,
  searchKeyWord,
  isDownBottm,
  startGetList,
  nextPage,
  showScroll,
  scrollHeight,
} = usePageList({
  typeUrl: 'material-types',
  listUrl: 'materials',
  searchTypeKey: 'material_type',
  searchWordKey: 'name',
  pageSize: 50,
  scrollElement: '#myTemplBox1',
});

const { canvasEditor } = useSelect();

const { isOutsideCanvas } = useCalculate();

// 按照类型渲染
const dragItem = (e) => {
  if (isOutsideCanvas(e.clientX, e.clientY)) return;
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

onMounted(async () => {
  // 默认添加图片
  const route = useRoute();
  if (route?.query?.loadFile) {
    const url = route.query.loadFile;
    const image = await Utils.insertImgFile(url);
    addItem({ target: image });
  }

  startPage();
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
