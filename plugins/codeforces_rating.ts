import { Message, log } from "wechaty"
import { FileBox } from 'file-box'
const got = require('got');

import sharp from 'sharp';
import fs from 'fs';
import https from 'https';
import puppeteer from 'puppeteer';

// https://img.shields.io/badge/Misaka__No.19614-Expert%20%201712-00f.svg?longCache=true&style=for-the-badge&logo=Codeforces&link=https://codeforces.com/profile/Misaka_No.19614
export async function codeforcesRating(message: Message) {
    if (message.self()) {
        return;
    }
    if (message.text().indexOf("cfrating") == 0) {
        let handle = message.text().substring(8);
        if (handle == "") {
            handle = "lue"
        }
        https.get(`https://codeforces.com/api/user.info?handles=${handle}`, (res: any) => {
            res.on('data', async (data) => {
                data = JSON.parse(data);
                if (data.status == "OK") {
                    let rating = data.result[0].rating;
                    let maxRating = data.result[0].maxRating;
                    let rank = data.result[0].rank;
                    let avatar = data.result[0].titlePhoto;
                    let color = "black";
                    if (rank == "newbie") {
                        color = "-808080";
                    }
                    else if (rank == "pupil") {
                        color = "008000";
                    }
                    else if (rank == "specialist") {
                        color = "03a89e";
                    }
                    else if (rank == "expert") {
                        color = "00f";
                    }
                    else if (rank == "candidate master") {
                        color = "aa00aa";
                    }
                    else if (rank == "master") {
                        color = "ff8c00";
                    }
                    else if (rank == "international master") {
                        color = "ff8c00";
                    }
                    else if (rank == "grandmaster") {
                        color = "red";
                    }
                    else if (rank == "legendary grandmaster") {
                        color = "red";
                    }
                    else {
                        color = "black";
                    }
                    try {
                        let imageurl = `https://img.shields.io/badge/${handle}-${rank}%20%20${rating}-${color}.svg?longcache=true&style=for-the-badge&logo=Codeforces&link=https://codeforces.com/profile/${handle}`;
                        log.info("[CF Rating]",imageurl);
                        // 使用puppeteer打开imageurl对应的图片
                        const browser = await puppeteer.launch();
                        const page = await browser.newPage();
                        await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 })
                        await page.goto(imageurl);
                        const image = await page.waitForSelector('svg');
                        await image.screenshot({
                            path: './data/codeforces/' + handle + '.png',
                            type: 'png',
                        });
                        await browser.close();
                    }
                    catch (e) {
                        console.log(e);
                        message.say("获取失败");
                        return;
                    }
                    // 获取截图的长宽
                    const { width, height } = await sharp('./data/codeforces/' + handle + '.png').metadata();
                    // 使用got下载avatar对应的图片
                    const response2 = await got(avatar);
                    // 使用sharp将两张图片合并，新建一个背景图片，将avatar图片放在背景图片的上方，然后将codeforces图片放在背景图片的下方
                    const buffer2 = await sharp({
                        create: {
                            width: width,
                            height: width + height,
                            channels: 4,
                            background: { r: 255, g: 255, b: 255, alpha: 1 }
                        }
                    }).composite([
                        {
                            input: await sharp('./data/codeforces/' + handle + '.png').toBuffer(),
                            gravity: 'south'
                        },
                        {
                            input: await sharp(response2.rawBody).resize(width, width).toBuffer(),
                            gravity: 'north'
                        }
                    ]).png().toBuffer();
                    // 使用file-box将图片转换为file-box
                    const fileBox = FileBox.fromBuffer(buffer2, 'codeforces.png');
                    // 发送图片
                    await message.say(fileBox);
                }
            });
        }).on('error', (e: any) => {
            console.error(e);
        });
    }
}