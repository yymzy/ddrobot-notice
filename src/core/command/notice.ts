import Robot from "dingtalk-robot-sender";
import path from "path";
import chalk from "chalk";
import { getVersionInfo } from "utils";

function Markdown() {
    this.text = '';
    this.title = '';
    this.items = [];
    this.setTitle = function (title) {
        this.title = title;
        return this;
    }
    this.add = function (text) {
        if (Array.isArray(text)) {
            this.items.concat(text);
        } else {
            this.items.push(text);
        }
        this.text = this.items.join('\n');
        return this;
    }
}

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
    const [stage, dd_access_token, dd_secret, message] = process.argv.slice(2);

    if (!stage || !dd_access_token || !dd_secret) {
        return;
    }

    const config = getConfig();

    // 钉钉机器人群通知
    const ddIns = new Robot({
        baseUrl: 'https://oapi.dingtalk.com/robot/send',
        accessToken: dd_access_token,
        secret: dd_secret
    });

    const stageMap = {
        test: '提测',
        deploy: '发布',
        deploy_rc: '灰度',
    };

    const markdownTitle = `${config.name}`.toUpperCase() + '：' + stageMap[stage];
    // @ts-ignore
    const content = new Markdown()
        .setTitle(markdownTitle)
        .add(`[${markdownTitle}](${config.git || ""})\n`)
        .add(`1. version：${config.version}`)
        .add(`2. description：${config.description}`)
    if (message) {
        content.add(`> git：${message}`);
    }
    // @ts-ignore
    ddIns.markdown(content.title, content.text).then(() => {
        console.log(chalk.green(`已发送钉钉通知!`));
    });
}

export default notice;