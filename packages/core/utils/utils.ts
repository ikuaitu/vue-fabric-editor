/*
 * @Author: 秦少卫
 * @Date: 2022-09-05 22:21:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-15 10:34:55
 * @Description: 工具文件
 */
import { v4 as uuid } from 'uuid';
import { useClipboard, useFileDialog, useBase64 } from '@vueuse/core';

/**
 * @description: 图片文件转字符串
 * @param {Blob|File} file 文件
 * @return {String}
 */
export function getImgStr(file: File | Blob): Promise<FileReader['result']> {
  return useBase64(file).promise.value;
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
export const clipboardText = (source: string, options?: Parameters<typeof useClipboard>[0]) => {
  return useClipboard({ source, ...options }).copy();
};

export function downFile(fileStr: string, fileType: string) {
  const anchorEl = document.createElement('a');
  anchorEl.href = fileStr;
  anchorEl.download = `${uuid()}.${fileType}`;
  document.body.appendChild(anchorEl); // required for firefox
  anchorEl.click();
  anchorEl.remove();
}

export function drawImg(
  ctx: CanvasRenderingContext2D,
  left: number,
  top: number,
  img: HTMLImageElement,
  wSize: number,
  hSize: number,
  angle: number | undefined
) {
  if (angle === undefined) return;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(angle);
  ctx.drawImage(img, -wSize / 2, -hSize / 2, wSize, hSize);
  ctx.restore();
}

export function shiftAngle(start: fabric.Point, end: fabric.Point) {
  const startX = start.x;
  const startY = start.y;
  const x2 = end.x - startX;
  const y2 = end.y - startY;
  const r = Math.sqrt(x2 * x2 + y2 * y2);
  let angle = (Math.atan2(y2, x2) / Math.PI) * 180;
  angle = ~~(((angle + 7.5) % 360) / 15) * 15;

  const cosx = r * Math.cos((angle * Math.PI) / 180);
  const sinx = r * Math.sin((angle * Math.PI) / 180);

  return {
    x: cosx + startX,
    y: sinx + startY,
  };
}

/**
 * 类型工具
 */
export const isImage = (thing: unknown): thing is fabric.Image => {
  return thing instanceof fabric.Image;
};

export const isGroup = (thing: unknown): thing is fabric.Group => {
  return thing instanceof fabric.Group;
};

export const isIText = (thing: unknown): thing is fabric.IText => {
  return thing instanceof fabric.IText;
};

export const isActiveSelection = (thing: unknown): thing is fabric.ActiveSelection => {
  return thing instanceof fabric.ActiveSelection;
};

export function blobToBase64(blob: Blob) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => {
      resolve(reader.result);
    });
    reader.readAsDataURL(blob);
  });
}

export function base64ToBlob(base64Data: string) {
  if (!base64Data) {
    return null;
  }
  const dataArr = base64Data.split(',');
  const imageType = dataArr[0].match(/:(.*?);/)[1];
  const textData = window.atob(dataArr[1]);
  const arrayBuffer = new ArrayBuffer(textData.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  for (let i = 0; i < textData.length; i++) {
    uint8Array[i] = textData.charCodeAt(i);
  }
  return [new Blob([arrayBuffer], { type: imageType }), imageType.slice(6)];
}

export default {
  getImgStr,
  downFile,
  selectFiles,
  insertImgFile,
  clipboardText,
  drawImg,
  isImage,
  isGroup,
  isIText,
  isActiveSelection,
  blobToBase64,
  base64ToBlob,
};
