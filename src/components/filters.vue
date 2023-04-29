<!--
 * @Author: 秦少卫
 * @Date: 2023-04-06 23:04:38
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-09 23:27:49
 * @Description: 图片滤镜
-->

<template>
  <div v-if="mSelectMode === 'one' && type === 'image'" class="box">
    <Collapse>
      <Panel name="1">
        {{ $t('filters.simple') }}
        <template #content>
          <div class="filter-box">
            <!-- 无参数滤镜 -->
            <div class="filter-item" v-for="(value, key) in noParamsFilters" :key="key">
              <img
                :src="getImageUrl(key)"
                alt=""
                @click="
                  (noParamsFilters[key] = !noParamsFilters[key]),
                    changeFilters(key, noParamsFilters[key])
                "
              />
              <Checkbox
                v-model="noParamsFilters[key]"
                @on-change="(val) => changeFilters(key, val)"
              >
                {{ $t('filters.' + key) }}
              </Checkbox>
            </div>
          </div>
        </template>
      </Panel>
      <Panel name="2">
        {{ $t('filters.complex') }}
        <template #content>
          <!-- 有参数滤镜与组合参数滤镜 -->
          <div>
            <div
              class="filter-item has-params"
              v-for="item in [...paramsFilters, ...combinationFilters]"
              :key="item.type"
            >
              <Checkbox v-model="item.status" @on-change="changeFiltersByParams(item.type)">
                {{ $t('filters.' + item.type) }}
              </Checkbox>
              <div v-if="item.status" class="content">
                <div class="content slider-box" v-for="info in item.params" :key="info">
                  <div v-if="info.uiType === uiType.SELECT">
                    <RadioGroup v-model="info.value" @on-change="changeFiltersByParams(item.type)">
                      <Radio :label="listItem" v-for="listItem in info.list" :key="listItem">
                        {{ $t('filters.' + item.type + 'List.' + listItem) }}
                      </Radio>
                    </RadioGroup>
                  </div>
                  <div v-if="info.uiType === uiType.NUMBER">
                    <Slider
                      v-model="info.value"
                      :max="info.max"
                      :min="info.min"
                      :step="info.step"
                      @on-input="changeFiltersByParams(item.type)"
                    ></Slider>
                  </div>
                  <div v-if="info.uiType === uiType.COLOR">
                    <ColorPicker
                      v-model="info.value"
                      alpha
                      size="small"
                      @on-change="changeFiltersByParams(item.type)"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </template>
      </Panel>
    </Collapse>
  </div>
</template>

<script>
import select from '@/mixins/select';

// 无参数滤镜
const noParamsFilters = {
  BlackWhite: false,
  Brownie: false,
  Vintage: false,
  Kodachrome: false,
  technicolor: false,
  Polaroid: false,
  Invert: false,
  Sepia: false,
};

