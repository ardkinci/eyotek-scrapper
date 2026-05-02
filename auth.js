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

async function autoLogin() {
    console.log('[INFO] (auth): Auto-login mode starting...');
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: 'new',
            executablePath: config.PUPPETEER_EXECUTABLE_PATH,
            args: ['--no-sandbox', '--disable-setuid-sandbox', '--ignore-certificate-errors']
        });

        const page = await browser.newPage();
        const loginUrl = `https://${config.eyotek_url}/`;
        
        await page.goto(loginUrl, { waitUntil: 'networkidle2' });

        console.log('[INFO] (auth): Entering credentials...');

        await page.type('#txtUsername', config.USERNAME);
        await new Promise(resolve => setTimeout(resolve, 1000));

        await page.type('#txtPassword', config.PASSWORD);
        await new Promise(resolve => setTimeout(resolve, 1000));

        console.log('[INFO] (auth): Triggering hidden PostBack (Bypassing Turnstile UI)...');
        await page.evaluate(() => {
            __doPostBack('BtnSubmit', '');
        });

        await page.waitForNavigation({ timeout: 10000, waitUntil: 'networkidle2' });

        await new Promise(resolve => setTimeout(resolve, 5000));

        const currentUrl = page.url();
        if (currentUrl.toLowerCase().includes('login') || currentUrl === loginUrl) {
            throw new Error('Login failed.');
        }

        console.log('[SUCCESS] (auth): Auto-login successful! Extracting cookies...');
        const client = await page.target().createCDPSession();
        const { cookies } = await client.send('Network.getAllCookies');

        await fs.writeFile(config.COOKIES_PATH, JSON.stringify(cookies, null, 2));
        console.log(`[SUCCESS] (auth): ${cookies.length} cookies saved.`);
        
        await browser.close();
        return true;
    } catch (error) {
        console.log(`[WARN] (auth): Auto-login failed! Reason: ${error.message}`);
        if (browser) await browser.close();
        return false;
    }
}

async function manualLogin() {
    console.log('[INFO] (auth): Manual-login mode starting...');
    const port = 9222;
    const loginUrl = `https://${config.eyotek_url}/`;
    const profilePath = path.join(os.tmpdir(), `eyotek_profile_${Date.now()}`);

    console.log(`[INFO] (auth): Chromium starting with new temp profile (${profilePath})`);

    const browserProcess = spawn(config.PUPPETEER_EXECUTABLE_PATH, [
        `--remote-debugging-port=${port}`,
        `--user-data-dir=${profilePath}`,
        `--no-first-run`,
        `--no-default-browser-check`,
        loginUrl
    ]);

    await new Promise(r => setTimeout(r, 2000));

    console.log(`[INFO] (auth): Browser is ready!`);
    console.log(`[INFO] (auth): Please enter your password in your browser and take the Turnstile test.`);
    console.log(`[INFO] (auth): Once fully logged in, return here and press ENTER.`);

    await waitAndAsk('[ACTION REQUIRED]: Press ENTER if you are logged in successfully...');

    console.log(`[INFO] (auth): Puppeteer is connecting to the browser on port ${port}`);
    try {
        const browser = await puppeteer.connect({
            browserURL: `http://127.0.0.1:${port}`,
            defaultViewport: null
        });

        const pages = await browser.pages();
        const page = pages[0]; 

        console.log('[INFO] (auth): Cookies are extracting...');
        const client = await page.target().createCDPSession();
        const { cookies } = await client.send('Network.getAllCookies');

        await fs.writeFile(config.COOKIES_PATH, JSON.stringify(cookies, null, 2));
        console.log(`[SUCCESS] (auth): ${cookies.length} cookies saved.`);

        await browser.close();
        await fs.rm(profilePath, { recursive: true, force: true }).catch(() => {});
        return true;
    } catch (error) {
        console.error(`[ERROR] (auth): ${error.message}`);
        browserProcess.kill(); 
        return false;
    }
}

async function main() {

    const mode = config.LOGIN_MODE || 'manual'; 

    if (mode === 'auto') {
        const isSuccess = await autoLogin();

        if (!isSuccess) {
            console.log('[WARN] (auth): Server backend rejected the login. Falling back to manual mode...');
            const manualSuccess = await manualLogin();
            if (!manualSuccess) process.exit(1);
        }
    } else {
        const manualSuccess = await manualLogin();
        if (!manualSuccess) process.exit(1);
    }
    

    process.exit(0); 
}

main();