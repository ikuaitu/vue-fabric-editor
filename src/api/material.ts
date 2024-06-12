/*
 * @Author: 秦少卫
 * @Date: 2024-04-24 14:07:06
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-06-12 21:42:00
 * @Description: 用户接口登录
 */

import qs from 'qs';
import axios from 'axios';

const baseURL = import.meta.env.APP_APIHOST;

const instance = axios.create({ baseURL });

// web详情
export const getWebInfo = () => instance.get('/api/web-site?populate=*');

// 获取素材分类
export const getMaterialTypes = () => instance.get('/api/material-types');

// 获取素材列表
export const getMaterials = (data: any) => instance.get('/api/materials?' + data);

// 获取根据分类获取素材
export const getMaterialsByType = (data: any) =>
  instance.get('/api/materials?' + qs.stringify(data));

// 获取字体分类分类
export const getFontStyleTypes = () => instance.get('/api/font-style-types');

// 获取字体素材离别奥列表
export const getFontStyles = (data: any) => instance.get('/api/font-styles?' + data);

// 获取根据分类获取字体样式列表
export const getFontStyleListByType = (data: any) =>
  instance.get('/api/font-styles?' + qs.stringify(data));

// 获取字体分类分类
export const getTmplTypes = () => instance.get('/api/templ-types');
// 获取模板列表
export const getTmplList = (data: any) => instance.get('/api/templs?' + data);

// 获取banner
export const getBannerList = (data: any) => instance.get('/api/banners?' + data);
