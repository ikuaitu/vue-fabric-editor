import { beforeEach, expect, test } from 'vitest';
import { createEditor } from '../utils/setup.ts';

const { cleanUp } = createEditor();

beforeEach(() => {
  return cleanUp;
});

test('basic', () => {
  expect(window.editor).toBeDefined();
});
