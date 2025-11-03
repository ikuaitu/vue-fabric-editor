<template>
  <div v-if="isMobile" class="mobile-toolbar" :class="{ 'toolbar-expanded': isExpanded }">
    <!-- Toolbar Toggle Button -->
    <button class="toolbar-toggle" @click="toggleToolbar" aria-label="Toggle toolbar">
      <i :class="isExpanded ? 'ivu-icon ivu-icon-ios-close' : 'ivu-icon ivu-icon-ios-menu'"></i>
    </button>

    <!-- Toolbar Content -->
    <transition name="slide-up">
      <div v-show="isExpanded" class="toolbar-content">
        <!-- Quick Actions -->
        <div class="toolbar-section">
          <h4 class="toolbar-title">Quick Actions</h4>
          <div class="toolbar-buttons">
            <button class="toolbar-btn" @click="handleUndo" :disabled="!canUndo">
              <i class="ivu-icon ivu-icon-ios-undo"></i>
              <span>Undo</span>
            </button>
            <button class="toolbar-btn" @click="handleRedo" :disabled="!canRedo">
              <i class="ivu-icon ivu-icon-ios-redo"></i>
              <span>Redo</span>
            </button>
            <button class="toolbar-btn" @click="handleDelete" :disabled="!hasSelection">
              <i class="ivu-icon ivu-icon-ios-trash"></i>
              <span>Delete</span>
            </button>
            <button class="toolbar-btn" @click="handleCopy" :disabled="!hasSelection">
              <i class="ivu-icon ivu-icon-ios-copy"></i>
              <span>Copy</span>
            </button>
          </div>
        </div>

        <!-- Add Elements -->
        <div class="toolbar-section">
          <h4 class="toolbar-title">Add Elements</h4>
          <div class="toolbar-buttons">
            <button class="toolbar-btn" @click="addText">
              <i class="ivu-icon ivu-icon-ios-text"></i>
              <span>Text</span>
            </button>
            <button class="toolbar-btn" @click="addShape('rect')">
              <i class="ivu-icon ivu-icon-ios-square-outline"></i>
              <span>Rectangle</span>
            </button>
            <button class="toolbar-btn" @click="addShape('circle')">
              <i class="ivu-icon ivu-icon-ios-radio-button-off"></i>
              <span>Circle</span>
            </button>
            <button class="toolbar-btn" @click="addImage">
              <i class="ivu-icon ivu-icon-ios-image"></i>
              <span>Image</span>
            </button>
          </div>
        </div>

        <!-- Tools -->
        <div class="toolbar-section">
          <h4 class="toolbar-title">Tools</h4>
          <div class="toolbar-buttons">
            <button class="toolbar-btn" @click="handleZoomIn">
              <i class="ivu-icon ivu-icon-ios-add-circle-outline"></i>
              <span>Zoom In</span>
            </button>
            <button class="toolbar-btn" @click="handleZoomOut">
              <i class="ivu-icon ivu-icon-ios-remove-circle-outline"></i>
              <span>Zoom Out</span>
            </button>
            <button class="toolbar-btn" @click="handleFitScreen">
              <i class="ivu-icon ivu-icon-ios-expand"></i>
              <span>Fit Screen</span>
            </button>
            <button class="toolbar-btn" @click="handleReset">
              <i class="ivu-icon ivu-icon-ios-refresh"></i>
              <span>Reset</span>
            </button>
          </div>
        </div>

        <!-- Export -->
        <div class="toolbar-section">
          <h4 class="toolbar-title">Export</h4>
          <div class="toolbar-buttons">
            <button class="toolbar-btn" @click="handleExport('png')">
              <i class="ivu-icon ivu-icon-ios-download"></i>
              <span>PNG</span>
            </button>
            <button class="toolbar-btn" @click="handleExport('jpg')">
              <i class="ivu-icon ivu-icon-ios-download"></i>
              <span>JPG</span>
            </button>
            <button class="toolbar-btn" @click="handleExport('svg')">
              <i class="ivu-icon ivu-icon-ios-download"></i>
              <span>SVG</span>
            </button>
            <button class="toolbar-btn" @click="handleSave">
              <i class="ivu-icon ivu-icon-ios-cloud-upload"></i>
              <span>Save</span>
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- Overlay -->
    <div v-show="isExpanded" class="toolbar-overlay" @click="closeToolbar"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';

