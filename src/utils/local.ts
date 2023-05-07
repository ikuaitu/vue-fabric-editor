/**
 * get localStorage 获取本地存储
 * @param { String } key
 */
export function getLocal(key: string) {
  if (!key) throw new Error('key is empty');
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

/**
 * set localStorage 设置本地存储
 * @param { String } key
 * @param value
 */
export function setLocal(key: string, value: unknown) {
  if (!key) throw new Error('key is empty');
  if (!value) return;
  return localStorage.setItem(key, JSON.stringify(value));
}

/**
 * remove localStorage 移除某个本地存储
 * @param { String } key
 */
export function removeLocal(key: string) {
  if (!key) throw new Error('key is empty');
  return localStorage.removeItem(key);
}

/**
 * clear localStorage 清除本地存储
 */
export function clearLocal() {
  return localStorage.clear();
}
