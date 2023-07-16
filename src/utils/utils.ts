/*
 * @Author: 秦少卫
 * @Date: 2022-09-05 22:21:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-04-06 22:44:49
 * @Description: 工具文件
 */

import FontFaceObserver from 'fontfaceobserver';
import { useClipboard, useFileDialog, useBase64 } from '@vueuse/core';
import { Message } from 'view-ui-plus';
import downloadjs from 'downloadjs';

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
 * @description: 前端下载文件
 * @param { String } file 文件：网络地址/base64/blod
 * @param { String } fileName 文件名字
 * @param { String } fileExt 文件后缀名
 * @param { String } strMimeType MIME content-type
 */
interface IDownLoadFile {
  file: string;
  fileName?: string | undefined;
  fileExt?: string | undefined;
  strMimeType?: string | undefined;
}
export function downloadFile({ file, fileName, fileExt, strMimeType }: IDownLoadFile) {
  if (!file) throw new Error('file is undefined');
  const reg = /(http|https):\/\/([\w.]+\/?)\S*/;
  const outFileName = fileName ? `${fileName}.${fileExt}` : '';
  // download netword file
  if (reg.test(file)) {
    if (fileName && !fileExt) throw new Error('fileExt is undefined');
    return downloadjs(file, outFileName);
  } else {
    return downloadjs(file, outFileName, strMimeType);
  }
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
