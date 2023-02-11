import { Message } from "wechaty";
import { FileBox } from "wechaty-puppet/dist/esm/src/config";

const fs = require('fs');
const https = require('https');

// https://img.shields.io/badge/Misaka__No.19614-Expert%20%201712-00f.svg?longCache=true&style=for-the-badge&logo=Codeforces&link=https://codeforces.com/profile/Misaka_No.19614
async function getCodeforcesRatingImage(handle: string) {
    https.get(`https://codeforces.com/api/user.info?handles=${handle}`, (res: any) => {
        res.on('data', (data) => {
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
                let image = `https://img.shields.io/badge/${handle}-${rank}%20%20${rating}-${color}.svg?longCache=true&style=for-the-badge&logo=Codeforces&link=https://codeforces.com/profile/${handle}`;
                // download image
                https.get(image, (res: any) => {
                    res.pipe(fs.createWriteStream(`./data/codeforces/${handle}.svg`));
                }).on('error', (e: any) => {
                    console.error(e);
                });
            }
            else {
                console.log(data);
            }
        });
    }).on('error', (e: any) => {
        console.error(e);
    });
}

export async function codeforcesRating(message: Message) {
    if (message.self() || !message.mentionSelf()) {
        return;
    }
    if (message.text().indexOf("cfrating") == 0) {
        let handle = message.text().substring(8);
        if (handle == "") {
            handle = "lue"
        }
        await getCodeforcesRatingImage(handle);
        message.say(FileBox.fromFile(`./data/codeforces/${handle}.svg`));
    }
}