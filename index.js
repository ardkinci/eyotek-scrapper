const app = require('./src/server');
const config = require('./src/config');

app.listen(config.PORT, () => {
    console.log(`🚀 Eyotek API running on ${config.PORT} port...`);
});