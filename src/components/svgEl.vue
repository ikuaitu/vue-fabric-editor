<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-16 12:42:36
 * @Description: 素材面板
-->

<template>
  <div>
    <Divider plain orientation="left">{{ $t('cartoon') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(460, 489)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('fruits') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(386, 409)"
        @click="addItem"
        ::draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('sports') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(410, 459)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('seasons') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(40, 49)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('eletronics') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(50, 75)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('fruits') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(76, 89)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('clothes') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(89, 136)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('flags') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(137, 151)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('threes') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(152, 181)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('food') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(182, 201)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('clothes') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(202, 222)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('medals') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(223, 252)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('business') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(253, 261)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('activity') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(262, 270)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('fruits') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(271, 300)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('vintage') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(301, 350)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
    <Divider plain orientation="left">{{ $t('cartoon') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(351, 385)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>

    <Divider plain orientation="left">{{ $t('animals') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(490, 519)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>

    <Divider plain orientation="left">{{ $t('hand_painted') }}</Divider>
    <div class="box">
      <img
        v-lazy="`${repoSrc}svg/${item}.svg`"
        alt=""
        :key="item"
        v-for="item in getIndex(0, 39)"
        @click="addItem"
        :draggable="true"
        @dragend="dragItem"
      />
    </div>
  </div>
</template>

<script name="SvgEl" setup>
import { v4 as uuid } from 'uuid';
import useSelect from '@/hooks/select';

const defaultPosition = {
  left: 100,
  top: 100,
  shadow: '',
  fontFamily: '1-1',
};
const repoSrc = import.meta.env.APP_REPO;
const { fabric, canvasEditor } = useSelect();

const getIndex = (start, end) => {
  const arr = Array(end - (start - 1)).fill('');
  return arr.map((item, i) => i + start);
};

const dragItem = (event) => {
  const url = event.target.src;
  // 会有性能开销 dragAddItem复用更简洁
  fabric.loadSVGFromURL(url, (objects) => {
    const item = fabric.util.groupSVGElements(objects, {
      shadow: '',
      fontFamily: 'arial',
      id: uuid(),
      name: 'svg元素',
    });
    canvasEditor.dragAddItem(event, item);
  });
};

// 按照类型渲染
const addItem = (e) => {
  const url = e.target.src;
  fabric.loadSVGFromURL(url, (objects, options) => {
    const item = fabric.util.groupSVGElements(objects, {
      ...options,
      ...defaultPosition,
      id: uuid(),
      name: 'svg元素',
    });
    canvasEditor.canvas.add(item);
    canvasEditor.canvas.setActiveObject(item);
    canvasEditor.canvas.requestRenderAll();
  });
};
</script>

<style scoped lang="less">
img {
  display: inline-block;
  width: 53px;
  margin-left: 2px;
  margin-bottom: 2px;
  background: #f5f5f5;
  padding: 6px;
  cursor: pointer;
}
</style>
