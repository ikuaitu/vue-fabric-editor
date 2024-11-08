import type { IEditor } from '@kuaitu/core';
import { type InjectionKey } from 'vue';
import { fabric } from 'fabric';

export function createInjectionKey<T>(key: string): InjectionKey<T> {
  return key as any;
}

export const INJECT_CANVAS_EDITOR_KEY = createInjectionKey<IEditor>('canvasEditor');

export const INJECT_FABRIC_KEY = createInjectionKey<typeof fabric>('fabric');
