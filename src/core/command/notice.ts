import Robot from "dingtalk-robot-sdk";
import path from "path";

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
    const config = require(path.resolve(`./package.json`));
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