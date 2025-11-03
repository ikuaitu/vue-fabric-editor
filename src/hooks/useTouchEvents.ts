/**
 * Vue Composable for Touch Events
 * Part of Issue #556 - Mobile Integration
 * 
 * Easy-to-use Vue 3 composable for touch event handling
 */

import { onMounted, onUnmounted, ref, Ref } from 'vue';
import TouchEventHandler, {
  TouchPoint,
  SwipeEvent,
  PinchEvent,
  RotateEvent,
  isTouchDevice,
} from '../utils/touchEvents';

export interface UseTouchEventsOptions {
  onTap?: (point: TouchPoint) => void;
  onDoubleTap?: (point: TouchPoint) => void;
  onLongPress?: (point: TouchPoint) => void;
  onSwipe?: (event: SwipeEvent) => void;
  onPinch?: (event: PinchEvent) => void;
  onRotate?: (event: RotateEvent) => void;
  onTouchStart?: (points: TouchPoint[]) => void;
  onTouchMove?: (points: TouchPoint[]) => void;
  onTouchEnd?: (points: TouchPoint[]) => void;
}

export function useTouchEvents(
  elementRef: Ref<HTMLElement | null>,
  options: UseTouchEventsOptions = {}
) {
  const touchHandler = ref<TouchEventHandler | null>(null);
  const isTouch = ref(isTouchDevice());

  onMounted(() => {
    if (elementRef.value && isTouch.value) {
      touchHandler.value = new TouchEventHandler(elementRef.value);

      // Register callbacks
      if (options.onTap) {
        touchHandler.value.on('tap', options.onTap);
      }
      if (options.onDoubleTap) {
        touchHandler.value.on('doubleTap', options.onDoubleTap);
      }
      if (options.onLongPress) {
        touchHandler.value.on('longPress', options.onLongPress);
      }
      if (options.onSwipe) {
        touchHandler.value.on('swipe', options.onSwipe);
      }
      if (options.onPinch) {
        touchHandler.value.on('pinch', options.onPinch);
      }
      if (options.onRotate) {
        touchHandler.value.on('rotate', options.onRotate);
      }
      if (options.onTouchStart) {
        touchHandler.value.on('touchStart', options.onTouchStart);
      }
      if (options.onTouchMove) {
        touchHandler.value.on('touchMove', options.onTouchMove);
      }
      if (options.onTouchEnd) {
        touchHandler.value.on('touchEnd', options.onTouchEnd);
      }
    }
  });

  onUnmounted(() => {
    if (touchHandler.value) {
      touchHandler.value.destroy();
    }
  });

  return {
    isTouch,
    touchHandler,
  };
}

// Export types
export type { TouchPoint, SwipeEvent, PinchEvent, RotateEvent };
