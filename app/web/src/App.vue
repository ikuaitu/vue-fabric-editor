<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
ul,
li {
  list-style: none;
}
svg {
  vertical-align: middle;
}
.vue-waterfall-easy-scroll {
  overflow: inherit !important;
}
*::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
*::-webkit-scrollbar-thumb {
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
}
*::-webkit-scrollbar-track {
  border-radius: 0;
  background: rgba(0, 0, 0, 0.1);
}
</style>
