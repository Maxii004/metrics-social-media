// const chromium = require('chrome-aws-lambda');
const puppeteer = require('puppeteer');
require('events').EventEmitter.defaultMaxListeners = 15;

const getFacebookMetrics = async (facebookUrl) => {

    try {
        console.log(facebookUrl, 'facebook link from index');
        const browser = await puppeteer.launch({
            headless: true, args: ["--disable-gpu",
                "--disable-dev-shm-usage",
                "--disable-setuid-sandbox",
                "--no-sandbox"],
        });
        console.log('browser launched');
        const page = await browser.newPage();
        console.log('page created');
        await page.setDefaultNavigationTimeout(0);
        await page.goto(facebookUrl, {
            waitUntil: 'networkidle0',
        });;

        let followersCount = '-';

        const spanElements = await page.$$("span");
        for (let j = 0; j < spanElements.length; j++) {
            const element = spanElements[j];
            const txt = await page.evaluate(
                (element) => Promise.resolve(element.textContent),
                element
            );
            if (txt.includes("followers") && !txt.includes("unavailable")) {
                var words = txt.split(' ');
                var numberIndex = words.findIndex((word) => word == "followers");
                followersCount = words[numberIndex - 1];
                return followersCount;
            }
            else if (txt.endsWith("people follow this")) {
                var words = txt.split(' ');
                var numberIndex = words.findIndex((word) => word == "people");
                followersCount = words[numberIndex - 1];
                return followersCount;
            }
        }

        if (followersCount === undefined) {
            const divElements = await page.$$("div");
            for (let j = 0; j < divElements.length; j++) {
                const element = divElements[j];
                const txt = await page.evaluate(
                    (element) => Promise.resolve(element.textContent),
                    element
                );
                if (txt.endsWith("people follow this")) {
                    var words = txt.split(' ');
                    var numberIndex = words.findIndex((word) => word == "people");
                    followersCount = words[numberIndex - 1];
                    if (followersCount === undefined) {
                        return '-';
                    } else {
                        return followersCount;
                    }
                }
            }
        }
        await browser.close();

    } catch (err) {
        console.log(err);
        return "-";
    }
};

module.exports = getFacebookMetrics;