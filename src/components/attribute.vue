<template>
  <div class="box" v-if="mSelectMode === 'one'">
    <iSwitch v-model="isGradient" />

    <ColorPicker
      v-if="typeof baseAttr.fill  === 'string' || !isGradient"
      v-model="baseAttr.fill"
      @on-change="(value) => changeCommon('fill', value)"
      alpha
    />
    <newColorPicker
      v-if="typeof baseAttr.fill !== 'string' || isGradient"
     :isGradient="true" :gradient="gradient" :onEndChange="changeColor"></newColorPicker>

    <!-- 字体属性 -->
    <div v-show="textType.includes(mSelectOneType)">
      <Divider plain orientation="left">{{ $t("attributes.font") }}</Divider>
      <div class="flex-view">
        <div class="flex-item">
          <div class="left">
            <Select
              v-model="fontAttr.fontFamily"
              @on-change="changeFontFamily"
            >
              <Option
                v-for="item in fontFamilyList"
                :value="item"
                :key="'font-' + item"
              >
                {{ item }}
              </Option>
            </Select>
          </div>
          <div class="right">
            <InputNumber
              v-model="fontAttr.fontSize"
              @on-change="(value) => changeCommon('fontSize', value)"
              show-input
            ></InputNumber>
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <RadioGroup
            v-model="fontAttr.textAlign"
            @on-change="(value) => changeCommon('textAlign', value)"
            type="button"
          >
            <Radio v-for="(item, i) in textAlignList" :label="item" :key="item">
              <span v-html="textAlignListSvg[i]"></span>
            </Radio>
          </RadioGroup>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <ButtonGroup >
            <Button @click="changeFontWeight('fontWeight', fontAttr.fontWeight)"
              ><svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M793.99865 476a244 244 0 0 0 54-130.42C862.75865 192.98 743.01865 64 593.85865 64H195.01865a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h63.74v576H195.01865a32 32 0 0 0-32 32v96a32 32 0 0 0 32 32h418.64c141.6 0 268.28-103.5 282-244.8 9.48-96.9-32.78-184.12-101.66-239.2zM418.33865 224h175.52a96 96 0 0 1 0 192h-175.52z m175.52 576h-175.52V576h175.52a112 112 0 0 1 0 224z"
                  :fill="fontAttr.fontWeight === 'bold' ? '#305ef4' : '#666'"
                ></path></svg
            ></Button>
            <Button @click="changeFontStyle('fontStyle', fontAttr.fontStyle)"
              ><svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M832 96v64a32 32 0 0 1-32 32h-125.52l-160 640H608a32 32 0 0 1 32 32v64a32 32 0 0 1-32 32H224a32 32 0 0 1-32-32v-64a32 32 0 0 1 32-32h125.52l160-640H416a32 32 0 0 1-32-32V96a32 32 0 0 1 32-32h384a32 32 0 0 1 32 32z"
                  :fill="fontAttr.fontStyle === 'italic' ? '#305ef4' : '#666'"
                ></path></svg
            ></Button>
            <Button
              @click="changeLineThrough('linethrough', fontAttr.linethrough)"
              ><svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M893.088 501.792H125.344a32 32 0 0 0 0 64h767.744a32 32 0 0 0 0-64zM448 448h112V208h288V96H160v112h288zM448 640h112v288H448z"
                  :fill="fontAttr.linethrough ? '#305ef4' : '#666'"
                ></path></svg
            ></Button>
            <Button @click="changeUnderline('underline', fontAttr.underline)"
              ><svg viewBox="0 0 1024 1024" width="14" height="14">
                <path
                  d="M703.232 67.008h127.488v413.248c0 158.016-142.656 286.016-318.72 286.016-176 0-318.72-128-318.72-286.016V67.008h127.488v413.248c0 39.872 18.176 78.144 51.136 107.776 36.8 32.96 86.528 51.072 140.096 51.072s103.36-18.112 140.032-51.136c33.024-29.632 51.2-67.968 51.2-107.776V67.008zM193.28 871.616h637.44v85.376H193.28v-85.376z"
                  :fill="fontAttr.underline ? '#305ef4' : '#666'"
                ></path></svg
            ></Button>
          </ButtonGroup>
        </div>
      </div>

      <!-- <div style="padding: 5px 0">
        {{$t('attributes.swipe_up')}}
        <i-switch v-model="fontAttr.overline"

                  @on-change="(value) => changeCommon('overline', value)" />
      </div> -->

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t("attributes.line_height") }}</span>
          <div class="content">
            <InputNumber
              v-model="fontAttr.lineHeight"
              @on-change="(value) => changeCommon('lineHeight', value)"
              show-input
              :step="0.1"
            ></InputNumber>
          </div>
        </div>
        <div class="flex-item">
          <span class="label">{{ $t("attributes.char_spacing") }}</span>
          <div class="content">
            <InputNumber
              v-model="fontAttr.charSpacing"
              @on-change="(value) => changeCommon('charSpacing', value)"
              show-input
            ></InputNumber>
          </div>
        </div>
      </div>

      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t("background") }}</span>
          <div class="content">
            <ColorPicker
              v-model="fontAttr.textBackgroundColor"
              @on-change="(value) => changeCommon('textBackgroundColor', value)"
              alpha
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 通用属性 -->
    <div v-show="baseType.includes(mSelectOneType)">
      <Divider plain orientation="left">{{
        $t("attributes.exterior")
      }}</Divider>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t("attributes.left") }}</span>
          <div class="content">
            <InputNumber
              v-model="baseAttr.left"
              :max="360"
              @on-change="(value) => changeCommon('left', value)"
              show-input
            ></InputNumber>
          </div>
        </div>
        <div class="flex-item">
          <span class="label">{{ $t("attributes.top") }}</span>
          <div class="content">
            <InputNumber
              v-model="baseAttr.top"
              :max="360"
              @on-change="(value) => changeCommon('top', value)"
              show-input
            ></InputNumber>
          </div>
        </div>
      </div>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t("color") }}</span>
          <div class="content">
            <ColorPicker
              v-model="baseAttr.fill"
              @on-change="(value) => changeCommon('fill', value)"
              alpha
            />
          </div>
        </div>
        <div class="flex-item">
          <span class="label">{{ $t("attributes.angle") }}</span>
          <div class="content">
            <InputNumber
              v-model="baseAttr.angle"
              :max="360"
              @on-change="(value) => changeCommon('angle', value)"
              show-input
            ></InputNumber>
          </div>
        </div>
      </div>
      <div class="flex-view">
        <div class="flex-item" >
          <span class="label">{{ $t("attributes.opacity") }}</span>
          <div class="content slider-box">
            <Slider
              v-model="baseAttr.opacity"
              @on-change="(value) => changeCommon('opacity', value)"
            ></Slider>
          </div>
        </div>
      </div>
      <!-- 边框 -->
      <Divider plain orientation="left">{{ $t("attributes.stroke") }}</Divider>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t("color") }}</span>
          <div class="content">
            <ColorPicker
              v-model="baseAttr.stroke"
              @on-change="(value) => changeCommon('stroke', value)"
              alpha
            />
          </div>
        </div>
        <div class="flex-item">
          <span class="label">{{ $t("width") }}</span>
          <div class="content">
            <InputNumber
              v-model="baseAttr.strokeWidth"
              :max="360"
              @on-change="(value) => changeCommon('strokeWidth', value)"
              show-input
            ></InputNumber>
          </div>
        </div>
      </div>

      <!-- 阴影 -->
      <Divider plain orientation="left">{{ $t("attributes.shadow") }}</Divider>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t("color") }}</span>
          <div class="content">
            <ColorPicker
              v-model="baseAttr.shadow.color"
              @on-change="(value) => changeCommon('color', value)"
              alpha
            />
          </div>
        </div>
        <div class="flex-item">
          <span class="label">{{ $t("attributes.blur") }}</span>
          <div class="content">
            <InputNumber
              v-model="baseAttr.shadow.blur"
              :max="360"
              @on-change="(value) => changeShadow('blur', value)"
            ></InputNumber>
          </div>
        </div>
      </div>
      <div class="flex-view">
        <div class="flex-item">
          <span class="label">{{ $t("attributes.offset_x") }}</span>
          <div class="content">
            <InputNumber
              v-model="baseAttr.shadow.offsetX"
              :max="360"
              @on-change="(value) => changeShadow('offsetX', value)"
            ></InputNumber>
          </div>
        </div>
        <div class="flex-item">
          <span class="label">{{ $t("attributes.offset_y") }}</span>
          <div class="content">
            <InputNumber
              v-model="baseAttr.shadow.offsetY"
              :max="360"
              @on-change="(value) => changeShadow('offsetY', value)"
            ></InputNumber>
          </div>
        </div>
      </div>
    </div>

    <!-- 图片属性 -->
    <div v-show="imgType.includes(mSelectOneType)">
      <Divider plain orientation="left">{{
        $t("attributes.picture_filter")
      }}</Divider>
      <div class="flex-view">
        <div class="flex-item" >
          <span class="label">{{ $t("attributes.blur") }}</span>
          <div class="content slider-box">
            <Slider
              v-model="imgAttr.blur"
              :max="1"
              :min="0"
              :step="0.1"
              @on-change="imgBlur"
            ></Slider>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fontList from '@/assets/fonts/font';
