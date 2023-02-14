import got from 'got';
import sharp from 'sharp';
import { log, Message } from 'wechaty';
import fs from 'fs';
import { FileBox } from 'file-box';
const Text2SVG = require('text-to-svg')

export async function makeItAQuato(message: Message) {
    // 
    var message_split = message.text().split("- - - - - - - - - - - - - - -");
    console.log(message_split);
    if (message_split.length != 2 || message.self() || !message.mentionSelf())
        return;
    try {
        var cmd = message_split[1];
        if (cmd.indexOf("quato") == -1)
            return;
        var quato_example = message_split[0];
        var quato_author = quato_example.split("：")[0].substring(1);
        var member_list = await message.room().memberAll();
        console.log("Author: " + quato_author);
        quato_example = "「" + quato_example.split("：")[1];
        quato_example = quato_example.trim();
        console.log("Quato:" + quato_example);
        var quato_avatar = await (await member_list.filter(member => member.name() == quato_author)[0].avatar()).toBuffer();
        quato_avatar = await sharp(quato_avatar).resize(618, 618).toBuffer();
        var cmd_args = cmd.split(" ");
        // 使用sharp将quato_example转换为图片
        const text2SVG = Text2SVG.loadSync('./data/font/SourceHanSansSC-VF.ttf')
        var attributes = { fill: 'white'}
        var options = {
            fontSize: 53,
            anchor: 'top',
            attributes,
        }
        var quato_height = 0;
        const max_size_of_line = 9;
        while (quato_example.length > max_size_of_line) {
            quato_height += 85;
            const svg = Buffer.from(text2SVG.getSVG(quato_example.substring(0,max_size_of_line), options))
            quato_avatar = await sharp({
                create: {
                    width: 618,
                    height: 618 + quato_height,
                    channels: 4,
                    background: { r: 0, g: 0, b: 0, alpha: 1 }
                },
            }).composite([
                {
                    input: svg,
                    gravity: 'south'
                },
                {
                    input: quato_avatar,
                    gravity: 'north',
                }
            ]).png().toBuffer();
            quato_example = quato_example.substring(max_size_of_line);
        }
        if (quato_example.length > 0) {
            quato_height += 85;
            const svg = Buffer.from(text2SVG.getSVG(quato_example, options))
            quato_avatar = await sharp({
                create: {
                    width: 618,
                    height: 618 + quato_height,
                    channels: 4,
                    background: { r: 0, g: 0, b: 0, alpha: 1 }
                },
            }).composite([
                {
                    input: svg,
                    gravity: 'south'
                },
                {
                    input: quato_avatar,
                    gravity: 'north',
                }
            ]).png().toBuffer();
        }
        options = {
            fontSize: 41,
            anchor: 'top',
            attributes,
        }
        attributes = { fill: 'gray'}
        const author_svg = Buffer.from(text2SVG.getSVG('@' + quato_author, options))
        // 获取图片的宽高
        // 生成一个新的图片
        const quato_result = await sharp({
            create: {
                width: 618,
                height: 718 + quato_height,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 1 }
            },
        }).composite([
            {
                input: quato_avatar,
                gravity: 'north',
            },
            {
                input: author_svg,
                gravity: 'south',
            }
        ]).png().toBuffer();
        // 将图片保存到本地
        let fileBox = FileBox.fromBuffer(quato_result, 'quato.png');
        message.say(fileBox)
    }
    catch (error) {
        log.error("[makeItAQuato]", error);
    }
    finally {
        log.info("[makeItAQuato]", "done");
    }
}
