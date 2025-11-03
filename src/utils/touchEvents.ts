/**
 * Touch Events Utility
 * Part of Issue #556 - Mobile Integration
 * 
 * Provides touch event handling for mobile devices
 * Supports: tap, double-tap, long-press, swipe, pinch-zoom, rotate
 */

export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeEvent {
  direction: 'left' | 'right' | 'up' | 'down';
  distance: number;
  velocity: number;
  duration: number;
}

export interface PinchEvent {
  scale: number;
  center: { x: number; y: number };
}

export interface RotateEvent {
  angle: number;
  center: { x: number; y: number };
}

export class TouchEventHandler {
  private element: HTMLElement;
  private touchStartPoint: TouchPoint | null = null;
  private touchStartPoints: TouchPoint[] = [];
  private lastTapTime: number = 0;
  private longPressTimer: number | null = null;
  private isPinching: boolean = false;
  private isRotating: boolean = false;
  private initialDistance: number = 0;
  private initialAngle: number = 0;

  // Configuration
  private config = {
    doubleTapDelay: 300, // ms
    longPressDelay: 500, // ms
    swipeThreshold: 50, // px
    swipeVelocityThreshold: 0.3, // px/ms
    pinchThreshold: 10, // px
    rotateThreshold: 5, // degrees
  };

  // Event callbacks
  private callbacks: {
    onTap?: (point: TouchPoint) => void;
    onDoubleTap?: (point: TouchPoint) => void;
    onLongPress?: (point: TouchPoint) => void;
    onSwipe?: (event: SwipeEvent) => void;
    onPinch?: (event: PinchEvent) => void;
    onRotate?: (event: RotateEvent) => void;
    onTouchStart?: (points: TouchPoint[]) => void;
    onTouchMove?: (points: TouchPoint[]) => void;
    onTouchEnd?: (points: TouchPoint[]) => void;
  } = {};

  constructor(element: HTMLElement) {
    this.element = element;
    this.init();
  }

