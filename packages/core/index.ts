/*
 * @Author: 秦少卫
 * @Date: 2023-02-03 23:29:34
 * @LastEditors: June
 * @LastEditTime: 2024-04-21 09:10:13
 * @Description: 核心入口文件
 */
import Editor from './Editor';
export { default as DringPlugin } from './plugin/DringPlugin';
export { default as AlignGuidLinePlugin } from './plugin/AlignGuidLinePlugin';
export { default as ControlsPlugin } from './plugin/ControlsPlugin';
export { default as ControlsRotatePlugin } from './plugin/ControlsRotatePlugin';
export { default as CenterAlignPlugin } from './plugin/CenterAlignPlugin';
export { default as LayerPlugin } from './plugin/LayerPlugin';
export { default as CopyPlugin } from './plugin/CopyPlugin';
export { default as MoveHotKeyPlugin } from './plugin/MoveHotKeyPlugin';
export { default as DeleteHotKeyPlugin } from './plugin/DeleteHotKeyPlugin';
export { default as GroupPlugin } from './plugin/GroupPlugin';
export { default as DrawLinePlugin } from './plugin/DrawLinePlugin';
export { default as GroupTextEditorPlugin } from './plugin/GroupTextEditorPlugin';
export { default as GroupAlignPlugin } from './plugin/GroupAlignPlugin';
export { default as WorkspacePlugin } from './plugin/WorkspacePlugin';
export { default as DownFontPlugin } from './plugin/DownFontPlugin';
export { default as HistoryPlugin } from './plugin/HistoryPlugin';
export { default as FlipPlugin } from './plugin/FlipPlugin';
export { default as RulerPlugin } from './plugin/RulerPlugin';
export { default as MaterialPlugin } from './plugin/MaterialPlugin';
export { default as WaterMarkPlugin } from './plugin/WaterMarkPlugin';
import EventType from './eventType';
import Utils from './utils/utils';

export { EventType, Utils };
export default Editor;
