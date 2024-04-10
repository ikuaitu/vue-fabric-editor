/*
 * @Author: 秦少卫
 * @Date: 2024-04-10 14:00:05
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-10 14:01:39
 * @Description: 事件类型
 */
// 选择模式
export enum SelectMode {
  EMPTY = '',
  ONE = 'one',
  MULTI = 'multiple',
}

// 选择事件（用于广播）
export enum SelectEvent {
  ONE = 'selectOne',
  MULTI = 'selectMultiple',
  CANCEL = 'selectCancel',
}

export default { SelectMode, SelectEvent };
