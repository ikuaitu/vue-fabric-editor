/*
 * @Author: 秦少卫
 * @Date: 2023-02-03 23:29:34
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-04-10 22:37:05
 * @Description: 核心入口文件
 */
import Editor from './Editor';
import DringPlugin from './plugin/DringPlugin';
import AlignGuidLinePlugin from './plugin/AlignGuidLinePlugin';
import ControlsPlugin from './plugin/ControlsPlugin';
import ControlsRotatePlugin from './plugin/ControlsRotatePlugin';
import CenterAlignPlugin from './plugin/CenterAlignPlugin';
import LayerPlugin from './plugin/LayerPlugin';
import CopyPlugin from './plugin/CopyPlugin';
import MoveHotKeyPlugin from './plugin/MoveHotKeyPlugin';
import DeleteHotKeyPlugin from './plugin/DeleteHotKeyPlugin';
import GroupPlugin from './plugin/GroupPlugin';
import DrawLinePlugin from './plugin/DrawLinePlugin';
import GroupTextEditorPlugin from './plugin/GroupTextEditorPlugin';
import GroupAlignPlugin from './plugin/GroupAlignPlugin';
import WorkspacePlugin from './plugin/WorkspacePlugin';
import DownFontPlugin from './plugin/DownFontPlugin';
import HistoryPlugin from './plugin/HistoryPlugin';
import FlipPlugin from './plugin/FlipPlugin';
import RulerPlugin from './plugin/RulerPlugin';
import MaterialPlugin from './plugin/MaterialPlugin';
import EventType from './eventType';
import Utils from './utils/utils';

export {
  DringPlugin,
  AlignGuidLinePlugin,
  ControlsPlugin,
  ControlsRotatePlugin,
  CenterAlignPlugin,
  LayerPlugin,
  CopyPlugin,
  MoveHotKeyPlugin,
  DeleteHotKeyPlugin,
  GroupPlugin,
  DrawLinePlugin,
  GroupTextEditorPlugin,
  GroupAlignPlugin,
  WorkspacePlugin,
  DownFontPlugin,
  HistoryPlugin,
  FlipPlugin,
  RulerPlugin,
  MaterialPlugin,
  EventType,
  Utils,
};
export default Editor;