import select from '@/mixins/select';
import FontFaceObserver from 'fontfaceobserver';
import { ColorPicker } from 'vue-color-gradient-picker';
import { fabric } from 'fabric';

function generateFabricGradientFromColorStops(handlers, width, height, orientation, angle) {
  const gradAngleToCoords = (angle1) => {
    const anglePI = (-parseInt(angle1, 10)) * (Math.PI / 180);
    const angleCoords = {
      x1: (Math.round(50 + Math.sin(anglePI) * 50)) / 100,
      y1: (Math.round(50 + Math.cos(anglePI) * 50)) / 100,
      x2: (Math.round(50 + Math.sin(anglePI + Math.PI) * 50)) / 100,
      y2: (Math.round(50 + Math.cos(anglePI + Math.PI) * 50)) / 100,
    };

    return angleCoords;
  };

  let bgGradient = {};
  const colorStops = [...handlers];

  if (orientation === 'linear') {
    const angleCoords = gradAngleToCoords(angle);
    bgGradient = new fabric.Gradient({
      type: 'linear',
      coords: {
        x1: angleCoords.x1 * width,
        y1: angleCoords.y1 * height,
        x2: angleCoords.x2 * width,
        y2: angleCoords.y2 * height,
      },
      colorStops,
    });
  } else if (orientation === 'radial') {
    bgGradient = new fabric.Gradient({
      type: 'radial',
      coords: {
        x1: width / 2,
        y1: height / 2,
        r1: 0,
        x2: width / 2,
        y2: height / 2,
        r2: width / 2,
      },
      colorStops,
    });
  }

  return bgGradient;
}

