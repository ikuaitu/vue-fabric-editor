<!--
 * @Author: AliceLanniste
 * @Date: 2024-07-09

 * @Description: 瀑布流
-->

<template>
  <div class="masonry-container">
    <div class="masonry-list">
      <div class="masonry-item"></div>
    </div>
  </div>
</template>

<script name="masonry" setup></script>
<style scoped lang="less">
.masonry {
  &-container {
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    overflow-x: hidden;
  }

  &-list {
    position: relative;
    width: 100%;
  }

  &-item {
    position: absolute;
    top: 0;
    left: 0;
    box-sizing: border-box;
  }
}
</style>
