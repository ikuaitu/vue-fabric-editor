<!--
 * @Author: 秦少卫
 * @Date: 2022-09-03 19:16:55
 * @LastEditors: hudenghui
 * @LastEditTime: 2023-02-24 19:01:21
 * @Description: 回退重做
-->

<template>
  <ButtonGroup size="small">
    <!-- 后退 -->
    <Button @click="undo" :disabled="!(list.length - 1 > 0)">
      <Icon type="ios-undo" />
      {{ list.length - 1 < 0 ? 0 : list.length - 1 }}
    </Button>
    <!-- 重做 -->
    <Button @click="redo" :disabled="!redoList.length">
      <Icon type="ios-redo" />
      {{ redoList.length }}
    </Button>
  </ButtonGroup>
</template>

<script>
import select from '@/mixins/select';
import { keyNames, hotkeys } from '@/core/initHotKeys';

const maxStep = 10;

export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
      redoList: [],
      list: [],
      isInit: true,
      prevObjsNum: this.canvas.c.getObjects().length,
      isOperate: false,
    };
  },
  created() {
    // 有更新时记录进度
    this.canvas.c.on({
      'object:modified': this.save,
      'selection:updated': this.save,
      'after:render': this.objsNumChange,
    });
    hotkeys(keyNames.ctrlz, this.undo);
  },

  methods: {
    // 画布上元素数量变化记录
    objsNumChange() {
      const currObjsNum = this.canvas.c.getObjects().length;
      if (
        (!this.isOperate &&
          this.prevObjsNum !== 0 &&
          currObjsNum !== 0 &&
          currObjsNum !== this.prevObjsNum) ||
        (this.isInit && currObjsNum === 1) // 保存初始化状态，虚拟画布完成后
      ) {
        this.isInit = false;
        const data = this.canvas.editor.getJson();
        if (this.list.length > maxStep) {
          this.list.shift();
        }
        this.list.push(data);
      }
      this.isOperate = false;
      this.prevObjsNum = currObjsNum;
    },
    // 保存记录
    save(event) {
      // 过滤选择元素事件
      const isSelect = event.action === undefined && event.e;
      if (isSelect) return;
      const data = this.canvas.editor.getJson();
      if (this.list.length > maxStep) {
        this.list.shift();
      }
      this.list.push(data);
    },
    // 后退
    undo() {
      if (this.list.length - 1) {
        this.isOperate = true;
        const item = this.list.pop();
        if (this.redoList.length > maxStep) {
          this.redoList.shift();
        }
        this.redoList.push(item);
        this.renderCanvas(this.list[this.list.length - 1]);
      }
    },
    // 重做
    redo() {
      if (this.redoList.length) {
        this.isOperate = true;
        const item = this.redoList.pop();
        if (this.list.length > maxStep) {
          this.list.shift();
        }
        this.list.push(item);
        this.renderCanvas(item);
      }
    },
    // 根据数据渲染
    renderCanvas(data) {
      this.canvas.c.clear();
      this.canvas.c.loadFromJSON(data, this.canvas.c.renderAll.bind(this.canvas.c));
      this.canvas.c.requestRenderAll();
    },
  },
};
</script>

<style scoped lang="less">
span.active {
  svg.icon {
    fill: #2d8cf0;
  }
}
</style>
