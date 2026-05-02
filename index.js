require('./src/core/logger');
const fs = require('fs');
const { spawn } = require('child_process');
const config = require('./src/config');

function startServer() {
    const app = require('./src/server');
    app.listen(config.PORT, () => {
        console.log(`[INFO] (core): Eyotek API runs on port ${config.PORT}`);
    });
}


function setupFirstRun() {
    console.log(`[WARN] (core): First run detected.`);
    console.log('[INFO] (core): Cookie wizard is starting.');

    // sub process
    const wizard = spawn('node', ['auth.js'], { stdio: 'inherit' });

    wizard.on('exit', (code) => {
        if (code === 0) {
        console.log(`[SUCCESS] (core): Cookies successfully extracted.`);
        console.log(`[INFO] (core): Server is starting.`);
            startServer();
        } else {
            console.log(`[ERROR] (core): The cookie extract process failed.`);
            process.exit(1);
        }
    });
}


if (fs.existsSync(config.COOKIES_PATH)) {
    startServer();
} else {
    setupFirstRun();
}