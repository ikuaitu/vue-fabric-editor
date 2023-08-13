import { execa } from 'execa';
import ora from 'ora';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';
import inquirer from 'inquirer';

const dirname = fileURLToPath(import.meta.url);
const pkgPath = path.resolve(dirname, '../package.json');
const buildMainJsPath = './dist/fabric-editor-core.umd.js';
const tsMainPath = './index.ts';

async function handlePublish() {
  const spinner = ora('开始执行npm publish发布npm包').start();
  let pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  try {
    pkg.main = buildMainJsPath;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
    await execa('npm', ['publish'], { stdio: 'inherit' });
    pkg.main = tsMainPath;
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
    spinner.succeed('脚本完成');
  } catch (error) {
    pkg.main = './index.ts';
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf-8');
    spinner.fail(`构建失败: ${error}`);
  }
}

async function handleTask() {
  const { result } = await inquirer.prompt([
    {
      type: 'list',
      message: '是否需要打包:',
      name: 'result',
      choices: [
        {
          key: '1',
          name: '执行build',
          value: 'build',
        },
        {
          key: '2',
          name: '不执行build',
          value: 'notBuild',
        },
      ],
    },
  ]);

  switch (result) {
    case 'build':
      await execa('pnpm', ['build'], { stdio: 'inherit', tdio: 'inherit' });
      handlePublish();
      break;
    case 'notBuild':
      handlePublish();
      break;
    default:
      break;
  }
}

handleTask();