export default {
  name: 'ToolBar',
  mixins: [select],
  components: {
    newColorPicker: { ...ColorPicker },
  },
  data() {
    return {
      isGradient: false,
      color: {
        red: 255,
        green: 0,
        blue: 0,
        alpha: 1,
      },
      gradient: {
        type: 'linear',
        degree: 0,
        points: [
          {
            left: 0,
            red: 0,
            green: 0,
            blue: 0,
            alpha: 1,
          },
          {
            left: 100,
            red: 255,
            green: 0,
            blue: 0,
            alpha: 1,
          },
        ],
      },
      // 通用元素
      baseType: [
        'text',
        'i-text',
        'textbox',
        'rect',
        'circle',
        'triangle',
        'image',
        'group',
        'line',
        'arrow',
      ],
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
        },
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
        overline: false,
      },
      // 图片属性
      imgAttr: {
        blur: 0,
      },
      // 字体下拉列表
      fontFamilyList: fontList.map((item) => item.fontFamily),
      // 字体对齐方式
      textAlignList: ['left', 'center', 'right'],
      // 对齐图标
      textAlignListSvg: [
        '<svg t="1650441458823" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3554" width="18" height="18"><path d="M198.4 198.4h341.333333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666667h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-569.6c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m0 170.666666h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533334z m0 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3555"></path></svg>',
        '<svg t="1650441512015" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3704" width="18" height="18"><path d="M313.6 198.4h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533333z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z m115.2 170.666666h398.933333c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533334 19.2v57.6c0 8.533333-2.133333 14.933333-8.533334 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-398.933333c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 10.666667-8.533333 19.2-8.533334z m-115.2 170.666667h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-6.4-8.533333-12.8-8.533333-19.2v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 4.266667-4.266667 12.8-8.533333 19.2-8.533333z" p-id="3705"></path></svg>',
        '<svg t="1650441519862" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3854" width="18" height="18"><path d="M454.4 283.733333v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h341.333334c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-341.333334c-8.533333 0-14.933333-2.133333-19.2-8.533334-4.266667-4.266667-8.533333-10.666667-8.533333-19.2z m-226.133333 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h569.6c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333H256c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533333-19.2z m113.066666 170.666667v-57.6c0-8.533333 2.133333-14.933333 8.533334-19.2 6.4-6.4 12.8-8.533333 19.2-8.533334h454.4c8.533333 0 14.933333 2.133333 19.2 8.533334 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533333h-454.4c-8.533333 0-14.933333-2.133333-19.2-8.533333-6.4-4.266667-8.533333-10.666667-8.533334-19.2z m-170.666666 170.666666v-57.6c0-8.533333 2.133333-14.933333 8.533333-19.2 6.4-6.4 12.8-8.533333 19.2-8.533333h625.066667c8.533333 0 14.933333 2.133333 19.2 8.533333 6.4 6.4 8.533333 12.8 8.533333 19.2v57.6c0 8.533333-2.133333 14.933333-8.533333 19.2-6.4 6.4-12.8 8.533333-19.2 8.533334h-625.066667c-8.533333 0-14.933333-2.133333-19.2-8.533334-6.4-4.266667-8.533333-10.666667-8.533333-19.2z" p-id="3855"></path></svg>',
      ],
    };
  },
  created() {
    this.event.on('selectOne', () => {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      if (activeObject) {
        // base
        this.baseAttr.opacity = activeObject.get('opacity') * 100;
        this.baseAttr.fill = activeObject.get('fill');
        this.baseAttr.left = activeObject.get('left');
        this.baseAttr.top = activeObject.get('top');
        this.baseAttr.stroke = activeObject.get('stroke');
        this.baseAttr.strokeWidth = activeObject.get('strokeWidth');
        this.baseAttr.shadow = activeObject.get('shadow') || {};
        this.baseAttr.angle = activeObject.get('angle') || 0;
        if (
          activeObject.type === 'i-text'
          || activeObject.type === 'text'
          || activeObject.type === 'textbox'
        ) {
          this.fontAttr.fontSize = activeObject.get('fontSize');
          this.fontAttr.fontFamily = activeObject.get('fontFamily');
          this.fontAttr.lineHeight = activeObject.get('lineHeight');
          this.fontAttr.textAlign = activeObject.get('textAlign');
          this.fontAttr.underline = activeObject.get('underline');
          this.fontAttr.linethrough = activeObject.get('linethrough');
          this.fontAttr.charSpacing = activeObject.get('charSpacing');
          this.fontAttr.overline = activeObject.get('overline');
          this.fontAttr.fontStyle = activeObject.get('fontStyle');
          this.fontAttr.textBackgroundColor = activeObject.get(
            'textBackgroundColor',
          );
          this.fontAttr.fontWeight = activeObject.get('fontWeight');
        }

        // 图片滤镜
        if (activeObject.type === 'image') {
          this.imgAttr.blur = activeObject.filters[0]
            ? activeObject.filters[0].blur
            : 0;
        }
      }
    });
  },
  methods: {
    changeColor(val) {
      console.log(val);
      const activeObject = this.canvas.c.getActiveObjects()[0];
      if (activeObject) {
        const handlers = val.points.map((item) => ({
          offset: item.left / 100,
          color: `rgba(${item.red}, ${item.green}, ${item.blue}, ${item.alpha})`,
        }));
        const gradient = generateFabricGradientFromColorStops(handlers, activeObject.width, activeObject.height, val.type, val.degree);
        activeObject.set('fill', gradient);
        this.canvas.c.renderAll();
      }
    },
    // 图片属性
    imgBlur(blur) {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      if (activeObject) {
        const filter = new this.fabric.Image.filters.Blur({ blur });
        activeObject.filters = [filter];
        activeObject.applyFilters();
        this.canvas.c.renderAll();
      }
    },
    // 修改字体
    changeFontFamily(fontName) {
      if (!fontName) return;

      // 跳过加载的属性
      const skipFonts = ['arial', 'Microsoft YaHei'];
      if (skipFonts.includes(fontName)) {
        const activeObject = this.canvas.c.getActiveObjects()[0];
        activeObject && activeObject.set('fontFamily', fontName);
        this.canvas.c.renderAll();
        return;
      }
      this.$Spin.show();
      // 字体加载
      const font = new FontFaceObserver(fontName);
      font
        .load(null, 150000)
        .then(() => {
          const activeObject = this.canvas.c.getActiveObjects()[0];
          activeObject && activeObject.set('fontFamily', fontName);
          this.canvas.c.renderAll();
          this.$Spin.hide();
        })
        .catch((err) => {
          console.log(err);
          this.$Spin.hide();
        });
    },
    // 通用属性改变
    changeCommon(key, value) {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      // 透明度特殊转换
      if (key === 'opacity') {
        activeObject && activeObject.set(key, value / 100);
        this.canvas.c.renderAll();
        return;
      }
      // 旋转角度适配
      if (key === 'angle') {
        activeObject.rotate(value);
        this.canvas.c.renderAll();
        return;
      }
      activeObject && activeObject.set(key, value);
      this.canvas.c.renderAll();
    },
    // 阴影设置
    changeShadow() {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      activeObject
        && activeObject.set('shadow', new this.fabric.Shadow(this.baseAttr.shadow));
      this.canvas.c.renderAll();
    },
    // 加粗
    changeFontWeight(key, value) {
      const nValue = value === 'normal' ? 'bold' : 'normal';
      this.fontAttr.fontWeight = nValue;
      const activeObject = this.canvas.c.getActiveObjects()[0];
      activeObject && activeObject.set(key, nValue);
      this.canvas.c.renderAll();
    },
    // 斜体
    changeFontStyle(key, value) {
      const nValue = value === 'normal' ? 'italic' : 'normal';
      this.fontAttr.fontStyle = nValue;
      const activeObject = this.canvas.c.getActiveObjects()[0];
      activeObject && activeObject.set(key, nValue);
      this.canvas.c.renderAll();
    },
    // 中划
    changeLineThrough(key, value) {
      const nValue = value === false;
      this.fontAttr.linethrough = nValue;
      const activeObject = this.canvas.c.getActiveObjects()[0];
      activeObject && activeObject.set(key, nValue);
      this.canvas.c.renderAll();
    },
    // 下划
    changeUnderline(key, value) {
      const nValue = value === false;
      this.fontAttr.underline = nValue;
      const activeObject = this.canvas.c.getActiveObjects()[0];
      activeObject && activeObject.set(key, nValue);
      this.canvas.c.renderAll();
    },
  },
};
</script>

