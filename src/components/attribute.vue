<template>
  <div class="box" v-if="mSelectMode === 'one'">
    <!-- 字体属性 -->
    <div v-show="textType.includes(mSelectOneType)">
      <Divider plain orientation="left">字体</Divider>
      <Form label-position="left" :label-width="40">
        <FormItem label="大小">
          <InputNumber
            v-model="fontAttr.fontSize"
            @on-change="(value) => changeCommon('fontSize', value)"
            show-input
            size="small"
          ></InputNumber>
        </FormItem>
        <FormItem label="字体">
          <Select
            v-model="fontAttr.fontFamily"
            @on-change="changeFontFamily"
            size="small"
          >
            <Option
              v-for="item in fontFamilyList"
              :value="item"
              :key="'font-' + item"
              >{{ item }}</Option
            >
          </Select>
        </FormItem>
        <FormItem label="背景">
          <ColorPicker
            v-model="fontAttr.textBackgroundColor"
            @on-change="(value) => changeCommon('textBackgroundColor', value)"
            alpha
            transfer
            size="small"
          />
        </FormItem>
        <FormItem label="对齐">
          <RadioGroup
            v-model="fontAttr.textAlign"
            @on-change="(value) => changeCommon('textAlign', value)"
            size="small"
            type="button"
          >
            <Radio v-for="(item, i) in textAlignList" :label="item" :key="item">
              <span v-html="textAlignListSvg[i]"></span>
            </Radio>
          </RadioGroup>
        </FormItem>
        <div style="padding: 5px 0">
          加粗：<i-switch
            v-model="fontAttr.fontWeight"
            true-value="bold"
            false-value="normal"
            size="small"
            @on-change="(value) => changeCommon('fontWeight', value)"
          />
          斜体：<i-switch
            v-model="fontAttr.fontStyle"
            true-value="italic"
            false-value="normal"
            size="small"
            @on-change="(value) => changeCommon('fontStyle', value)"
          />
          <br />
          下划：<i-switch
            v-model="fontAttr.underline"
            size="small"
            @on-change="(value) => changeCommon('underline', value)"
          />
          中划：<i-switch
            v-model="fontAttr.linethrough"
            size="small"
            @on-change="(value) => changeCommon('linethrough', value)"
          />
          <br />
          上划：<i-switch
            v-model="fontAttr.overline"
            size="small"
            @on-change="(value) => changeCommon('overline', value)"
          />
        </div>

        <FormItem label="行高">
          <InputNumber
            v-model="fontAttr.lineHeight"
            @on-change="(value) => changeCommon('lineHeight', value)"
            show-input
            size="small"
            :step="0.1"
          ></InputNumber>
        </FormItem>

        <FormItem label="间距">
          <InputNumber
            v-model="fontAttr.charSpacing"
            @on-change="(value) => changeCommon('charSpacing', value)"
            show-input
            size="small"
          ></InputNumber>
        </FormItem>
      </Form>
    </div>
    <!-- 通用属性 -->
    <div v-show="baseType.includes(mSelectOneType)">
      <Divider plain orientation="left">外观</Divider>
      <Form label-position="left" :label-width="40">
        <FormItem label="颜色">
          <ColorPicker
            v-model="baseAttr.fill"
            @on-change="(value) => changeCommon('fill', value)"
            alpha
            transfer
            size="small"
          />
        </FormItem>
        <FormItem label="旋转">
          <InputNumber
            v-model="baseAttr.angle"
            :max="360"
            @on-change="(value) => changeCommon('angle', value)"
            show-input
            size="small"
          ></InputNumber>
        </FormItem>
        <FormItem label="X轴">
          <InputNumber
            v-model="baseAttr.left"
            :max="360"
            @on-change="(value) => changeCommon('left', value)"
            show-input
            size="small"
          ></InputNumber>
        </FormItem>
        <FormItem label="Y轴">
          <InputNumber
            v-model="baseAttr.top"
            :max="360"
            @on-change="(value) => changeCommon('top', value)"
            show-input
            size="small"
          ></InputNumber>
        </FormItem>
        <FormItem label="透明">
          <Slider
            v-model="baseAttr.opacity"
            @on-change="(value) => changeCommon('opacity', value)"
            size="small"
          ></Slider>
        </FormItem>
      </Form>
      <Divider plain orientation="left">描边</Divider>
      <Form label-position="left" :label-width="40">
        <FormItem label="宽度">
          <InputNumber
            v-model="baseAttr.strokeWidth"
            :max="360"
            @on-change="(value) => changeCommon('strokeWidth', value)"
            show-input
            size="small"
          ></InputNumber>
        </FormItem>
        <FormItem label="颜色">
          <ColorPicker
            v-model="baseAttr.stroke"
            @on-change="(value) => changeCommon('stroke', value)"
            alpha
            transfer
            size="small"
          />
        </FormItem>
      </Form>

      <Divider plain orientation="left">阴影</Divider>
      <Form label-position="left" :label-width="40">
        <FormItem label="颜色">
          <ColorPicker
            size="small"
            v-model="baseAttr.shadow.color"
            @on-change="(value) => changeShadow('color', value)"
            alpha
            transfer
          />
        </FormItem>
        <FormItem label="模糊">
          <InputNumber
            v-model="baseAttr.shadow.blur"
            :max="360"
            @on-change="(value) => changeShadow('blur', value)"
            size="small"
          ></InputNumber>
        </FormItem>
        <FormItem label="X轴">
          <InputNumber
            v-model="baseAttr.shadow.offsetX"
            :max="360"
            @on-change="(value) => changeShadow('offsetX', value)"
            size="small"
          ></InputNumber>
        </FormItem>
        <FormItem label="Y轴">
          <InputNumber
            v-model="baseAttr.shadow.offsetY"
            :max="360"
            @on-change="(value) => changeShadow('offsetY', value)"
            size="small"
          ></InputNumber>
        </FormItem>
      </Form>
    </div>

    <!-- 图片属性 -->
    <div v-show="imgType.includes(mSelectOneType)">
      <Divider plain orientation="left">图片滤镜</Divider>
      模糊：<Slider
        v-model="imgAttr.blur"
        :max="1"
        :min="0"
        :step="0.1"
        @on-change="imgBlur"
        show-input
        size="small"
      ></Slider>
    </div>
  </div>
