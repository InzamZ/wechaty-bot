import { Message, log } from "wechaty";
import { Config } from "../config";
import https from 'https';

var bot_config = new Config();
var openai_api_key = process.env.OPEN_API_KEY;

export async function chatGPT(message: Message) {
    if (await message.mentionSelf())
    {
        let url = "https://api.openai.com/v1/chat/completions"
        let headers = {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + openai_api_key
        }
        let data = {
            "model": "gpt-3.5-turbo",
            "message": [
                {
                    "role": "user",
                    "content": message.text()
                }
            ]
        }
        let options = {
            method: "POST",
            headers: headers,
            body: JSON.stringify(data)
        };
        https.get(url, options, (res: any) => {
            res.on('data', (chat) => {
                chat = JSON.parse(chat);
                message.say(chat.data.choices[0].message[0].content);
                log.silly("[Chat GPT]", `send message: ${chat.data.choices[0].text}`);
            });
        }).on('error', (e: any) => {
            console.error(e);
        });
    }
}