import moment from "moment";
const TS_REG = /^[0-9]{8}$/;

interface VersionInfo {
    ts: string;
    version: string;
    description: string;
}

/**
 * 
 * @description 获取版本信息
 * @param list 
 * @returns 
 */
export const getVersionInfo = (list: string[]): VersionInfo => {
    if (list && list.length > 0) {
        const topList = list[0].split("-");
        const version = topList.splice(0, 1)[0];
        let ts = topList.splice(-1, 1)[0];
        let description = topList.join("-");
        if (!TS_REG.test(ts)) {
            if (ts) {
                topList.push(ts);
                description = topList.join("-");
            }
            ts = moment().format("YYYYMMDD");
        }
        return {
            ts,
            version,
            description,
        };
    }
}