/*
 * @Author: 秦少卫
 * @Date: 2024-04-10 15:38:47
 * @LastEditors: 秦少卫
 * @LastEditTime: 2024-07-22 11:56:28
 * @Description: 类型文件
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
import MaskPlugin from './plugin/MaskPlugin';
import HistoryPlugin from './plugin/HistoryPlugin';
import FlipPlugin from './plugin/FlipPlugin';
import RulerPlugin from './plugin/RulerPlugin';
import MaterialPlugin from './plugin/MaterialPlugin';
import WaterMarkPlugin from './plugin/WaterMarkPlugin';
import FontPlugin from './plugin/FontPlugin';
import PolygonModifyPlugin from './plugin/PolygonModifyPlugin';
import DrawPolygonPlugin from './plugin/DrawPolygonPlugin';
import FreeDrawPlugin from './plugin/FreeDrawPlugin';
import PathTextPlugin from './plugin/PathTextPlugin';
import PsdPlugin from './plugin/PsdPlugin';
import SimpleClipImagePlugin from './plugin/SimpleClipImagePlugin';
import BarCodePlugin from './plugin/BarCodePlugin';
import QrCodePlugin from './plugin/QrCodePlugin';
import ImageStroke from './plugin/ImageStroke';
import ResizePlugin from './plugin/ResizePlugin';
import LockPlugin from './plugin/LockPlugin';
import AddBaseTypePlugin from './plugin/AddBaseTypePlugin';

const AllEditor = {
  Editor,
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
  MaskPlugin,
  HistoryPlugin,
  FlipPlugin,
  RulerPlugin,
  MaterialPlugin,
  WaterMarkPlugin,
  FontPlugin,
  PolygonModifyPlugin,
  DrawPolygonPlugin,
  FreeDrawPlugin,
  PathTextPlugin,
  PsdPlugin,
  SimpleClipImagePlugin,
  BarCodePlugin,
  QrCodePlugin,
  ImageStroke,
  ResizePlugin,
  LockPlugin,
  AddBaseTypePlugin,
};

declare type KuaituEditor = typeof AllEditor;

export default KuaituEditor;
