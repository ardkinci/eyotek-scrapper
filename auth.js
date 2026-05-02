require('./src/core/logger');
const { spawn } = require('child_process');
const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const readline = require('readline');
const os = require('os');
const path = require('path');
const config = require('./src/config');

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const promptUser = (query) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    return new Promise(resolve => rl.question(query, ans => {
        rl.close();
        resolve(ans);
    }));
};

async function executeAutoStrategy(page, loginUrl) {

    console.log('[INFO] (auth): Waiting for page to be ready...');
    await delay(2000);

    console.log('[INFO] (auth): Typing username...');
    await page.type('#txtUsername', config.USERNAME, { delay: 100 });
    await delay(1500);

    console.log('[INFO] (auth): Typing password...');
    await page.type('#txtPassword', config.PASSWORD, { delay: 100 });
    await delay(1500);

    await page.click('.content'); 
    await delay(2000);

    console.log('[INFO] (auth): Waiting for login button to become active...');
    await page.waitForSelector('#btnLogin:not([disabled])', { timeout: 90000 });
    
    console.log('[INFO] (auth): Button is active. Clicking login...');
    await delay(1000);
    await page.evaluate(() => document.querySelector('#btnLogin').click());

    console.log('[INFO] (auth): Waiting for redirect to dashboard...');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });

    const currentUrl = page.url();
    if (currentUrl.toLowerCase().includes('login') || currentUrl === loginUrl) {
        throw new Error('Server rejected the login.');
    }
}

async function executeManualStrategy() {
    console.log(`[INFO] (auth): Please enter your password in your browser and take the Turnstile test. Click "Login" and wait until you see the dashboard.`);
    console.log(`[INFO] (auth): Once fully logged in, return here and press ENTER.`);
    await promptUser('[ACTION REQUIRED]: Press ENTER if you are logged in successfully...');
}

async function performAuthentication(mode) {
    const isAuto = mode === 'auto';
    console.log(`[INFO] (auth): Starting login process. Mode: ${mode}`);

    const port = 9222;
    const loginUrl = `https://${config.eyotek_url}/`;
    const profilePath = path.join(os.tmpdir(), `eyotek_profile_${mode}_${Date.now()}`);

    console.log(`[INFO] (auth): Starting Chromium with temp profile: ${profilePath}`);
    
    const browserProcess = spawn(config.PUPPETEER_EXECUTABLE_PATH, [
        `--remote-debugging-port=${port}`,
        `--user-data-dir=${profilePath}`,
        `--no-first-run`,
        `--no-default-browser-check`,
        loginUrl 
    ]);

    const bootDelay = isAuto ? 8000 : 3000;
    await delay(bootDelay);

    let browser;
    try {
        console.log(`[INFO] (auth): Puppeteer is connecting to the browser on port ${port}`);
        browser = await puppeteer.connect({
            browserURL: `http://127.0.0.1:${port}`,
            defaultViewport: null
        });

        const pages = await browser.pages();
        const page = pages[0]; 
        page.setDefaultNavigationTimeout(90000);

        if (isAuto) {
            await executeAutoStrategy(page, loginUrl);
        } else {
            await executeManualStrategy();
        }

        console.log('[INFO] (auth): Login successful! Extracting cookies...');
        const client = await page.target().createCDPSession();
        const { cookies } = await client.send('Network.getAllCookies');

        await fs.writeFile(config.COOKIES_PATH, JSON.stringify(cookies, null, 2));
        console.log(`[SUCCESS] (auth): ${cookies.length} cookies saved to file.`);
        
        return true; 
    } catch (error) {
        console.log(`[WARN] (auth): Login process failed. Reason: ${error.message}`);
        return false; 
    } finally {
        console.log('[INFO] (auth): Cleaning up browser and temp files.');
        if (browser) await browser.disconnect().catch(() => {});
        if (browserProcess) browserProcess.kill();
        await fs.rm(profilePath, { recursive: true, force: true }).catch(() => {});
    }
}

async function main() {
    const targetMode = config.LOGIN_MODE || 'manual'; 

    if (targetMode === 'auto') {
        const autoSuccess = await performAuthentication('auto');
        
        if (!autoSuccess) {
            console.log('[WARN] (auth): Auto-login failed. Falling back to manual mode.');
            const manualSuccess = await performAuthentication('manual');
            if (!manualSuccess) process.exit(1);
        }
    } else {
        const manualSuccess = await performAuthentication('manual');
        if (!manualSuccess) process.exit(1);
    }
    
    process.exit(0); 
}

main();