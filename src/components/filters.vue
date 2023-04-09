<!--
 * @Author: 秦少卫
 * @Date: 2023-04-06 23:04:38
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-09 18:06:29
 * @Description: 图片滤镜
-->

<template>
  <div v-if="mSelectMode === 'one' && type === 'image'">
    <!-- 无参数滤镜 -->
    <div class="box" v-for="(value, key) in noParamsFilters" :key="key">
      <span class="label">{{ key }}</span>
      <Switch v-model="noParamsFilters[key]" @on-change="(val) => changeFilters(key, val)" />
    </div>
    <!-- 有参数滤镜 -->
    <div class="box" v-for="item in paramsFilters" :key="item.type">
      <span class="label">{{ item.type }}</span>
      <Switch v-model="item.status" @on-change="changeFiltersByParams(item.type)" />
      <div v-if="item.status" style="display: block">
        <div class="content slider-box" v-for="info in item.params" :key="info">
          <div v-if="info.uiType === 'select'">
            <RadioGroup v-model="info.value" @on-change="changeFiltersByParams(item.type)">
              <Radio :label="listItem" v-for="listItem in info.list" :key="listItem">
                <span>{{ listItem }}</span>
              </Radio>
            </RadioGroup>
          </div>
          <div v-if="info.uiType === 'number'">
            <Slider
              v-model="info.value"
              :max="info.max"
              :min="info.min"
              :step="info.step"
              @on-input="changeFiltersByParams(item.type)"
            ></Slider>
          </div>
          <div v-if="info.uiType === 'color'">
            <ColorPicker v-model="info.value" alpha @on-change="changeFiltersByParams(item.type)" />
          </div>
        </div>
      </div>

      <div></div>
    </div>

    <div class="flex-view">
      <div class="flex-item">
        <span class="label">灰度模式</span>
        <div class="content slider-box">
          <Switch v-model="grayscale" @on-change="change('Grayscale', 'grayscale')" />
          <RadioGroup
            v-model="grayscaleMode"
            @on-change="change('Grayscale', 'grayscale', 'mode', 'grayscaleMode')"
            v-if="grayscale"
          >
            <Radio label="average">
              <span>average</span>
            </Radio>
            <Radio label="lightness">
              <span>lightness</span>
            </Radio>
            <Radio label="luminosity">
              <span>luminosity</span>
            </Radio>
          </RadioGroup>
        </div>
      </div>
    </div>

    <div class="flex-view">
      <div class="flex-item">
        <span class="label">色相</span>
        <div class="content slider-box">
          <Switch v-model="gamma" @on-change="change('Gamma', 'gamma')" />
          <Slider
            v-model="gammaRed"
            :max="2.2"
            :min="0.01"
            :step="0.01"
            @on-input="change('Gamma', 'gamma', 'gamma')"
          ></Slider>
          <Slider
            v-model="gammaGreen"
            :max="2.2"
            :min="0.01"
            :step="0.01"
            @on-input="change('Gamma', 'gamma', 'gamma')"
          ></Slider>
          <Slider
            v-model="gammaBlue"
            :max="2.2"
            :min="0.01"
            :step="0.01"
            @on-input="change('Gamma', 'gamma', 'gamma')"
          ></Slider>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import select from '@/mixins/select';

// 无参数滤镜
const noParamsFilters = {
  Invert: false,
  Sepia: false,
  BlackWhite: false,
  Brownie: false,
  Vintage: false,
  Kodachrome: false,
  technicolor: false,
  Polaroid: false,
};

// const uiType = {
//   select: '',
//   color: '',
//   number: '',
// };

