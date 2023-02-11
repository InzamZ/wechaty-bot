import { Message, log } from "wechaty";
import { Config } from "../config";

var bot_config = new Config();

export async function keywordBot(message: Message) {
    log.silly("[KeywordBot]: ", `master: ${bot_config.master}`);
    if (message.text() === "在吗" || message.text() === "在嘛") {
        if (bot_config.master.indexOf(message.talker().id) !== -1) {
            log.silly("[KeywordBot]: ", `match master: ${message.talker().id}`);
            message.room().say("主人，我在！", message.talker())
            log.info("[KeywordBot]: ", `send message: 主人，我在！`)
        }
        else {
            log.silly("[KEYWORD BOT]: ", `dismatch master: ${message.talker().id}`);
            message.room().say("爪巴！", message.talker())
        }
    }
    else if (message.text().includes("亲亲") || message.text().includes("开房")
        || message.text().includes("[亲亲]") || message.text().includes("[色]") || message.text().includes("亲一个")) {
        message.room().say("恶心心🤢🤢", message.talker())
    }
}