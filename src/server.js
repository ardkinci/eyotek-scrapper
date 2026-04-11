const express = require('express');
const { runScraper } = require('./core/scraperEngine');
const scrapers = require('./scrapers');

const app = express();
app.use(express.json());

app.get('/api/scrape/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const params = req.query; // keep query

    const targetScraper = scrapers[taskId];

    if (!targetScraper) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    try {
        // send parameters
        const data = await runScraper(targetScraper, params); 
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = app;