const paramsFilters = [
  {
    type: 'Grayscale',
    status: false,
    params: [
      {
        key: 'mode',
        value: 'average',
        uiType: 'select',
        list: ['average', 'lightness', 'luminosity'],
      },
    ],
  },
  {
    type: 'RemoveColor',
    status: false,
    params: [
      {
        key: 'color',
        value: '',
        uiType: 'color',
      },
      {
        key: 'distance',
        value: 0,
        uiType: 'number',
        min: 0,
        max: 1,
        step: 0.1,
      },
    ],
  },
  {
    type: 'Brightness',
    status: false,
    params: [
      {
        key: 'brightness',
        value: 0,
        uiType: 'number',
        min: -1,
        max: 1,
        step: 0.1,
      },
    ],
  },
  {
    type: 'Contrast',
    status: false,
    params: [
      {
        key: 'contrast',
        value: 0,
        uiType: 'number',
        min: -1,
        max: 1,
        step: 0.1,
      },
    ],
  },
  {
    type: 'Saturation',
    status: false,
    params: [
      {
        key: 'saturation',
        value: 0,
        uiType: 'number',
        min: -1,
        max: 1,
        step: 0.1,
      },
    ],
  },
  {
    type: 'Vibrance',
    status: false,
    params: [
      {
        key: 'vibrance',
        value: 0,
        uiType: 'number',
        min: -1,
        max: 1,
        step: 0.1,
      },
    ],
  },
  {
    type: 'HueRotation',
    status: false,
    params: [
      {
        key: 'rotation',
        value: 0,
        uiType: 'number',
        min: -1,
        max: 1,
        step: 0.1,
      },
    ],
  },
  {
    type: 'Noise',
    status: false,
    params: [
      {
        key: 'noise',
        value: 0,
        uiType: 'number',
        min: -1,
        max: 1000,
        step: 0.1,
      },
    ],
  },
  {
    type: 'Pixelate',
    status: false,
    params: [
      {
        key: 'blocksize',
        value: 0,
        uiType: 'number',
        min: 0,
        max: 1000,
        step: 0.1,
      },
    ],
  },
  {
    type: 'Blur',
    status: false,
    params: [
      {
        key: 'blur',
        value: 0,
        uiType: 'number',
        min: 0,
        max: 1,
        step: 0.1,
      },
    ],
  },
  // {
  //   // todo
  //   type: 'Gamma',
  //   params: {
  //     brightness: 0,
  //   },
  // },
];
export default {
  name: 'replaceImg',
  mixins: [select],
  inject: ['canvas', 'fabric'],
  data() {
    return {
      noParamsFilters: noParamsFilters,
      paramsFilters: [...paramsFilters],
      id: '',
      // 背景移除
      removeColor: false,
      removeColorColor: '',
      removeColorDistance: 0,
      // 亮度
      brightness: false,
      brightnessBrightness: 0,
      // 色相
      gamma: false,
      gammaRed: 1,
      gammaGreen: 1,
      gammaBlue: 1,
      //
      contrast: false,
      contrastValue: 0,
      //
      saturation: false,
      saturationValue: 0,
      // 震动
      vibrance: false,
      vibranceValue: 0,
      // 选装
      hueRotation: false,
      hueRotationRotation: 0,
      // 噪音
      noise: false,
      noiseValue: 0,
      // 像素画
      pixelate: false,
      pixelateBlocksize: 0,
      // 模糊
      blur: false,
      blurValue: 0,
      model: 'none',
    };
  },
  created() {
    this.event.on('selectOne', () => {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      if (activeObject) {
        this.type = activeObject.type;
        if (this.type === 'image') {
          // 无参数滤镜回显
          // 有参数滤镜回显
          // 回显类型
          // const imgFilter = activeObject.filters.find((item) => filters.includes(item.type));
          // if (imgFilter) {
          //   this.model = imgFilter.type;
          // } else {
          //   this.model = 'none';
          // }
          // 灰度
          // this.grayscale = !!this._getFilter(activeObject, 'Grayscale');
          // this.grayscaleMode = this._getFilter(activeObject, 'Grayscale')
          //   ? this._getFilter(activeObject, 'Grayscale').mode
          //   : '';
          // this.sepia = !!this._getFilter(activeObject, 'Sepia');
          // this.blackWhite = !!this._getFilter(activeObject, 'BlackWhite');
          // this.brownie = !!this._getFilter(activeObject, 'Brownie');
          // this.vintage = !!this._getFilter(activeObject, 'Vintage');
          // this.kodachrome = !!this._getFilter(activeObject, 'Kodachrome');
          // this.technicolor = !!this._getFilter(activeObject, 'Technicolor');
          // this.polaroid = !!this._getFilter(activeObject, 'Polaroid');
        }
        this.$forceUpdate();
      }
    });
  },
  methods: {
    // 无参数滤镜修改状态
    changeFilters(type, value) {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      if (value) {
        const itemFilter = this._getFilter(activeObject, type);
        if (!itemFilter) {
          this._createFilter(activeObject, type);
        }
      } else {
        this._removeFilter(activeObject, type);
      }
    },
    changeFiltersByParams(type) {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      const moduleInfo = this.paramsFilters.find((item) => item.type === type);
      if (moduleInfo.status) {
        moduleInfo.params.forEach((paramsItem) => {
          this.changeAttr(type, paramsItem.key, paramsItem.value);
        });
      } else {
        this._removeFilter(activeObject, type);
      }
    },
    changeAttr(type, key, value) {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      const itemFilter = this._getFilter(activeObject, type);
      if (itemFilter) {
        itemFilter[key] = value;
      } else {
        const imgFilter = this._createFilter(activeObject, type);
        imgFilter[key] = value;
      }
      activeObject.applyFilters();
      this.canvas.c.renderAll();
    },
    /**
     * Create filter instance
     * @param {fabric.Image} sourceImg - Source image to apply filter
     * @param {string} type - Filter type
     * @param {Object} [options] - Options of filter
     * @returns {Object} Fabric object of filter
     * @private
     */
    _createFilter(sourceImg, type, options = null) {
      let filterObj;
      // capitalize first letter for matching with fabric image filter name
      const fabricType = this._getFabricFilterType(type);
      const ImageFilter = this.fabric.Image.filters[fabricType];
      if (ImageFilter) {
        filterObj = new ImageFilter(options);
        filterObj.options = options;
        sourceImg.filters.push(filterObj);
      }
      sourceImg.applyFilters();
      this.canvas.c.renderAll();
      return filterObj;
    },
    /**
     * Get applied filter instance
     * @param {fabric.Image} sourceImg - Source image to apply filter
     * @param {string} type - Filter type
     * @returns {Object} Fabric object of filter
     * @private
     */
    _getFilter(sourceImg, type) {
      let imgFilter = null;

      if (sourceImg) {
        const fabricType = this._getFabricFilterType(type);
        const { length } = sourceImg.filters;
        let item, i;

        for (i = 0; i < length; i += 1) {
          item = sourceImg.filters[i];
          if (item.type === fabricType) {
            imgFilter = item;
            break;
          }
        }
      }

      return imgFilter;
    },
    /**
     * Remove applied filter instance
     * @param {fabric.Image} sourceImg - Source image to apply filter
     * @param {string} type - Filter type
     * @private
     */
    _removeFilter(sourceImg, type) {
      const fabricType = this._getFabricFilterType(type);
      sourceImg.filters = sourceImg.filters.filter((value) => value.type !== fabricType);
      sourceImg.applyFilters();
      this.canvas.c.renderAll();
    },

    /**
     * Change filter class name to fabric's, especially capitalizing first letter
     * @param {string} type - Filter type
     * @example
     * 'grayscale' -> 'Grayscale'
     * @returns {string} Fabric filter class name
     */
    _getFabricFilterType(type) {
      return type.charAt(0).toUpperCase() + type.slice(1);
    },
  },
};
</script>

<style scoped lang="less"></style>
