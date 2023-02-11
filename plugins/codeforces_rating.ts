import { Message, log } from "wechaty"
import { FileBox } from 'file-box'

const sharp = require("sharp")
const fs = require('fs');
const https = require('https');
const puppeteer = require('puppeteer');

// https://img.shields.io/badge/Misaka__No.19614-Expert%20%201712-00f.svg?longCache=true&style=for-the-badge&logo=Codeforces&link=https://codeforces.com/profile/Misaka_No.19614
export async function codeforcesRating(message: Message) {
    if (message.self() || await message.mentionSelf() != true ) {
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
                    let maxRank = data.result[0].maxRank;
                    let color = "00f";
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
                    else if (rank == "international grandmaster") {
                        color = "red";
                    }
                    let imageurl = `https://img.shields.io/badge/${handle}-${rating}-${color}.svg?longcache=true&style=for-the-badge&logo=Codeforces&link=https://codeforces.com/profile/${handle}`;
                    const browser = await puppeteer.launch();
                    const page = await browser.newPage();
                    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 3 })
                    await page.goto(imageurl);
                    const image = await page.waitForSelector('svg');
                    await image.screenshot({
                        path: './data/codeforces/' + handle + '.png',
                        type: 'png',
                    });
                    await browser.close();
                    const fileBox = await FileBox.fromFile(`./data/codeforces/${handle}.png`);
                    await message.say(fileBox);
                }
            });
        }).on('error', (e: any) => {
            console.error(e);
        });
    }
}