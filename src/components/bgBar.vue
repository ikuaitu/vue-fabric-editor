<template>
  <div>
    <Divider orientation="left" plain>{{ $t('color') }}</Divider>
    <Form :label-width="40">
      <FormItem :label="$t('color')" prop="name">
        <ColorPicker v-model="color" @on-change="setThisColor" size="small" transfer />
      </FormItem>
      <!-- <FormItem :label="$t('picture')" prop="name">
        <Button @click="insert" icon="ios-cloud-upload-outline" size="small"
          >{{ $t('upload_background') }}</Button
        >
      </FormItem> -->
    </Form>
    <Divider orientation="left" plain>{{ $t('color_macthing') }}</Divider>
    <div class="color-list">
      <template v-for="(item, i) in colorList">
        <div :key="item.label + i" class="item">
          {{ item.label }}:
          <span
            v-for="color in item.color"
            :key="color"
            :style="`background:${color}`"
            @click="setColor(color)"
          ></span>
        </div>
      </template>
    </div>
    <!-- <Divider orientation="left" plain>{{ $t('background_texture') }}</Divider> -->
    <!-- <div>
      <img
        src="@/assets/1.png"
        @click="(e) => setBgImg(e.target)"
        class="img"
      />
      <img
        src="@/assets/2.png"
        @click="(e) => setBgImg(e.target)"
        class="img"
        alt=""
      />
      <img
        src="@/assets/3.png"
        @click="(e) => setBgImg(e.target)"
        class="img"
        alt=""
      />
      <img
        src="@/assets/4.png"
        @click="(e) => setBgImg(e.target)"
        class="img"
        alt=""
      />
      <img
        src="@/assets/5.png"
        @click="(e) => setBgImg(e.target)"
        class="img"
        alt=""
      />
    </div> -->
    <!-- <Modal
      v-model="showModal"
      :title="$t('alert.select_image')"
      @on-ok="insertImgFile"
      @on-cancel="showModal = false"
    >
      <Upload :before-upload="handleUpload" action="#">
        <Button icon="ios-cloud-upload-outline">{{ $t('select_image') }}</Button>
      </Upload>
    </Modal> -->
  </div>
</template>

<script>
import { getImgStr } from "@/utils/utils";
export default {
  name: 'bgBar',
  inject: ['canvas', 'fabric'],
  data() {
    return {
      showModal: false,
      color: '',
      imgFile: '',
      colorList: [
        {
          label: this.$t('scenary_x', {number: 1}),
          color: ['#5F2B63', '#B23554', '#F27E56', '#FCE766']
        },
        {
          label: this.$t('scenary_x', {number: 2}),
          color: ['#86DCCD', '#E7FDCB', '#FFDC84', '#F57677']
        },
        {
          label: this.$t('scenary_x', {number: 3}),
          color: ['#5FC2C7', '#98DFE5', '#C2EFF3', '#DDFDFD']
        },
        {
          label: this.$t('scenary_x', {number: 4}),
          color: ['#9EE9D3', '#2FC6C8', '#2D7A9D', '#48466d']
        },
        {
          label: this.$t('scenary_x', {number: 5}),
          color: ['#61c0bf', '#bbded6', '#fae3d9', '#ffb6b9']
        },
        {
          label: this.$t('scenary_x', {number: 6}),
          color: ['#ffaaa5', '#ffd3b6', '#dcedc1', '#a8e6cf']
        }
      ]
    };
  },
  methods: {
    // 设置背景图片
    // setBgImg(target) {
    //   const imgEl = target.cloneNode(true);
    //   imgEl.onload = () => {
    //     // 可跨域设置
    //     const imgInstance = new this.fabric.Image(imgEl, { crossOrigin: 'anonymous' });
    //     // 渲染背景
    //     this.canvas.c.setBackgroundImage(imgInstance, this.canvas.c.renderAll.bind(this.canvas.c), {
    //       scaleX: this.canvas.c.width / imgInstance.width,
    //       scaleY: this.canvas.c.width / imgInstance.width,
    //     });
    //     this.canvas.c.renderAll()
    //     this.canvas.c.requestRenderAll();
    //   }
    // },
    // 清空文件 展示文件框
    // insert() {
    //   this.imgFile = ''
    //   this.showModal = true
    // },
    // 确认插入图片
    // insertImgFile() {
    //   if (this.imgFile === '') {
    //     return this.$Message.error(this.$t('alert.select_file'))
    //   }
    //   const imgEl = document.createElement('img');
    //   imgEl.src = this.imgFile
    //   // 插入页面
    //   document.body.appendChild(imgEl);
    //   imgEl.onload = () => {
    //     this.setBgImg(imgEl)
    //     imgEl.remove()
    //   }
    // },
    // 文件选择
    // handleUpload(file) {
    //   getImgStr(file).then(res => {
    //     this.imgFile = res
    //   })
    // },
    // 背景颜色设置
    setThisColor() {
      this.setColor(this.color)
    },
    // 背景颜色设置
    setColor(color) {
      const workspace = this.canvas.c.getObjects().find(item => item.id = 'workspace')
      workspace.set('fill', color)
      this.canvas.c.renderAll()
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
/deep/ .ivu-form-item {
  margin-bottom: 0;
}
.img {
  width: 50px;
  padding: 5px;
  background: #f5f5f5;
  margin-left: 2px;
  height: 70px;
  cursor: pointer;
}

.color-list {
  padding: 10px 0;
  .item {
    padding-bottom: 5px;
  }
  span {
    display: inline-block;
    margin-left: 6px;
    background: #f5f5f5;
    height: 20px;
    width: 20px;
    font-size: 12px;
    line-height: 20px;
    vertical-align: middle;
    cursor: pointer;
  }
}

/deep/ .ivu-divider-plain.ivu-divider-with-text-left {
  margin: 10px 0;
  font-weight: bold;
}
</style>
