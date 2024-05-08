<!--
 * @Author: 秦少卫
 * @Date: 2023-08-05 17:47:35
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-08 21:09:16
 * @Description: file content
-->

<template>
  <div>
    <div class="search-box">
      <Cascader
        :data="[allType, ...state.materialTypelist]"
        v-model="state.materialType"
        @on-change="handleChange"
      >
        <Button icon="ios-menu"></Button>
      </Cascader>
      <Input
        class="input"
        :placeholder="state.placeholder"
        v-model="state.search"
        search
        @on-change="search"
      />
    </div>

    <div :key="item.value" v-for="item in state.materialist">
      <Divider plain orientation="left">{{ item.label }}</Divider>
      <div class="img-group">
        <Tooltip
          :content="info.label"
          v-for="(info, i) in item.list"
          :key="`${i}-bai1-button`"
          placement="top"
        >
          <div class="tmpl-img-box">
            <Image
              lazy
              :src="info.src"
              fit="contain"
              height="100%"
              :alt="info.label"
              @click="addItem"
              @dragend="dragItem"
            />
          </div>
        </Tooltip>
      </div>
    </div>
  </div>
</template>

<script setup name="ImportSvg" lang="ts">
import useSelect from '@/hooks/select';
import { cloneDeep } from 'lodash-es';
import { fabric } from 'fabric';
import { v4 as uuid } from 'uuid';
import { useRoute } from 'vue-router';
import { Utils } from '@kuaitu/core';

const { canvasEditor }: { canvasEditor: any } = useSelect();

const defaultPosition = {
  left: 100,
  top: 100,
  shadow: '',
  fontFamily: '1-1',
};

interface materialTypeI {
  value: string;
  label: string;
  list?: materialItemI[];
}

interface materialItemI {
  value: string;
  label: string;
  tempUrl: string;
  src: string;
}

const allType: materialTypeI = {
  value: '',
  label: '全部',
};

const state = reactive({
  search: '',
  placeholder: <undefined | string>'',
  jsonFile: <any>null,
  materialType: [''], // 选中分类
  materialTypelist: <materialTypeI[]>[], // 分类列表
  materialist: <materialTypeI[]>[], // 列表内容
});

// 获取素材分类
canvasEditor.getMaterialTypeList().then((list: materialTypeI[]) => {
  state.materialTypelist = [...list];
  state.materialist = list;
});

// 切换素材类型
const handleChange = (e: Event, item: [materialTypeI]) => {
  // 搜索框文字设置
  const { label, value } = item[0];
  state.placeholder = label;
  state.search = '';
  filterTypeList(value);
};

// 模板搜索功能
const filterTypeList = (value: string) => {
  // 全部类型
  if (!value) {
    state.materialist = cloneDeep(state.materialTypelist);
  } else {
    // 当前分类详情
    const materialTypeInfoList =
      state.materialTypelist.filter((item) => item.value === value) || [];
    state.materialist = materialTypeInfoList;
  }

  // 展示分类
  if (state.search) {
    const list = cloneDeep(state.materialist);
    // 按照搜索内容展示
    state.materialist = list.map((item) => {
      if (item.list) {
        item.list = item.list.filter((info) => info.label.includes(state.search));
      }
      return item;
    });
  }
};

const search = () => {
  const [typeValue] = state.materialType;
  filterTypeList(typeValue);
};

const dragItem = (event: Event) => {
  const target = event.target as HTMLImageElement;
  const url = target.src;
  // 会有性能开销 dragAddItem复用更简洁
  fabric.loadSVGFromURL(url, (objects) => {
    const item = fabric.util.groupSVGElements(objects, {
      shadow: '',
      fontFamily: 'arial',
      id: uuid(),
      name: 'svg元素',
    });
    canvasEditor.dragAddItem(item, event);
  });
};

// 按照类型渲染
const addItem = (e: Event) => {
  const target = e.target as HTMLImageElement;
  const imgType = canvasEditor.getImageExtension(target.src);
  if (imgType === 'svg') {
    fabric.loadSVGFromURL(target.src, (objects) => {
      const item = fabric.util.groupSVGElements(objects, {
        ...defaultPosition,
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

// 默认加载图片
onMounted(async () => {
  const route = useRoute();
  if (route?.query?.loadFile) {
    const url = route.query.loadFile as string;
    const image = await Utils.insertImgFile(url);
    addItem({ target: image } as Event);
  }
});
</script>

<style scoped lang="less">
.search-box {
  padding-top: 10px;
  display: flex;
  .input {
    margin-left: 10px;
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
</style>
