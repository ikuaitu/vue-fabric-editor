/*
 * @Author: 秦少卫
 * @Date: 2022-09-05 22:21:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-07-29 21:30:41
 * @Description: 工具文件
 */

import FontFaceObserver from 'fontfaceobserver';
import { useClipboard, useFileDialog, useBase64 } from '@vueuse/core';
import { Message } from 'view-ui-plus';

interface Font {
  type: string;
  fontFamily: string;
}

/**
 * @description: 图片文件转字符串
 * @param {Blob|File} file 文件
 * @return {String}
 */
export function getImgStr(file: File | Blob): Promise<FileReader['result']> {
  return useBase64(file).promise.value;
}

/**
 * @description: 根据json模板下载字体文件
 * @param {String} str
 * @return {Promise}
 */
export function downFontByJSON(str: string) {
  const skipFonts = ['arial', 'Microsoft YaHei'];
  const fontFamilies: string[] = JSON.parse(str)
    .objects.filter(
      (item: Font) =>
        // 为text 并且不为包含字体
        // eslint-disable-next-line implicit-arrow-linebreak
        item.type.includes('text') && !skipFonts.includes(item.fontFamily)
    )
    .map((item: Font) => item.fontFamily);
  const fontFamiliesAll = fontFamilies.map((fontName) => {
    const font = new FontFaceObserver(fontName);
    return font.load(null, 150000);
  });
  return Promise.all(fontFamiliesAll);
}

/**
 * @description: 选择文件
 * @param {Object} options accept = '', capture = '', multiple = false
 * @return {Promise}
 */
export function selectFiles(options: {
  accept?: string;
  capture?: string;
  multiple?: boolean;
}): Promise<FileList | null> {
  return new Promise((resolve) => {
    const { onChange, open } = useFileDialog(options);
    onChange((files) => {
      resolve(files);
    });
    open();
  });
}

/**
 * @description: 创建图片元素
 * @param {String} str 图片地址或者base64图片
 * @return {Promise} element 图片元素
 */
export function insertImgFile(str: string) {
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

/**
 * Copying text to the clipboard
 * @param source Copy source
 * @param options Copy options
 * @returns Promise that resolves when the text is copied successfully, or rejects when the copy fails.
 */
export const clipboardText = async (
  source: string,
  options?: Parameters<typeof useClipboard>[0]
) => {
  try {
    await useClipboard({ source, ...options }).copy();
    Message.success('复制成功');
  } catch (error) {
    Message.error('复制失败');
    throw error;
  }
};
