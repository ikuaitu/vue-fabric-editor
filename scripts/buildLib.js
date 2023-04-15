/*
 * @Author: June
 * @Description:
 * @Date: 2023-04-15 19:58:14
 * @LastEditors: June
 * @LastEditTime: 2023-04-16 02:07:39
 */
const execa = require('execa');
const ora = require('ora');
const fs = require('fs');
const path = require('path');
const CWD = process.cwd();

const LIST = ['../lib/ruler'];

// 检查是否有打包的dist, 没有的话就打包一个
async function buildLib() {
  const oraManage = ora().start('lib处理中。。。');
  oraManage.color = 'green';
  try {
    for await (let url of LIST) {
      const locationUrl = path.join(__dirname, url);
      if (fs.existsSync(`${locationUrl}/dist`)) {
        oraManage.succeed('lib无需处理');
      } else {
        await execa('pnpm', ['build'], { cwd: path.resolve(CWD, `${locationUrl}`) });
        console.log(2);
        oraManage.succeed('lib处理完成');
      }
    }
  } catch (error) {
    oraManage.fail('lib依赖处理失败');
    console.error(`失败原因：${error.toString()}`);
  }
}

buildLib();
