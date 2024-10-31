<template>
  <div v-if="$props.show" :class="`left-bar ${$props.toolsBarShow && 'show-tools-bar'}`">
    <!-- 左侧菜单 -->
    <Menu :active-name="menuActive" accordion @on-select="showToolsBar" width="65px">
      <MenuItem v-for="item in leftBar" :key="item.key" :name="item.key" class="menu-item">
        <Icon :type="item.icon" size="24" />
        <div>{{ item.name }}</div>
      </MenuItem>
    </Menu>
    <!-- 左侧组件 -->
    <div class="content" v-show="$props.toolsBarShow">
      <div class="left-panel">
        <KeepAlive>
          <component :is="leftBarComponent[menuActive]"></component>
        </KeepAlive>
      </div>
    </div>
    <!-- 关闭按钮 -->
    <div
      :class="`close-btn left-btn ${$props.toolsBarShow && 'left-btn-open'}`"
      @click="emits('hideToolsBar')"
    ></div>
  </div>
</template>

<script setup lang="ts" name="HomeLeft">
import { reactive } from 'vue';
import { useI18n } from 'vue-i18n';
import importTmpl from '@/components/importTmpl.vue';
import tools from '@/components/tools.vue';
import material from '@/components/material.vue';
import fontStyle from '@/components/fontStyle.vue';
import layer from '@/components/layer.vue';
import myMaterial from '@/components/myMaterial/index.vue';

const { t } = useI18n();

defineProps<{
  show: boolean;
  toolsBarShow: boolean;
}>();

const leftBarComponent = {
  importTmpl,
  tools,
  material,
  fontStyle,
  layer,
  myMaterial,
} as const;

export type LeftBarComponent = keyof typeof leftBarComponent;

const menuActive = defineModel<LeftBarComponent>('menuActive', {
  required: true,
  default: 'importTmpl',
});

// fix: 修复vue-i18n function "t" not reactive inside ref object
// https://github.com/intlify/vue-i18n/issues/1396#issuecomment-1716123143
const leftBar = reactive([
  {
    key: 'importTmpl',
    name: computed(() => t('templates')),
    icon: 'md-book',
  },
  {
    key: 'tools',
    name: computed(() => t('elements')),
    icon: 'md-images',
  },
  {
    key: 'fontStyle',
    name: computed(() => t('font_style')),
    icon: 'ios-pulse',
  },
  {
    key: 'material',
    name: computed(() => t('material.cartoon')),
    icon: 'ios-leaf-outline',
  },
  {
    key: 'layer',
    name: computed(() => t('layers')),
    icon: 'md-reorder',
  },
  {
    key: 'myMaterial',
    name: computed(() => t('mine')),
    icon: 'ios-contact-outline',
  },
]);

const emits = defineEmits<{
  (e: 'hideToolsBar'): void;
  (e: 'showToolsBar'): void;
}>();

const showToolsBar = (val: LeftBarComponent) => {
  menuActive.value = val;
  emits('showToolsBar');
};
</script>

<style lang="less" scoped>
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

.content {
  flex: 1;
  width: 220px;
  padding: 0 10px;
  height: 100%;
  overflow-y: auto;
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
</style>
