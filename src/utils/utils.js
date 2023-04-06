/*
 * @Author: 秦少卫
 * @Date: 2022-09-05 22:21:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-06 22:44:49
 * @Description: 工具文件
 */

import FontFaceObserver from 'fontfaceobserver';

/**
 * @description: 图片文件转字符串
 * @param {Blob|File} file 文件
 * @return {String}
 */
export function getImgStr(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * @description: 根据json模板下载字体文件
 * @param {String} str
 * @return {Promise}
 */
export function downFontByJSON(str) {
  const skipFonts = ['arial', 'Microsoft YaHei'];
  const fontFamilys = JSON.parse(str)
    .objects.filter(
      (item) =>
        // 为text 并且不为包含字体
        // eslint-disable-next-line implicit-arrow-linebreak
        item.type.includes('text') && !skipFonts.includes(item.fontFamily)
    )
    .map((item) => item.fontFamily);
  const fontFamilysAll = fontFamilys.map((fontName) => {
    const font = new FontFaceObserver(fontName);
    return font.load(null, 150000);
  });
  return Promise.all(fontFamilysAll);
}

/**
 * @description: 选择文件
 * @param {Object} options accept = '', capture = false, multiple = false
 * @return {Promise}
 */
export function selectFiles(options) {
  const createInputFile = ({ accept = '', capture = false, multiple = false }) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = accept;
    input.capture = capture;
    input.multiple = multiple;
    return input;
  };
  return new Promise((resolve) => {
    const input = createInputFile(options);

    input.addEventListener('change', () => resolve(input.files || null));

    setTimeout(() => {
      const event = new MouseEvent('click');
      input.dispatchEvent(event);
    }, 0);
  });
}

/**
 * @description: 前端下载文件
 * @param {String} fileStr
 * @param {String} fileType
 */
export function downFile(fileStr, fileName) {
  const anchorEl = document.createElement('a');
  anchorEl.href = fileStr;
  anchorEl.download = fileName;
  document.body.appendChild(anchorEl); // required for firefox
  anchorEl.click();
  anchorEl.remove();
}

/**
 * @description: 创建图片元素
 * @param {String} str 图片地址或者base64图片
 * @return {Promise} element 图片元素
 */
export function insertImgFile(str) {
  return new Promise((resolve) => {
    const imgEl = document.createElement('img');
    imgEl.src = str;
    // 插入页面
    document.body.appendChild(imgEl);
    imgEl.onload = () => {
      resolve(imgEl);
    };
  });
}
