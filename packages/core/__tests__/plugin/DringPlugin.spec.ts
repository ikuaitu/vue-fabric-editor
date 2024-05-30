import { beforeEach, expect, test } from 'vitest';
import { initPlugin } from '../utils/setup.ts';
import { DringPlugin } from '../../plugin/DringPlugin.ts';
import { wait, MouseDown } from '../utils/common.ts';
import { describe } from 'node:test';

describe('canvas:drag', async () => {
  const { pluginInstance, cleanUp } = initPlugin(DringPlugin);

  beforeEach(() => {
    return cleanUp;
  });
  test('dragMode is  true', async () => {
    const instance = pluginInstance as DringPlugin;
    instance.dragMode = true;
    const testCanvas = instance.canvas as ExtCanvas;
    testCanvas.lastPosX = 0;
    testCanvas.lastPosY = 0;
    MouseDown(testCanvas, { x: 50, y: 50 });
    await wait();
    expect([testCanvas.lastPosX, testCanvas.lastPosY]).toEqual([50, 50]);
  });

  test('dragMode is  false', async () => {
    pluginInstance.dragMode = false;
    const testCanvas = pluginInstance.canvas as ExtCanvas;
    testCanvas.lastPosX = 0;
    testCanvas.lastPosY = 0;
    MouseDown(testCanvas, { x: 50, y: 50 });
    await wait();
    expect([testCanvas.lastPosX, testCanvas.lastPosY]).toEqual([0, 0]);
  });
});