<style scoped lang="less">
@import url('vue-color-gradient-picker/dist/index.css');
/deep/ .ivu-color-picker {
  display: block;
}
/deep/ .ivu-input-number {
  display: block;
  width: 100%;
}

/deep/ .ivu-divider-plain.ivu-divider-with-text-left {
  margin: 10px 0;
  font-weight: bold;
  font-size: 16px;
  color: #000000;
}
.box {
  width: 100%;
}

.flex-view {
  width: 100%;
  margin-bottom: 5px;
  padding: 5px;
  display: inline-flex;
  justify-content: space-between;
  border-radius: 5px;
  background: #f6f7f9;
}
.flex-item {
  display: inline-flex;
  flex: 1;
  .label {
    width: 32px;
    height: 32px;
    line-height: 32px;
    display: inline-block;
    font-size: 14px;
    color: #333333;
  }
  .content {
    width: 60px;
  }
  .slider-box{
    width: calc(100% - 50px);
    margin-left:10px;
  }
  .right {
    margin-left: 10px;
    /deep/ .ivu-input-number {
      display: block;
      width: 100%;
    }
  }
  /deep/ .ivu-slider-wrap{
    margin: 13px 0;
  }
  /deep/ .ivu-radio-group-button .ivu-radio-wrapper {
    width: 48px;
    line-height: 40px;
    text-align: center;
    svg{
      vertical-align: baseline;
    }
  }

  /deep/ .ivu-btn-group-large > .ivu-btn {
    font-size: 24px;
  }

  /deep/ .ivu-radio-group-button.ivu-radio-group-large .ivu-radio-wrapper {
    font-size: 24px;
  }
}
</style>
