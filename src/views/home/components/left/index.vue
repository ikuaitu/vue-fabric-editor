<script lang="ts" setup>
// 左侧组件
import importTmpl from '@/components/importTmpl.vue';
import fontStyle from '@/components/fontStyle.vue';
import myMaterial from '@/components/myMaterial/index.vue';
import tools from '@/components/tools.vue';
import material from '@/components/material.vue';
import layer from '@/components/layer.vue';
import { useI18n } from 'vue-i18n';
// 路由
import { useRoute } from 'vue-router';

const { t } = useI18n();

const state = reactive({
  menuActive: 1,
  toolsBarShow: true,
});
// 左侧菜单渲染
const menuActive = ref('importTmpl');
const leftBarComponent = {
  importTmpl,
  tools,
  material,
  fontStyle,
  layer,
  myMaterial,
};

// fix: 修复vue-i18n function "t" not reactive inside ref object
// https://github.com/intlify/vue-i18n/issues/1396#issuecomment-1716123143
const leftBar = reactive([
  {
    //模板
    key: 'importTmpl',
    name: computed(() => t('templates')),
    icon: 'md-book',
  },
  {
    //基础元素
    key: 'tools',
    name: computed(() => t('elements')),
    icon: 'md-images',
  },
  {
    //字体样式
    key: 'fontStyle',
    name: computed(() => t('font_style')),
    icon: 'ios-pulse',
  },
  {
    // 图片元素
    key: 'material',
    name: computed(() => t('material.cartoon')),
    icon: 'ios-leaf-outline',
  },
  {
    // 图层
    key: 'layer',
    name: computed(() => t('layers')),
    icon: 'md-reorder',
  },
  {
    // 用户素材
    key: 'myMaterial',
    name: computed(() => t('mine')),
    icon: 'ios-contact-outline',
  },
]);
// 隐藏工具条
const hideToolsBar = () => {
  state.toolsBarShow = !state.toolsBarShow;
};
// 展示工具条
const showToolsBar = (val) => {
  menuActive.value = val;
  state.toolsBarShow = true;
};

onMounted(() => {
  // 有ID时，打开作品面板
  const route = useRoute();
  if (route?.query?.id) {
    menuActive.value = 'myMaterial';
  }
});
</script>

<template>
  <div :class="`left-bar ${state.toolsBarShow && 'show-tools-bar'}`">
    <!-- 左侧菜单 -->
    <Menu :active-name="menuActive" accordion @on-select="showToolsBar" width="65px">
      <MenuItem v-for="item in leftBar" :key="item.key" :name="item.key" class="menu-item">
        <Icon :type="item.icon" size="24" />
        <div>{{ item.name }}</div>
      </MenuItem>
    </Menu>
    <!-- 左侧组件 -->
    <div class="content" v-show="state.toolsBarShow">
      <div class="left-panel">
        <KeepAlive>
          <component :is="leftBarComponent[menuActive]"></component>
        </KeepAlive>
      </div>
    </div>
    <!-- 关闭按钮 -->
    <div
      :class="`close-btn left-btn ${state.toolsBarShow && 'left-btn-open'}`"
      @click="hideToolsBar"
    ></div>
  </div>
</template>

<style lang="less" scoped>
// 左侧容器
.left-bar {
  width: 65px;
  height: 100%;
  background: #fff;
  display: flex;
  position: relative;

  &.show-tools-bar {
    width: 380px;
  }
}
.ivu-menu-vertical .menu-item {
  text-align: center;
  padding: 10px 2px;
  box-sizing: border-box;
  font-size: 12px;

  & > i {
    margin: 0;
  }
}
.ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu) {
  background: none;
}

.content {
  flex: 1;
  width: 220px;
  padding: 0 10px;
  height: 100%;
  overflow-y: auto;
}

