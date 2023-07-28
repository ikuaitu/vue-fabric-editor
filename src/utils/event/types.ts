/*
 * @Description: 自定义事件的类型
 */

// 选择模式
export enum SelectMode {
  EMPTY = '',
  ONE = 'one',
  MULTI = 'multiple',
}

export enum SelectOneType {
  EMPTY = '',
  GROUP = 'group',
  POLYGON = 'polygon',
}

// 选择事件（用于广播）
export enum SelectEvent {
  ONE = 'selectOne',
  MULTI = 'selectMultiple',
  CANCEL = 'selectCancel',
}
