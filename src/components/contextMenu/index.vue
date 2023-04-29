<template>
  <ul
    ref="mouseMenuRef"
    class="menu-wrap"
    :style="{
      visibility: show,
      left,
      top,
      zIndex,
    }"
    @click="handleMenu"
  >
    <menu-item v-for="menu in menuList" :key="menu.activeName" :nodeInfo="menu" />
  </ul>
</template>

<script>
import { isEmpty, debounce } from 'lodash-es';
import select from '@/mixins/select';
import menuItem from './menuItem.vue';

const canvasDom = document.getElementById('canvas') || null;
export default {
  name: 'mouseMenu',
  inject: ['canvas', 'fabric'],
  mixins: [select],
  data() {
    return {
      show: 'hidden',
      left: 0,
      top: 0,
      zIndex: -100,
      menu: null,
      menuList: [
        // 菜单
        {
          type: 'copy',
          activeName: 'copy',
          text: this.$t('mouseMenu.copy'),
          subText: 'Copy',
        },
        {
          type: 'group',
          activeName: 'group',
          text: this.$t('mouseMenu.group'),
          subText: 'Group',
        },
        // 对齐
        {
          type: 'center',
          activeName: 'center',
          text: this.$t('mouseMenu.center'),
          subText: 'Center',
        },
        // 排序
        {
          type: 'sort',
          activeName: '',
          text: this.$t('mouseMenu.layer'),
          subText: '',
          children: [
            {
              type: 'sort',
              activeName: 'up',
              text: this.$t('mouseMenu.up'),
              subText: 'Up',
            },
            {
              type: 'sort',
              activeName: 'down',
              text: this.$t('mouseMenu.down'),
              subText: 'Down',
            },
            {
              type: 'sort',
              activeName: 'upTop',
              text: this.$t('mouseMenu.upTop'),
              subText: 'BringToFront',
            },
            {
              type: 'sort',
              activeName: 'downTop',
              text: this.$t('mouseMenu.downTop'),
              subText: 'SendToBack',
            },
          ],
        },
        // 删除
        {
          type: 'delete',
          activeName: 'delete',
          text: this.$t('mouseMenu.delete'),
          subText: 'Delete',
        },
      ],
    };
  },
  components: {
    menuItem,
  },
  computed: {
    // 单选且等于组元素
    isGroup() {
      return this.mSelectMode === 'one' && this.mSelectOneType === 'group';
    },
    // 是否为多选
    isMultiple() {
      return this.mSelectMode === 'multiple';
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.menu = this.$refs.mouseMenuRef;
      this.menu && (this.menu.oncontextmenu = (e) => e.preventDefault());
      this.init();
    });
    // 监听点击 隐藏(右键点击外部和fabric右键有冲突，因为点击非canvas只有点击左键才可以隐藏)
    window.addEventListener('click', debounce(this.clickHide, 200));
  },

  beforeMount() {
    window.removeEventListener('click', this.clickHide);
  },

  methods: {
    init() {
      if (!isEmpty(this.canvas) && !isEmpty(this.canvas.c)) {
        this.canvas.c.on('mouse:down', this.handleMouseUp);
      } else {
        this.hideMenu();
      }
    },

    handleMouseUp(opt) {
      try {
        const canvas = this.canvas.c;
        const activeObject = canvas.getActiveObjects();
        if (!activeObject.length) return this.hideMenu();
        if (opt.button === 3 && opt.target && opt.target.id !== 'workspace') {
          // 显示菜单，设置右键菜单位置
          // 获取菜单组件的宽高
          const menuWidth = this.menu.offsetWidth;
          const menuHeight = this.menu.offsetHeight;
          // 当前鼠标位置
          let pointX = opt.pointer.x;
          let pointY = opt.pointer.y;

          // 计算菜单出现的位置
          // 如果鼠标靠近画布右侧，菜单就出现在鼠标指针左侧
          if (canvas.width - pointX <= menuWidth) {
            pointX -= menuWidth;
          }
          // 如果鼠标靠近画布底部，菜单就出现在鼠标指针上方
          if (canvas.height - pointY <= menuHeight) {
            pointY -= menuHeight;
          }
          this.showMenu(pointX, pointY);
        } else {
          this.hideMenu();
        }
      } catch (error) {
        console.log(error);
      }
    },

    showMenu(x, y) {
      this.show = 'visible';
      this.left = `${x}px`;
      this.top = `${y}px`;
      this.zIndex = 100;
    },

    hideMenu() {
      this.show = 'hidden';
      this.left = 0;
      this.top = 0;
      this.zIndex = -100;
    },

    clickHide(e) {
      if (e.target !== canvasDom && this.show === 'visible') {
        this.hideMenu();
      }
    },
    handleMenu(e) {
      const active = e.target.dataset.active || e.srcElement.dataset.active;
      if (!active) return this.hideMenu();
      const canvas = this.canvas.c;
      const activeObject = canvas.getActiveObjects();
      switch (active) {
        case 'copy':
          this.canvas.editor.clone();
          break;
        case 'delete':
          activeObject && activeObject.map((item) => canvas.remove(item));
          canvas.requestRenderAll();
          canvas.discardActiveObject();
          break;
        case 'center':
          this.canvas.editor.centerAlign.position('center');
          break;
        case 'group':
          this.canvas.editor.group();
          break;
        case 'unGroup':
          this.canvas.editor.unGroup();
          break;
        case 'up':
          this.canvas.editor.up();
          break;
        case 'down':
          this.canvas.editor.down();
          break;
        case 'upTop':
          this.canvas.editor.upTop();
          break;
        case 'downTop':
          this.canvas.editor.downTop();
          break;
        default:
          break;
      }
      this.hideMenu();
    },
  },
};
</script>

<style lang="less" scoped>
.menu-wrap {
  width: 196px;
  padding: 8px 0;
  position: absolute;
  border: 1px solid #e8eaec;
  left: 0;
  top: 0;
  border-radius: 4px;
  visibility: hidden;
  list-style: none;
  /* 隐藏菜单 */
  z-index: -100;
  box-shadow: 0 8px 8px 0 rgba(0, 0, 0, 0.08);
  background: #fff;

  & > li {
    color: #33383e;
    cursor: pointer;
    padding: 6px 10px;

    span {
      float: right;
      color: #bdbdbd;
    }

    border-bottom: 1px solid #e8eaec;

    &:hover {
      background-color: #f1f3f4;
    }

    &:last-child {
      border-bottom: none;
    }
  }

  .del {
    color: red;
  }
}
</style>
