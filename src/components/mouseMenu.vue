<template>
    <ul
        ref="mouseMenuRef"
        class="menu-wrap" 
        :style="{ 
            visibility: show,
            left: left,
            top: top,
            zIndex: zIndex
        }"
        @click="handleMenu"    
    >
            <li data-active='copy'>复制</li>
            <li data-active='delete'>删除</li>
    </ul>
</template>

<script>
import { isEmpty, cloneDeep } from 'lodash-es'
import { v4 as uuid } from 'uuid'
import { Message } from 'view-design'

export default({
    name: 'mouseMenu',
    inject: ['canvas'],
    data() {
        return {
            show: 'hidden',
            left: 0,
            top: 0,
            zIndex: -100,
            menu: null
        }
    },

    mounted() {
        this.$nextTick(() => {
            this.menu = this.$refs.mouseMenuRef
            this.menu && (this.menu.oncontextmenu = function(e) {
                e.preventDefault()
            })
            this.init()
        });
    },

    methods: {
        init() {
            if(!isEmpty(this.canvas) && !isEmpty(this.canvas.c)) {
                this.canvas.c.on('mouse:down', this.handleMouseUp);
            } else {
                this.hideMenu()
            }
        },

        handleMouseUp(opt) {
            try {
                if (opt.button === 3 && opt.target) {
                    // 显示菜单，设置右键菜单位置
                    // 获取菜单组件的宽高
                    const menuWidth = this.menu.offsetWidth
                    const menuHeight = this.menu.offsetHeight
                    // 当前鼠标位置
                    let pointX = opt.pointer.x
                    let pointY = opt.pointer.y
                   
                    // 计算菜单出现的位置
                    // 如果鼠标靠近画布右侧，菜单就出现在鼠标指针左侧
                    if (canvas.width - pointX <= menuWidth) { 
                        pointX -= menuWidth
                    }
                    // 如果鼠标靠近画布底部，菜单就出现在鼠标指针上方
                    if (canvas.height - pointY <= menuHeight) {
                        pointY -= menuHeight
                    }
                    this.showMenu(pointX, pointY)
                    
                } else {
                    this.hideMenu()
                }
            } catch (error) {
                console.log(error)
            }
        },

        showMenu(x, y) {
            this.show = 'visible'
            this.left = `${x}px`
            this.top = `${y}px`
            this.zIndex = 100
        },

        hideMenu() {
            this.show = 'hidden'
            this.left = 0
            this.top = 0
            this.zIndex = -100
        },

        handleMenu(e) {
            const active = e.target.dataset.active || e.srcElement.dataset.active
            if(!active) return this.hideMenu()
            const canvas = this.canvas.c
            const activeObject = canvas.getActiveObjects();
            switch (active) {
                case 'copy':
                    let copyEl = null
                    if(activeObject.length === 0) return
                    copyEl = cloneDeep(activeObject[0])
                    if(copyEl.left === activeObject[0].left) {
                        copyEl.left += 10
                        copyEl.top += 10
                    }
                    copyEl.id = uuid()
                    copyEl.left += 10
                    copyEl.top += 10
                    canvas.add(copyEl)
                    canvas.setActiveObject(copyEl)
                    break;
                case 'delete':
                    activeObject && activeObject.map(item => canvas.remove(item))
                    canvas.requestRenderAll()
                    canvas.discardActiveObject()
                    break;
                default:
                    break;
            } 
            this.hideMenu()
        }
    }
})
</script>


<style lang='less' scoped>
.menu-wrap {
    position: absolute;
    left: 0;
    top: 0;
    padding: 6px 10px;
    border: 1px solid #ccc;
    visibility: hidden; /* 隐藏菜单 */
    z-index: -100;
    background: #fff;
    & > li {
        cursor: pointer;
    }
}
</style>