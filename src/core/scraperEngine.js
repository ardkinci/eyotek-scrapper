const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const fs = require('fs').promises;
const config = require('../config');

puppeteer.use(StealthPlugin());

async function runScraper(scraperTask, params = {}) { 
    let browser;
    try {
        console.log(`🤖 Browser starting: [Task: ${scraperTask.id}]`);
        browser = await puppeteer.launch({
            headless: true,
            executablePath: config.PUPPETEER_EXECUTABLE_PATH
        });

        const page = await browser.newPage();

        // load cookies
        const cookiesString = await fs.readFile(config.COOKIES_PATH, 'utf8');
        await page.setCookie(...JSON.parse(cookiesString));

        console.log(`🚀 Going to ${scraperTask.url} ...`);
        await page.goto(scraperTask.url, { waitUntil: 'networkidle2' });

        // run scraper for related file
        const data = await scraperTask.scrape(page, params);
        
        return data;

    } catch (error) {
        console.error(`❌ Scraper Error [${scraperTask.id}]:`, error.message);
        throw error;
    } finally {
        if (browser) await browser.close();
        console.log(`✅ Task completed, browser stopped: [${scraperTask.id}]`);
    }
}

module.exports = { runScraper };