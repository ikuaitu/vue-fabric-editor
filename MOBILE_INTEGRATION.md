# Mobile Integration Guide

This document describes the mobile integration features added to Vue Fabric Editor as part of Issue #556.

## Overview

The mobile integration includes four main components:

1. **Mobile Viewport Meta Tags** - Proper mobile browser configuration
2. **Responsive CSS** - Adaptive layouts for different screen sizes
3. **Touch Event Support** - Native touch gesture handling
4. **Mobile Toolbar** - Touch-optimized UI component

## Features

### 1. Mobile Viewport Meta Tags

Located in: `index.html`

**Features:**
- Responsive viewport configuration
- PWA-ready meta tags
- iOS home screen support
- Theme color for light/dark mode
- Format detection disabled (prevents auto-linking)
- Safe area support for notched devices

**Benefits:**
- Better mobile browser experience
- Can be added to home screen
- Proper scaling on all devices
- No unwanted auto-formatting

### 2. Responsive CSS

Located in: `src/styles/mobile-responsive.less`

**Breakpoints:**
- Small Mobile: < 480px
- Mobile: 480px - 767px
- Tablet: 768px - 1024px
- Desktop: > 1024px

**Features:**
- Adaptive container widths
- Responsive canvas sizing
- Touch-friendly button sizes (44px minimum)
- Landscape orientation support
- Safe area insets for notched devices
- Performance optimizations
- Print styles

**Usage:**
Automatically applied via `src/styles/index.less` import.

### 3. Touch Event Support

Located in: `src/utils/touchEvents.ts` and `src/hooks/useTouchEvents.ts`

**Supported Gestures:**
- **Tap** - Single touch
- **Double Tap** - Quick succession taps
- **Long Press** - 500ms hold
- **Swipe** - Left, right, up, down
- **Pinch Zoom** - Two-finger scale
- **Rotate** - Two-finger rotation

**Usage Example:**

```typescript
import { useTouchEvents } from '@/hooks/useTouchEvents';

const canvasRef = ref<HTMLElement | null>(null);

useTouchEvents(canvasRef, {
  onTap: (point) => {
    console.log('Tapped at:', point.x, point.y);
  },
  onDoubleTap: (point) => {
    console.log('Double tapped at:', point.x, point.y);
  },
  onLongPress: (point) => {
    console.log('Long pressed at:', point.x, point.y);
  },
  onSwipe: (event) => {
    console.log('Swiped:', event.direction, event.distance);
  },
  onPinch: (event) => {
    console.log('Pinched:', event.scale);
  },
  onRotate: (event) => {
    console.log('Rotated:', event.angle);
  },
});
```

**Direct Usage:**

```typescript
import TouchEventHandler from '@/utils/touchEvents';

const element = document.getElementById('canvas');
const handler = new TouchEventHandler(element);

handler.on('tap', (point) => {
  console.log('Tap at', point);
});

handler.on('pinch', (event) => {
  console.log('Pinch scale', event.scale);
});

// Cleanup
handler.destroy();
```

**Configuration:**

```typescript
handler.setConfig({
  doubleTapDelay: 300,      // ms
  longPressDelay: 500,      // ms
  swipeThreshold: 50,       // px
  swipeVelocityThreshold: 0.3, // px/ms
  pinchThreshold: 10,       // px
  rotateThreshold: 5,       // degrees
});
```

### 4. Mobile Toolbar

Located in: `src/components/MobileToolbar.vue`

**Features:**
- Floating action button (FAB)
- Bottom sheet design
- Touch-optimized buttons (44px minimum)
- Smooth animations
- Backdrop overlay
- Safe area support
- Landscape orientation support

**Sections:**
- **Quick Actions**: Undo, Redo, Delete, Copy
- **Add Elements**: Text, Rectangle, Circle, Image
- **Tools**: Zoom In, Zoom Out, Fit Screen, Reset
- **Export**: PNG, JPG, SVG, Save

**Usage Example:**

