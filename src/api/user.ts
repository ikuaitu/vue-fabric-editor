/*
 * @Author: 秦少卫
 * @Date: 2024-04-24 14:07:06
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-05-11 14:47:44
 * @Description: 用户接口登录
 */

import axios from 'axios';
const baseURL = import.meta.env.APP_APIHOST;

const instance = axios.create({ baseURL });

instance.interceptors.request.use(function (config) {
  const token = getToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

const tokenKey = 'token';
function getToken() {
  const token = localStorage.getItem(tokenKey);
  return token;
}

// 详情
export const getUserInfo = (data: any) => instance.get('/api/users/me', data);

// 登录
export const login = (data: any) => instance.post('/api/auth/local', data);

// 注册
export const register = (data: any) => instance.post('/api/auth/local/register', data);

// 登出
export const logout = () => localStorage.setItem(tokenKey, '');

// 设置token
export const setToken = (token: string) => localStorage.setItem(tokenKey, token);

// 获取个人素材列表
export const getFileList = (data: any) => instance.get('/api/user-materials?populate=*', data);

// 上传素材
export const uploadImg = (data: any) => instance.post('/api/upload', data);

// 创建素材
export const createdMaterial = (data: any) => instance.post('/api/user-materials', data);

// 删除素材
export const removeMaterial = (id: any) => instance.delete('/api/user-materials/' + id);

// 创建模板
export const createdTempl = (data: any) => instance.post('/api/user-templs', data);

// 删除素材
export const removeTempl = (data: any) => instance.delete(`/api/user-templs/${data}`);

// 更新素材
export const updataTempl = (id: any, data: any) => instance.put(`/api/user-templs/${id}`, data);

// 查询素材列表
export const getTmplList = (data: any) => instance.get(`/api/user-templs?${data}`);

// 查询素材列表
export const getTmplInfo = (data: any) => instance.get(`/api/user-templs/${data}`);
