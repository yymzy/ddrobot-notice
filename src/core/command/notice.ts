import Robot from "dingtalk-robot-sdk";
import path from "path";
import chalk from "chalk";
import { getVersionInfo } from "utils";

/**
 * 
 * @description 获取配置
 * @returns 
 */
function getConfig() {
    const releaseFileName = 'release.json'
    let config = require(path.resolve(`./package.json`));
    try {
        const release = require(path.resolve(`./${releaseFileName}`));
        if (Array.isArray(release)) {
            config = {
                ...config,
                ...getVersionInfo(release)
            }
        }
    } catch (error) {
        console.log(chalk.yellow(`请在根目录配置：${releaseFileName}文件`));
    }
    return config;
}

/**
 * 
 * @description 通过钉钉群发送上传结果通知
 */
async function notice() {
    // @ts-ignore
    const [stage, dd_access_token, dd_secret] = process.argv.slice(2);
    if (!stage || !dd_access_token || !dd_secret) {
        return;
    }
    const config = getConfig();
    // 钉钉机器人群通知
    const ddrobot = new Robot({
        // @ts-ignore
        accessToken: dd_access_token,
        // @ts-ignore
        secret: dd_secret,
    });
    const stageMap = {
        test: '提测',
        deploy: '发布',
        deploy_rc: '灰度',
    };
    const markdownTitle = `${config.name}`.toUpperCase() + '：' + stageMap[stage];
    // @ts-ignore
    const markdown = new Robot.Markdown()
        .setTitle(markdownTitle)
        .add(`[${markdownTitle}](${config.git || ""})\n`)
        .add(`1. version：${config.version}`)
        .add(`2. description：${config.description}`);
    // @ts-ignore
    ddrobot.send(markdown);
}

export default notice;