</template>

<script>
import select from '@/mixins/select'
import FontFaceObserver from 'fontfaceobserver'
import fontList from "@/assets/fonts/font";
export default {
  name: 'ToolBar',
  mixins: [select],
  data() {
    return {
      // 通用元素
      baseType: ['text', 'i-text', 'textbox', 'rect', 'circle', 'triangle', 'image', 'group'],
      // 文字元素
      textType: ['i-text', 'textbox', 'text'],
      // 图片元素
      imgType: ['image'],
      // 通用属性
      baseAttr: {
        opacity: 0,
        angle: 0,
        fill: '#fff',
        left: 0,
        top: 0,
        strokeWidth: 0,
        stroke: '#fff',
        shadow: {
          color: '#fff',
          blur: 0,
          offsetX: 0,
          offsetY: 0,
        }
      },
      // 字体属性
      fontAttr: {
        fontSize: 0,
        fontFamily: '',
        lineHeight: 0,
        charSpacing: 0,
        fontWeight: '',
        textBackgroundColor: '#fff',
        textAlign: '',
        fontStyle: '',
        underline: false,
        linethrough: false,
        overline: false
      },
      // 图片属性
      imgAttr: {
        blur: 0,
      },
      // 字体下拉列表
      fontFamilyList: fontList.map(item => item.fontFamily),
      // 字体对齐方式
      textAlignList: ['left', 'center', 'right'],
      // 对齐图标
      textAlignListSvg: ['<svg t="1650441458823" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3554" width="14" height="14"><path d="M198.4 198.4h341.333333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666667h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-569.6c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666666h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533334z m0 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3555"></path></svg>', '<svg t="1650441512015" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3704" width="14" height="14"><path d="M313.6 198.4h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533333z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m115.2 170.666666h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533334z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3705"></path></svg>', '<svg t="1650441519862" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3854" width="14" height="14"><path d="M454.4 283.733333v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h341.333334c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333334c-8.533333 0-14.933333-2.133333-19.2-8.533334-4.266667-4.266667-8.533333-10.666667-8.533333-19.2z m-226.133333 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333H256c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533333-19.2z m113.066666 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533334-19.2 6.4-6.4 12.8-8.533333 19.2-8.533334h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533334-19.2z m-170.666666 170.666666v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-4.266667-8.533333-10.666667-8.533333-19.2z" p-id="3855"></path></svg>']
    };
  },
  created() {

    this.event.on('selectOne', (e) => {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      if (activeObject) {
        // base
        this.baseAttr.opacity = activeObject.get('opacity') * 100
        this.baseAttr.fill = activeObject.get('fill')
        this.baseAttr.left = activeObject.get('left')
        this.baseAttr.top = activeObject.get('top')
        this.baseAttr.stroke = activeObject.get('stroke')
        this.baseAttr.strokeWidth = activeObject.get('strokeWidth')
        this.baseAttr.shadow = activeObject.get('shadow') || {}
        if (activeObject.type === 'i-text' || activeObject.type === 'text' || activeObject.type === 'textbox') {
          this.fontAttr.fontSize = activeObject.get('fontSize')
          this.fontAttr.fontFamily = activeObject.get('fontFamily')
          this.fontAttr.lineHeight = activeObject.get('lineHeight')
          this.fontAttr.textAlign = activeObject.get('textAlign')
          this.fontAttr.underline = activeObject.get('underline')
          this.fontAttr.linethrough = activeObject.get('linethrough')
          this.fontAttr.charSpacing = activeObject.get('charSpacing')
          this.fontAttr.overline = activeObject.get('overline')
          this.fontAttr.fontStyle = activeObject.get('fontStyle')
          this.fontAttr.textBackgroundColor = activeObject.get('textBackgroundColor')
          this.fontAttr.fontWeight = activeObject.get('fontWeight')
        }

        // 图片滤镜
        if (activeObject.type === 'image') {
          this.imgAttr.blur = activeObject.filters[0] ? activeObject.filters[0].blur : 0
        }


      }
    })
  },
  methods: {
    // 图片属性
    imgBlur(blur) {
      const activeObject = this.canvas.c.getActiveObjects()[0]
      if (activeObject) {
        const filter = new this.fabric.Image.filters.Blur({ blur });
        activeObject.filters = [filter]
        activeObject.applyFilters();
        this.canvas.c.renderAll()
      }
    },
    // 修改字体
    changeFontFamily(fontName) {
      if(!fontName) return

      // 跳过加载的属性
      const skipFonts = ['arial', 'Microsoft YaHei']
      if (skipFonts.includes(fontName)) {
        const activeObject = this.canvas.c.getActiveObjects()[0]
        activeObject && activeObject.set('fontFamily', fontName);
        this.canvas.c.renderAll()
        return
      }
      this.$Spin.show();
      // 字体加载
      var font = new FontFaceObserver(fontName);
      font.load(null, 150000).then(() => {
        const activeObject = this.canvas.c.getActiveObjects()[0]
        activeObject && activeObject.set('fontFamily', fontName);
        this.canvas.c.renderAll()
        this.$Spin.hide();
      }).catch((err) => {
        console.log(err)
        this.$Spin.hide();
      })
    },
    // 通用属性改变
    changeCommon(key, value) {
      const activeObject = this.canvas.c.getActiveObjects()[0]
      // 透明度特殊转换
      if (key === 'opacity') {
        activeObject && activeObject.set(key, value / 100)
        this.canvas.c.renderAll()
        return
      }
      activeObject && activeObject.set(key, value)
      this.canvas.c.renderAll()
    },
    // 阴影设置
    changeShadow() {
      const activeObject = this.canvas.c.getActiveObjects()[0]
      activeObject && activeObject.set('shadow', new fabric.Shadow(this.baseAttr.shadow));
      this.canvas.c.renderAll()
    }
  }
};
</script>
<style scoped lang="less">
/deep/ .ivu-form-item {
  margin-bottom: 0;
}
/deep/ .ivu-color-picker {
  display: block;
}
/deep/ .ivu-input-number {
  display: block;
  width: 100%;
  top: 4px;
}

/deep/ .ivu-divider-plain.ivu-divider-with-text-left {
  margin: 10px 0;
  font-weight: bold;
}
</style>