  private init(): void {
    // Add touch event listeners
    this.element.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: false });
    this.element.addEventListener('touchmove', this.handleTouchMove.bind(this), { passive: false });
    this.element.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: false });
    this.element.addEventListener('touchcancel', this.handleTouchCancel.bind(this), { passive: false });

    // Prevent default touch behaviors
    this.element.style.touchAction = 'none';
  }

  private getTouchPoint(touch: Touch): TouchPoint {
    const rect = this.element.getBoundingClientRect();
    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
      timestamp: Date.now(),
    };
  }

  private getTouchPoints(touches: TouchList): TouchPoint[] {
    const points: TouchPoint[] = [];
    for (let i = 0; i < touches.length; i++) {
      points.push(this.getTouchPoint(touches[i]));
    }
    return points;
  }

  private getDistance(p1: TouchPoint, p2: TouchPoint): number {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  private getAngle(p1: TouchPoint, p2: TouchPoint): number {
    return Math.atan2(p2.y - p1.y, p2.x - p1.x) * (180 / Math.PI);
  }

  private getCenter(p1: TouchPoint, p2: TouchPoint): { x: number; y: number } {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  }

  private handleTouchStart(event: TouchEvent): void {
    event.preventDefault();

    const points = this.getTouchPoints(event.touches);
    this.touchStartPoints = points;

    if (points.length === 1) {
      this.touchStartPoint = points[0];

      // Start long press timer
      this.longPressTimer = window.setTimeout(() => {
        if (this.touchStartPoint && this.callbacks.onLongPress) {
          this.callbacks.onLongPress(this.touchStartPoint);
        }
      }, this.config.longPressDelay);
    } else if (points.length === 2) {
      // Initialize pinch/rotate
      this.isPinching = true;
      this.isRotating = true;
      this.initialDistance = this.getDistance(points[0], points[1]);
      this.initialAngle = this.getAngle(points[0], points[1]);
    }

    if (this.callbacks.onTouchStart) {
      this.callbacks.onTouchStart(points);
    }
  }

  private handleTouchMove(event: TouchEvent): void {
    event.preventDefault();

    // Clear long press timer on move
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const points = this.getTouchPoints(event.touches);

    if (points.length === 2 && this.touchStartPoints.length === 2) {
      // Handle pinch
      if (this.isPinching && this.callbacks.onPinch) {
        const currentDistance = this.getDistance(points[0], points[1]);
        const scale = currentDistance / this.initialDistance;
        const center = this.getCenter(points[0], points[1]);

        if (Math.abs(currentDistance - this.initialDistance) > this.config.pinchThreshold) {
          this.callbacks.onPinch({ scale, center });
        }
      }

      // Handle rotate
      if (this.isRotating && this.callbacks.onRotate) {
        const currentAngle = this.getAngle(points[0], points[1]);
        const angleDiff = currentAngle - this.initialAngle;
        const center = this.getCenter(points[0], points[1]);

        if (Math.abs(angleDiff) > this.config.rotateThreshold) {
          this.callbacks.onRotate({ angle: angleDiff, center });
          this.initialAngle = currentAngle;
        }
      }
    }

    if (this.callbacks.onTouchMove) {
      this.callbacks.onTouchMove(points);
    }
  }

  private handleTouchEnd(event: TouchEvent): void {
    event.preventDefault();

    // Clear long press timer
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    const points = this.getTouchPoints(event.changedTouches);

    if (this.touchStartPoint && points.length === 1) {
      const endPoint = points[0];
      const distance = this.getDistance(this.touchStartPoint, endPoint);
      const duration = endPoint.timestamp - this.touchStartPoint.timestamp;

      // Check for swipe
      if (distance > this.config.swipeThreshold) {
        const velocity = distance / duration;
        if (velocity > this.config.swipeVelocityThreshold && this.callbacks.onSwipe) {
          const dx = endPoint.x - this.touchStartPoint.x;
          const dy = endPoint.y - this.touchStartPoint.y;
          let direction: 'left' | 'right' | 'up' | 'down';

          if (Math.abs(dx) > Math.abs(dy)) {
            direction = dx > 0 ? 'right' : 'left';
          } else {
            direction = dy > 0 ? 'down' : 'up';
          }

          this.callbacks.onSwipe({ direction, distance, velocity, duration });
        }
      } else {
        // Check for tap or double tap
        const now = Date.now();
        const timeSinceLastTap = now - this.lastTapTime;

        if (timeSinceLastTap < this.config.doubleTapDelay && this.callbacks.onDoubleTap) {
          this.callbacks.onDoubleTap(endPoint);
          this.lastTapTime = 0; // Reset to prevent triple tap
        } else {
          if (this.callbacks.onTap) {
            this.callbacks.onTap(endPoint);
          }
          this.lastTapTime = now;
        }
      }
    }

    // Reset pinch/rotate state
    this.isPinching = false;
    this.isRotating = false;

    if (this.callbacks.onTouchEnd) {
      this.callbacks.onTouchEnd(points);
    }

    this.touchStartPoint = null;
    this.touchStartPoints = [];
  }

  private handleTouchCancel(event: TouchEvent): void {
    event.preventDefault();

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }

    this.isPinching = false;
    this.isRotating = false;
    this.touchStartPoint = null;
    this.touchStartPoints = [];
  }

  // Public API for setting callbacks
  public on(event: 'tap', callback: (point: TouchPoint) => void): void;
  public on(event: 'doubleTap', callback: (point: TouchPoint) => void): void;
  public on(event: 'longPress', callback: (point: TouchPoint) => void): void;
  public on(event: 'swipe', callback: (event: SwipeEvent) => void): void;
  public on(event: 'pinch', callback: (event: PinchEvent) => void): void;
  public on(event: 'rotate', callback: (event: RotateEvent) => void): void;
  public on(event: 'touchStart', callback: (points: TouchPoint[]) => void): void;
  public on(event: 'touchMove', callback: (points: TouchPoint[]) => void): void;
  public on(event: 'touchEnd', callback: (points: TouchPoint[]) => void): void;
  public on(event: string, callback: any): void {
    switch (event) {
      case 'tap':
        this.callbacks.onTap = callback;
        break;
      case 'doubleTap':
        this.callbacks.onDoubleTap = callback;
        break;
      case 'longPress':
        this.callbacks.onLongPress = callback;
        break;
      case 'swipe':
        this.callbacks.onSwipe = callback;
        break;
      case 'pinch':
        this.callbacks.onPinch = callback;
        break;
      case 'rotate':
        this.callbacks.onRotate = callback;
        break;
      case 'touchStart':
        this.callbacks.onTouchStart = callback;
        break;
      case 'touchMove':
        this.callbacks.onTouchMove = callback;
        break;
      case 'touchEnd':
        this.callbacks.onTouchEnd = callback;
        break;
    }
  }

  // Update configuration
  public setConfig(config: Partial<typeof this.config>): void {
    this.config = { ...this.config, ...config };
  }

  // Cleanup
  public destroy(): void {
    this.element.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    this.element.removeEventListener('touchmove', this.handleTouchMove.bind(this));
    this.element.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    this.element.removeEventListener('touchcancel', this.handleTouchCancel.bind(this));

    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
    }
  }
}

// Helper function to detect if device supports touch
export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    (navigator as any).msMaxTouchPoints > 0
  );
}

// Helper function to prevent default touch behaviors
export function preventDefaultTouch(element: HTMLElement): void {
  element.addEventListener('touchstart', (e) => e.preventDefault(), { passive: false });
  element.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false });
}

// Export default
export default TouchEventHandler;
