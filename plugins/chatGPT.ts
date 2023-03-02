import { Message, log } from "wechaty";
import https from 'https';

var openai_api_key = process.env.OPENAI_API_KEY;

export async function chatGPT(message: Message) {

    if (await message.mentionSelf()) {
        try {
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
                        "content": message.text().substring(message.text().indexOf(" ") + 1)
                    }
                ]
            }
            let options = {
                method: "POST",
                headers: headers,
                body: data
            };
            log.info("[Chat GPT]", `asked: ${message.text().substring(message.text().indexOf(" ") + 1)}`);
            https.request(url, options, (res: any) => {
                res.on('data', (chat) => {
                    chat = JSON.parse(chat);
                    console.log(chat);
                    message.say(chat.choices[0].message[0].content);
                    log.silly("[Chat GPT]", `send message: ${chat.data.choices[0].text}`);
                });
            }).on('error', (e: any) => {
                console.error(e);
            });
        }
        catch (e) {
            console.error(e);
        }
    }
}