// 关闭按钮
.close-btn {
  width: 20px;
  height: 64px;
  cursor: pointer;
  background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAMAAABOb9vcAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAADHx8cODg50dHTx8fF2dnZ1dXWWlpZHR0c4ODhQpkZ5AAAAIXRSTlMA9t+/upkRAnPq5NXDfDEsKQjMeGlRThkMsquljTwzIWhBHpjgAAABJElEQVRYw+3YyW7CQBCEYbxig8ELGJyQkJRJyPb+75dj3zy/lD7kMH3+ZEuzSFO1mlZwhjOE2uwhVHJYMygNVwilhz2EUvNaMigledUFoE1anKYAtA9nVRuANpviOQBt0t2ZQSnZ9QxK6Qih9LSGUHkJobYlhGp6CPW4hlAVhckLhMop1InCjEK1FBYU1hSqo/BI4YXCjMIthTWFijDCCB3g7fuO4O1t/rkvQXPz/LUIzX0oAM0tQHOfCkBzC9DcuwLQXACao9Dv1yb9lsek2xaaxMcMH1x6Ff79dY0wwgj/DGv3p2tG4cX9wd55h4rCO/hk3uEs9w6QlXPIbXrfIJ6XrmVBOtJCA1YkXqVLkh1aUgyNk1fV1BxLxzpsuNLKzrME/AWr0ywwvyj83AAAAABJRU5ErkJggg==);
  background-repeat: no-repeat;
  background-size: cover;
  background-position: 50%;
  position: absolute;
  right: -20px;
  z-index: 1;
  top: 50%;
  margin-top: -10px;

  &.left-btn {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAYAAAB5sSvuAAAAAXNSR0IArs4c6QAAAFBlWElmTU0AKgAAAAgAAgESAAMAAAABAAEAAIdpAAQAAAABAAAAJgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAAKKADAAQAAAABAAAAgAAAAAAobJzlAAABWWlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNi4wLjAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp0aWZmPSJodHRwOi8vbnMuYWRvYmUuY29tL3RpZmYvMS4wLyI+CiAgICAgICAgIDx0aWZmOk9yaWVudGF0aW9uPjE8L3RpZmY6T3JpZW50YXRpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgoZXuEHAAADf0lEQVR4Ae2cvYsTQRjGE7FQkICFB1pZRyzEJkUKmzOpBEHwX9DCQkmChf4JahewsLpWFOQUzwMRPEgEy0PLpPADvEISDrVyfZ6cK0tIZrI7u7MPMi+8mb35uPnlmXczyeXmrURRdKyibAB8Dz8pywg42if4OUnIGd7Bww8Ut+GHpEATgPEll/y8DGRMtaB8hrryl30B2HzVW1Rcgx8vQ9UqaVac+Cf67cC34C+q1erHFcc5dUsDOD/RGBWv4M/hrwG8jzJ3cwFMwlDdd/BN+BZgd5ONLtd5Ac4zfEYFld0ALMMisxUFmAQa44dHdMB+TTasdM2bxJNxI7gDP7ISWNzJE1xymhF+uBzPbyvL2NZOA+oJIO/BrfP7iEGTSNtovIrY/L6sU9mA5PoAby6DtEq87JnlWF/H7+K+v/DmUQDkc23CNxbFpAogIa/Ab/IiaQoxmOThlnkG8TiKK5UUJNNR+MMYjqUaIJnWEYuXeEFTBCTXv1hUi0HCxXYWsbirqiAhb/BBWcE9KLimDEgB68pLTMAL6oBNdcBT6oBr6oAn1O9i2a2Od/DM1Jc4KBivVOYyLHFm6f4ODAoGBV0VcB0fYjAo6KqA6/gQg0FBVwVcx4cYDAq6KuA6/v+Mwel0Wmm325XhcOgqkH08/h6cyiaTSdRoNPhvBFGtVosGg0Gq8Wk7V9IO6Pf7MzgC+oBMDcgn1Ov1vEFmAvQJmRmQkN1ut3AlnQB9QDoDErLT6RSmZC6ARULmBlgUpPxWl5uCRcVhLoBFwTFsnAGLfi10AiwazklBX/txJgV9wWVSUP7tlvwbVspOyFarVfi7ac4Vvquzfyoy95DfiwOgeQHtrUFBu0bmHkFBsz721qCgXSNzj6CgWR97a1DQrpG5R1DQrI+9NSho18jcIyho1sfauqeuoDzgN3UFv6gD7qh/cK8rA84OGygv8VO+CCkrKH3g5Q1P41BB1SV+QDia4hJvQ72LB3h6gPIH/+5CvVGsntoSPwYQzxr/VgRkJoF1wP1KwvFa4SaRPgDNI+RLT2dTwTJfB+9j/jaWden5dgIe5oNnG2O+WwCb7bXWuflliSfLlAjCh4JULHMqjaIAc0tGkhdgnM6FyXI2EV+5pXNxAeTSMSHOSzg3+H2UuVsaQKq0A/eaUmiVb9yZlOk6vJSkTCZA2bRWsonBpFOrySan+wNoJmOM0LyBGwAAAABJRU5ErkJggg==);
  }

  &.left-btn-open {
    background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAACACAMAAABOb9vcAAAAhFBMVEUAAAD///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAADHx8cODg50dHTx8fF2dnZ1dXWWlpZHR0c4ODhQpkZ5AAAAIXRSTlMA9t+/upkRAnPq5NXDfDEsKQjMeGlRThkMsquljTwzIWhBHpjgAAABJElEQVRYw+3YyW7CQBCEYbxig8ELGJyQkJRJyPb+75dj3zy/lD7kMH3+ZEuzSFO1mlZwhjOE2uwhVHJYMygNVwilhz2EUvNaMigledUFoE1anKYAtA9nVRuANpviOQBt0t2ZQSnZ9QxK6Qih9LSGUHkJobYlhGp6CPW4hlAVhckLhMop1InCjEK1FBYU1hSqo/BI4YXCjMIthTWFijDCCB3g7fuO4O1t/rkvQXPz/LUIzX0oAM0tQHOfCkBzC9DcuwLQXACao9Dv1yb9lsek2xaaxMcMH1x6Ff79dY0wwgj/DGv3p2tG4cX9wd55h4rCO/hk3uEs9w6QlXPIbXrfIJ6XrmVBOtJCA1YkXqVLkh1aUgyNk1fV1BxLxzpsuNLKzrME/AWr0ywwvyj83AAAAABJRU5ErkJggg==);
    transform: rotateY(360deg);
  }
}
</style>
