import { log, Message,Room } from "wechaty";
const https = require('https');

export async function xcpcContest(message: Message) {
    if (message.self()) {
        return;
    }
    if (message.text().indexOf("近期比赛") == 0 || message.text().indexOf("最近比赛") == 0) {
        let days = parseInt(message.text().substring(4));
        if (isNaN(days)) {
            days = 1;
        }
        let msg = "";
        https.get("https://contests.sdutacm.cn/contests.json", (res: any) => {
            res.on('data', (contests) => {
                contests = JSON.parse(contests);
                let now = new Date();
                let to = new Date();
                to.setDate(to.getDate() + days + 1);
                to.setHours(0);
                to.setMinutes(0);
                to.setSeconds(0);
                to.setMilliseconds(0);
                for (let i = 0; i < contests.length; i++) {
                    let start = new Date(contests[i].start_time);
                    let end = new Date(contests[i].end_time);
                    if (start <= to && start >= now) {
                        if (contests[i].name.indexOf(contests[i].source) !== -1)
                            msg += "\n" + contests[i].name + "\n";
                        else
                            msg += "\n" + contests[i].source + ": " + contests[i].name + "\n";
                        msg += "开始：" + start.toLocaleString() + "\n";
                        msg += "结束：" + end.toLocaleString() + "\n";
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
                log.silly("[XCPC Contest]", `send message: ${msg}`);
            });
        }).on('error', (e: any) => {
            console.error(e);
            msg = "获取比赛信息失败喵！";
            message.say(msg);
            log.info("[XCPC Contest]", `send message: ${msg}`);
        });
    }
}

export async function sendXcpcContestToday(room: Room) {
    let msg = "";
    https.get("https://contests.sdutacm.cn/contests.json", (res: any) => {
        res.on('data', (contests) => {
            let days = 1;
            contests = JSON.parse(contests);
            let now = new Date();
            let to = new Date();
            to.setDate(to.getDate() + days + 1);
            to.setHours(0);
            to.setMinutes(0);
            to.setSeconds(0);
            to.setMilliseconds(0);
            for (let i = 0; i < contests.length; i++) {
                let start = new Date(contests[i].start_time);
                let end = new Date(contests[i].end_time);
                if (start <= to && start >= now) {
                    if (contests[i].name.indexOf(contests[i].source) !== -1)
                        msg += "\n" + contests[i].name + "\n";
                    else
                        msg += "\n" + contests[i].source + ": " + contests[i].name + "\n";
                    msg += "开始：" + start.toLocaleString() + "\n";
                    msg += "结束：" + end.toLocaleString() + "\n";
                    msg += "链接：" + contests[i].link + "\n";
                }
            }
            if (msg == "") {
                msg = `最近${days}天的比赛，暂无喵！`;
            }
            else {
                msg = `最近${days}天的比赛：\n` + msg;
            }
            room.say(msg);
            log.silly("[XCPC Contest]", `send message: ${msg}`);
        });
    }).on('error', (e: any) => {
        console.error(e);
        msg = "获取比赛信息失败喵！";
        room.say(msg);
        log.info("[XCPC Contest]", `send message: ${msg}`);
    });
}
