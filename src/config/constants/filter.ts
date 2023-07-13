// UI类型
export const uiType = {
  SELECT: 'select',
  COLOR: 'color',
  NUMBER: 'number',
};

// 有参数滤镜
export const paramsFilters = [
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
export const combinationFilters = [
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
    handler(red: number | string, green: number | string, blue: number | string) {
      return {
        gamma: [red, green, blue],
      };
    },
  },
];
