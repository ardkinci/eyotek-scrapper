const { spawn } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const readline = require('readline');
const os = require('os');
const path = require('path');
const config = require('./src/config');

const waitAndAsk = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    return new Promise(resolve => rl.question(question, ans => {
        rl.close();
        resolve(ans);
    }));
};

async function autoGetCookies() {
    const port = 9222;
    const loginUrl = `https://${config.eyotek_url}/`;
    const profilePath = path.join(os.tmpdir(), `eyotek_profile_${Date.now()}`); // new profile


    console.log(`[INFO] (cookie-extractor): Chromium starting with new temp profile (${profilePath})`);

    const browserProcess = spawn(config.PUPPETEER_EXECUTABLE_PATH, [
        `--remote-debugging-port=${port}`,
        `--user-data-dir=${profilePath}`,
        `--no-first-run`,
        `--no-default-browser-check`,
        loginUrl
    ]);

    await new Promise(r => setTimeout(r, 2000));

    console.log(`[INFO] (cookie-extractor): Browser is ready!`);
    console.log(`[INFO] (cookie-extractor): Please enter your password in your browser and take the Turnstile test.`);
    console.log(`[INFO] (cookie-extractor): Once you are FULLY logged into the system, return here and press ENTER.`);

    await waitAndAsk('[INFO] (cookie-extractor): If you are logged in to the system, press ENTER');

    console.log(`[INFO] (cookie-extractor): Puppeteer is connecting to the browser on port ${port}`);
    try {
        const browser = await puppeteer.connect({
            browserURL: `http://127.0.0.1:${port}`,
            defaultViewport: null
        });

        const pages = await browser.pages();
        const page = pages[0]; 

        console.log('[INFO] (cookie-extractor): Cookies are extracting...');
        
        // connect to CDP
        const client = await page.target().createCDPSession();
        
        // get all cookies from memory
        const { cookies } = await client.send('Network.getAllCookies');

        // save
        await fs.writeFile(config.COOKIES_PATH, JSON.stringify(cookies, null, 2));
        console.log(`[SUCCESS] (cookie-extractor): ${cookies.length} cookies are have been saved to the file.`);

        await browser.close();
        console.log('[INFO] (cookie-extractor): Browser closed.');

        await fs.rm(profilePath, { recursive: true, force: true }).catch(() => {});

    } catch (error) {
        console.error(`[ERROR] (cookie-extractor): ${error.message}`);

        browserProcess.kill(); 
        process.exit(1);
    }

    process.exit(0);
}

autoGetCookies();