```vue
<template>
  <div>
    <MobileToolbar
      :can-undo="canUndo"
      :can-redo="canRedo"
      :has-selection="hasSelection"
      @undo="handleUndo"
      @redo="handleRedo"
      @delete="handleDelete"
      @copy="handleCopy"
      @add-text="handleAddText"
      @add-shape="handleAddShape"
      @add-image="handleAddImage"
      @zoom-in="handleZoomIn"
      @zoom-out="handleZoomOut"
      @fit-screen="handleFitScreen"
      @reset="handleReset"
      @export="handleExport"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
import MobileToolbar from '@/components/MobileToolbar.vue';
import { ref } from 'vue';

const canUndo = ref(false);
const canRedo = ref(false);
const hasSelection = ref(false);

const handleUndo = () => {
  // Undo logic
};

const handleAddShape = (shape: string) => {
  // Add shape logic
};

const handleExport = (format: string) => {
  // Export logic
};
</script>
```

**Props:**
- `canUndo` (boolean) - Enable/disable undo button
- `canRedo` (boolean) - Enable/disable redo button
- `hasSelection` (boolean) - Enable/disable selection-dependent buttons

**Events:**
- `@undo` - Undo action
- `@redo` - Redo action
- `@delete` - Delete selection
- `@copy` - Copy selection
- `@add-text` - Add text element
- `@add-shape` - Add shape (rect, circle)
- `@add-image` - Add image
- `@zoom-in` - Zoom in
- `@zoom-out` - Zoom out
- `@fit-screen` - Fit to screen
- `@reset` - Reset canvas
- `@export` - Export (png, jpg, svg)
- `@save` - Save project

## Browser Support

- **iOS Safari**: 12+
- **Chrome Mobile**: 80+
- **Firefox Mobile**: 80+
- **Samsung Internet**: 12+
- **Edge Mobile**: 80+

## Testing

### Mobile Testing Checklist

- [ ] Viewport scales correctly on all devices
- [ ] Touch gestures work (tap, swipe, pinch, rotate)
- [ ] Toolbar appears only on mobile (< 768px)
- [ ] Buttons are touch-friendly (44px minimum)
- [ ] Landscape orientation works
- [ ] Safe area insets respected on notched devices
- [ ] No zoom on input focus
- [ ] Smooth scrolling with momentum
- [ ] Export functions work on mobile
- [ ] Performance is acceptable

### Testing Tools

1. **Chrome DevTools**: Device emulation
2. **Firefox Responsive Design Mode**: Device testing
3. **BrowserStack**: Real device testing
4. **Physical Devices**: iOS and Android

## Performance Considerations

1. **Reduced Animations**: Animations are shortened on mobile (0.2s)
2. **Hardware Acceleration**: `transform: translateZ(0)` for canvas
3. **Passive Event Listeners**: Used where possible
4. **Touch Action**: `touch-action: none` prevents default behaviors
5. **Debouncing**: Resize events are debounced

## Accessibility

1. **Touch Target Size**: Minimum 44x44px
2. **Focus Indicators**: 2px outline on focus
3. **ARIA Labels**: Added to toolbar buttons
4. **Contrast**: Improved for mobile readability
5. **Line Height**: 1.6 for better readability

## Future Enhancements

Potential improvements for future PRs:

1. **Gesture Customization**: Allow users to customize gestures
2. **Haptic Feedback**: Vibration on touch interactions
3. **Offline Support**: PWA with service worker
4. **Mobile Templates**: Pre-made mobile-optimized templates
5. **Voice Commands**: Voice-based editing
6. **AR Preview**: View designs in AR on mobile

## Contributing

When adding mobile features:

1. Test on real devices
2. Follow touch target size guidelines (44px minimum)
3. Use passive event listeners when possible
4. Consider landscape orientation
5. Support safe area insets
6. Add to this documentation

## License

Same as the main project (MIT).

## Credits

Mobile integration implemented as part of Issue #556.
