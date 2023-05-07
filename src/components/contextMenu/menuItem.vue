<!--
 * @Description:
 * @version:
 * @Author: June
 * @Date: 2023-02-10 17:19:31
 * @LastEditors: June
 * @LastEditTime: 2023-02-10 19:00:12
-->
<template>
  <li
    v-show="show"
    class="menu-item"
    :class="{ del: nodeInfo.type === 'delete' }"
    :data-active="nodeInfo.activeName"
  >
    {{ nodeInfo.text }}
    <template v-if="nodeInfo.children && nodeInfo.children.length">
      <span class="icon"></span>
      <ul class="menu-wrap">
        <menu-item
          class="childMenu"
          v-for="child in nodeInfo.children"
          :key="child.activeName"
          :nodeInfo="child"
        />
      </ul>
    </template>
    <template v-else>
      <span :data-active="nodeInfo.activeName">{{ nodeInfo.subText }}</span>
    </template>
  </li>
</template>

<script>
import select from '@/mixins/select';

export default {
  name: 'menuItem',
  mixins: [select],
  props: {
    nodeInfo: {
      type: Object,
      requred: true,
    },
  },

  computed: {
    show() {
      const { nodeInfo } = this;
      let bol = false;
      if (nodeInfo.type === 'group') {
        bol = this.mSelectMode === 'multiple';
      } else if (nodeInfo.type && nodeInfo === 'sort') {
        bol = this.mSelectMode === 'one';
      } else {
        bol = true;
      }
      return bol;
    },
  },
};
</script>

<style lang="less" scoped>
.menu-item {
  position: relative;
  width: 196px;
  color: #33383e;
  cursor: pointer;
  padding: 6px 10px;

  span {
    float: right;
    color: #bdbdbd;
  }

  .icon {
    width: 0;
    height: 0;
    margin-top: 6px;
    border: 6px solid;
    border-color: transparent transparent transparent #333;
  }

  border-bottom: 1px solid #e8eaec;

  &:hover {
    background-color: #f1f3f4;
  }

  &:last-child {
    border-bottom: none;
  }

  .menu-wrap {
    position: absolute;
    right: -196px;
    top: 0;
    display: none;
    width: 196px;
    padding: 8px 0;
    border: 1px solid #e8eaec;
    border-radius: 4px;
    box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.08);
    background: #fff;
  }

  &:hover .menu-wrap {
    display: block;
  }
}

.del {
  color: red;
}
</style>
