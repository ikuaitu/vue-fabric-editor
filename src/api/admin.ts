/*
 * @Author: 秦少卫
 * @Date: 2024-06-09 13:04:51
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-09 15:00:49
 * @Description: 管理员API
 */

import axios from 'axios';
const baseURL = import.meta.env.APP_ADMINAPIHOST;

const instance = axios.create({ baseURL });

instance.interceptors.request.use(function (config) {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `${token}`;
  }
  return config;
});

const tokenKey = 'AdminToken';
export function getToken() {
  const token = localStorage.getItem(tokenKey);
  return token;
}

export function setToken(token: string) {
  localStorage.setItem(tokenKey, token);
}

// 新增模板
export const createdTempl = (data: any) =>
  instance.post('/content-manager/collection-types/api::templ.templ', data);

// 更新模板
export const updataTempl = (id: any, data: any) =>
  instance.put(`/content-manager/collection-types/api::templ.templ/${id}`, data);

// 上传图片
export const uploadImg = (data: any) => instance.post('/upload', data);

// 更新图片
export const deleteImg = (id: string) => instance.delete('/upload/files/' + id);

// 获取详情
export const getTempl = (id: string) =>
  instance.get(`/content-manager/collection-types/api::templ.templ/${id}`);
