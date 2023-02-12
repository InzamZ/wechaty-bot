import { log, Message, Room } from "wechaty";
const https = require('https');
import moment from "moment";

moment.locale("zh_CN")

export async function xcpcContest(message: Message) {
    if (message.self()) {
        return;
    }
    if (message.text().indexOf("近期比赛") == 0 || message.text().indexOf("今日比赛") == 0
        || message.text().indexOf("明日比赛") == 0 || message.text().indexOf("最近比赛") == 0) {
        let days = parseInt(message.text().substring(4));
        let from = moment().startOf('day').utcOffset(8);
        let to = moment().endOf('day').utcOffset(8);
        if (message.text() == "今日比赛") {
            from = moment().startOf('day').utcOffset(8);
            to = moment().endOf('day').utcOffset(8);
        }
        else if (message.text() == "明日比赛") {
            from = moment().add(1, 'days').startOf('day').utcOffset(8);
            to = moment().add(1, 'days').endOf('day').utcOffset(8);
        }
        else if (isNaN(days)) {
            days = 3;
            from = moment().startOf('day').utcOffset(8);
            to = moment().add(days, 'days').endOf('day').utcOffset(8);
        }
        else {
            from = moment().startOf('day').utcOffset(8);
            to = moment().add(days, 'days').endOf('day').utcOffset(8);
        }
        let msg = "";
        https.get("https://contests.sdutacm.cn/contests.json", (res: any) => {
            res.on('data', (contests) => {
                contests = JSON.parse(contests);
                for (let i = 0; i < contests.length; i++) {
                    let start = moment(contests[i].start_time).utcOffset(8);
                    let end = moment(contests[i].end_time).utcOffset(8);
                    if (start <= to && start >= from) {
                        if (contests[i].name.indexOf(contests[i].source) !== -1)
                            msg += "\n" + contests[i].name + "\n";
                        else
                            msg += "\n" + contests[i].source + ": " + contests[i].name + "\n";
                        msg += "开始：" + start.format('lll') + "\n";
                        msg += "结束：" + end.format('lll') + "\n";
                        msg += "链接：" + contests[i].link + "\n";
                    }
                }
                if (msg == "") {
                    msg = `最近${days}天的比赛，暂无喵！`;
                }
                else {
                    msg = `最近${days}天的比赛：\n` + msg;
                }
                message.say(msg);
                log.silly("[XCPC Contest]", `send message: ${msg.toString()}`);
            });
        }).on('error', (e: any) => {
            console.error(e);
            msg = "获取比赛信息失败喵！";
            message.say(msg);
            log.info("[XCPC Contest]", `send message: ${msg.toString()}`);
        });
    }
}

export async function sendXcpcContestToday(room: Room) {
    let msg = "";
    let from = moment().startOf('day').utcOffset(8);
    let to = moment().endOf('day').utcOffset(8);
    https.get("https://contests.sdutacm.cn/contests.json", (res: any) => {
        res.on('data', (contests) => {
            contests = JSON.parse(contests);
            for (let i = 0; i < contests.length; i++) {
                let start = moment(contests[i].start_time).utcOffset(8);
                let end = moment(contests[i].end_time).utcOffset(8);
                if (start <= to && start >= from) {
                    if (contests[i].name.indexOf(contests[i].source) !== -1)
                        msg += "\n" + contests[i].name + "\n";
                    else
                        msg += "\n" + contests[i].source + ": " + contests[i].name + "\n";
                    msg += "开始：" + start.format('lll') + "\n";
                    msg += "结束：" + end.format('lll') + "\n";
                    msg += "链接：" + contests[i].link + "\n";
                }
            }
            if (msg == "") {
                msg = `今天比赛暂无喵！`;
            }
            else {
                msg = `今天的比赛：\n` + msg;
            }
            room.say(msg);
            log.silly("[XCPC Contest]", `send message: ${msg.toString()}`);
        });
    }).on('error', (e: any) => {
        console.error(e);
        msg = "获取比赛信息失败喵！";
        room.say(msg);
        log.info("[XCPC Contest]", `send message: ${msg.toString()}`);
    });
}