// UI类型
const uiType = {
  SELECT: 'select',
  COLOR: 'color',
  NUMBER: 'number',
};
// 有参数滤镜
const paramsFilters = [
  {
    type: 'Brightness',
    status: false,
    params: [
      {
        key: 'brightness',
        value: 0,
        uiType: uiType.NUMBER,
        min: -1,
        max: 1,
        step: 0.01,
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
        uiType: uiType.NUMBER,
        min: -1,
        max: 1,
        step: 0.01,
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
        uiType: uiType.NUMBER,
        min: -1,
        max: 1,
        step: 0.01,
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
        uiType: uiType.NUMBER,
        min: -1,
        max: 1,
        step: 0.01,
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
        uiType: uiType.NUMBER,
        min: -1,
        max: 1,
        step: 0.01,
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
        uiType: uiType.NUMBER,
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
        value: 0.01,
        uiType: uiType.NUMBER,
        min: 0.01,
        max: 100,
        step: 0.01,
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
        uiType: uiType.NUMBER,
        min: 0,
        max: 1,
        step: 0.01,
      },
    ],
  },
  {
    type: 'Grayscale',
    status: false,
    params: [
      {
        key: 'mode',
        value: 'average',
        uiType: uiType.SELECT,
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
        uiType: uiType.COLOR,
      },
      {
        key: 'distance',
        value: 0,
        uiType: uiType.NUMBER,
        min: 0,
        max: 1,
        step: 0.01,
      },
    ],
  },
];
// 组合式参数滤镜
const combinationFilters = [
  {
    type: 'Gamma',
    status: false,
    params: [
      {
        key: 'red',
        value: 0,
        uiType: uiType.NUMBER,
        min: 0.01,
        max: 2.2,
        step: 0.01,
      },
      {
        key: 'green',
        value: 0,
        uiType: uiType.NUMBER,
        min: 0.01,
        max: 2.2,
        step: 0.01,
      },
      {
        key: 'blue',
        value: 0,
        uiType: uiType.NUMBER,
        min: 0.01,
        max: 2.2,
        step: 0.01,
      },
    ],
    handler(red, green, blue) {
      return {
        gamma: [red, green, blue],
      };
    },
  },
];
export default {
  name: 'replaceImg',
  mixins: [select],
  inject: ['canvas', 'fabric'],
  data() {
    return {
      uiType,
      noParamsFilters,
      paramsFilters: [...paramsFilters],
      combinationFilters: [...combinationFilters],
    };
  },
  created() {
    this.event.on('selectOne', () => {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      if (activeObject) {
        this.type = activeObject.type;
        if (this.type === 'image') {
          // 无参数滤镜回显
          Object.keys(noParamsFilters).forEach((type) => {
            this.noParamsFilters[type] = !!this._getFilter(activeObject, type);
            this.$forceUpdate();
          });
          // 有参数滤镜回显
          paramsFilters.forEach((filterItem) => {
            const moduleInfo = this.paramsFilters.find((item) => item.type === filterItem.type);
            const filterInfo = this._getFilter(activeObject, filterItem.type);
            moduleInfo.status = !!filterInfo;
            moduleInfo.params.forEach((paramsItem) => {
              paramsItem.value = filterInfo ? filterInfo[paramsItem.key] : paramsItem.value;
            });
          });

          // 组合滤镜回显
          combinationFilters.forEach((filterItem) => {
            const moduleInfo = this.combinationFilters.find(
              (item) => item.type === filterItem.type
            );
            const filterInfo = this._getFilter(activeObject, filterItem.type);
            moduleInfo.status = !!filterInfo;
            // 不回显具体参数
          });
        }
        this.$forceUpdate();
      }
    });
  },
  methods: {
    // 图片地址拼接
    getImageUrl(name) {
      return new URL(`../assets/filters/${name}.png`, import.meta.url).href;
    },
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
    // 有参数与组合滤镜修改
    changeFiltersByParams(type) {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      const filtersAll = [...this.paramsFilters, ...this.combinationFilters];
      const moduleInfo = filtersAll.find((item) => item.type === type);
      if (moduleInfo.status) {
        // 组合参数滤镜修改
        if (moduleInfo.handler) {
          this._changeAttrByHandler(moduleInfo);
        } else {
          // 有参数滤镜修改
          moduleInfo.params.forEach((paramsItem) => {
            this._changeAttr(type, paramsItem.key, paramsItem.value);
          });
        }
      } else {
        this._removeFilter(activeObject, type);
      }
    },
    // 设置滤镜值
    _changeAttr(type, key, value) {
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
    _changeAttrByHandler(moduleInfo) {
      const activeObject = this.canvas.c.getActiveObjects()[0];
      // 删除
      this._removeFilter(activeObject, moduleInfo.type);
      // 创建
      const params = moduleInfo.params.map((item) => item.value);
      this._createFilter(activeObject, moduleInfo.type, moduleInfo.handler(...params));
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

<style scoped lang="less">
.filter-box {
  overflow: hidden;
  .filter-item {
    float: left;
    cursor: pointer;
    width: 50%;
    margin-bottom: 10px;
    img {
      width: 90%;
      height: auto;
    }
  }
}
.has-params {
  display: inline-block;
  margin-bottom: 10px;
  width: 50%;
  .content {
    width: 90%;
  }
  cursor: none;
}
.box {
  margin-bottom: 12px;
}
</style>
