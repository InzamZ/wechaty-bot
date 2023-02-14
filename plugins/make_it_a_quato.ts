import got from 'got';
import sharp from 'sharp';
import { log, Message } from 'wechaty';
import fs from 'fs';
import { FileBox } from 'file-box';
const Text2SVG = require('text-to-svg')

export async function makeItAQuato(message: Message) {
    // 
    try {
        var message_split = message.text().split("- - - - - - - - - - - - - - -");
        console.log(message_split);
        if (message_split.length != 2 || message.self() || !message.mentionSelf())
            return;
        var cmd = message_split[1];
        if (cmd.indexOf("quato") == -1)
            return;
        var quato_example = message_split[0];
        var quato_author = quato_example.split("：")[0].substring(1);
        var member_list = await message.room().memberAll();
        console.log(quato_author);
        var quato_avatar = await (await member_list.filter(member => member.name() == quato_author)[0].avatar()).toBuffer();
        quato_example = "「" + quato_example.split("：")[1];
        quato_example = quato_example.trim();
        var cmd_args = cmd.split(" ");
        // 使用got下载图片
        // 使用sharp将quato_example转换为图片
        const text2SVG = Text2SVG.loadSync('./data/font/SourceHanSansSC-VF.ttf')
        var attributes = { fill: 'white' }
        var options = {
            fontSize: 43,
            anchor: 'top',
            attributes,
        }
        const svg = Buffer.from(text2SVG.getSVG(quato_example, options))
        let quato = await sharp({
            create: {
                width: 1000,
                height: 65,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 1 }
            },
        }).composite([
            {
                input: svg,
                gravity: 'center'
            }
        ]).png().toBuffer();
        options = {
            fontSize: 31,
            anchor: 'top',
            attributes,
        }
        attributes = { fill: 'gray' }
        const author_svg = Buffer.from(text2SVG.getSVG('@' + quato_author, options))
        let quato_author_svg = await sharp({
            create: {
                width: 1000,
                height: 98,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 1 }
            },
        }).composite([
            {
                input: author_svg,
                gravity: 'center'
            }
        ]).png().toBuffer();
        // 获取图片的宽高
        // 生成一个新的图片
        const new_image = await sharp({
            create: {
                width: 1618,
                height: 618,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 1 }
            },
        }).composite([
            {
                input: await sharp(quato_avatar).resize(618, 618).toBuffer(),
                gravity: 'west',
            },
            {
                input: quato,
                gravity: 'northeast',
            },
            {
                input: quato_author_svg,
                gravity: 'southeast',
            }
        ]).png().toBuffer();
        // 将图片保存到本地
        let fileBox = FileBox.fromBuffer(new_image, 'quato.png');
        message.say(fileBox)
    }
    catch (error) {
        log.error("[makeItAQuato]", error);
    }
    finally {
        log.info("[makeItAQuato]", "done");
    }
}
