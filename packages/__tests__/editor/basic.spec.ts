import { beforeEach, expect, test } from 'vitest';
import { createEditor } from '../utils/setup.ts';

const { editor, cleanUp } = createEditor();

beforeEach(() => {
  return cleanUp;
});

test('basic', () => {
  expect(editor).toBeDefined();
});
