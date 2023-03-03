/*
 * @Author: 秦少卫
 * @Date: 2022-09-05 22:21:55
 * @LastEditors: 秦少卫
 * @LastEditTime: 2023-02-09 12:59:35
 * @Description: 工具文件
 */

/**
 * @description: 图片文件转字符串
 * @param {Blob|File} file 文件
 * @return {String}
 */
export function getImgStr(file:Blob) {
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


