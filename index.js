const fs = require('fs');
const { spawn } = require('child_process');
const config = require('./src/config');

function startServer() {
    const app = require('./src/server');
    app.listen(config.PORT, () => {
        console.log(`🚀 The Eyotek API runs on port: ${config.PORT}`);
    });
}


function setupFirstRun() {
    console.log('First run detected. Cookie wizard is starting....');

    // sub process
    const wizard = spawn('node', ['get-cookies.js'], { stdio: 'inherit' });

    wizard.on('exit', (code) => {
        if (code === 0) {
            console.log('\n✅ Cookies successfully extracted! Server is starting...');
            startServer();
        } else {
            console.error('\n❌ The cookie extract process failed. Please try again.');
            process.exit(1);
        }
    });
}


if (fs.existsSync(config.COOKIES_PATH)) {
    startServer();
} else {
    setupFirstRun();
}