// Props
interface Props {
  canUndo?: boolean;
  canRedo?: boolean;
  hasSelection?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  canUndo: false,
  canRedo: false,
  hasSelection: false,
});

// Emits
const emit = defineEmits<{
  undo: [];
  redo: [];
  delete: [];
  copy: [];
  addText: [];
  addShape: [shape: string];
  addImage: [];
  zoomIn: [];
  zoomOut: [];
  fitScreen: [];
  reset: [];
  export: [format: string];
  save: [];
}>();

// State
const isMobile = ref(false);
const isExpanded = ref(false);

// Computed
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

// Methods
const toggleToolbar = () => {
  isExpanded.value = !isExpanded.value;
  if (isExpanded.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

const closeToolbar = () => {
  isExpanded.value = false;
  document.body.style.overflow = '';
};

const handleUndo = () => emit('undo');
const handleRedo = () => emit('redo');
const handleDelete = () => {
  emit('delete');
  closeToolbar();
};
const handleCopy = () => {
  emit('copy');
  closeToolbar();
};
const addText = () => {
  emit('addText');
  closeToolbar();
};
const addShape = (shape: string) => {
  emit('addShape', shape);
  closeToolbar();
};
const addImage = () => {
  emit('addImage');
  closeToolbar();
};
const handleZoomIn = () => emit('zoomIn');
const handleZoomOut = () => emit('zoomOut');
const handleFitScreen = () => {
  emit('fitScreen');
  closeToolbar();
};
const handleReset = () => {
  emit('reset');
  closeToolbar();
};
const handleExport = (format: string) => {
  emit('export', format);
  closeToolbar();
};
const handleSave = () => {
  emit('save');
  closeToolbar();
};

// Lifecycle
onMounted(() => {
  checkMobile();
  window.addEventListener('resize', checkMobile);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile);
  document.body.style.overflow = '';
});
</script>

<style scoped lang="less">
.mobile-toolbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  display: none;

  @media only screen and (max-width: 767px) {
    display: block;
  }
}

.toolbar-toggle {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #2d8cf0;
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  z-index: 1002;
  transition: all 0.3s ease;

  &:active {
    transform: scale(0.95);
  }

  i {
    font-size: 28px;
  }
}

.toolbar-content {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: white;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.2);
  max-height: 80vh;
  overflow-y: auto;
  z-index: 1001;
  padding: 20px;
  padding-bottom: calc(20px + env(safe-area-inset-bottom));
  -webkit-overflow-scrolling: touch;
}

.toolbar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
}

.toolbar-section {
  margin-bottom: 24px;

  &:last-child {
    margin-bottom: 0;
  }
}

.toolbar-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.toolbar-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.toolbar-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  background: #f6f7f9;
  border: 1px solid #e8eaec;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  min-height: 70px;
  font-size: 12px;
  color: #333;

  &:active {
    transform: scale(0.95);
    background: #e8eaec;
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  i {
    font-size: 24px;
    margin-bottom: 6px;
    color: #2d8cf0;
  }

  span {
    font-size: 11px;
    text-align: center;
    line-height: 1.2;
  }
}

/* Animations */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.slide-up-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Landscape adjustments */
@media only screen and (max-width: 767px) and (orientation: landscape) {
  .toolbar-content {
    max-height: 90vh;
  }

  .toolbar-buttons {
    grid-template-columns: repeat(6, 1fr);
  }

  .toolbar-btn {
    min-height: 60px;
    padding: 8px 6px;

    i {
      font-size: 20px;
      margin-bottom: 4px;
    }

    span {
      font-size: 10px;
    }
  }
}

/* Small screens */
@media only screen and (max-width: 479px) {
  .toolbar-buttons {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .toolbar-btn {
    min-height: 65px;
  }
}
</style>
