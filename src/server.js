const express = require('express');
const { runScraper } = require('./core/scraperEngine');
const scrapers = require('./scrapers');
const { generateIcsFromTimetable } = require('./utils/icsGenerator'); 

const app = express();
app.use(express.json());

app.get('/api/scrape/:taskId/ics', async (req, res) => {
    const { taskId } = req.params;
    const params = req.query;

    if (taskId !== 'ders-programi') {
        return res.status(400).json({ 
            success: false, 
            message: 'The ICS format is currently only supported for "ders-programi"' 
        });
    }

    const targetScraper = scrapers[taskId];

    if (!targetScraper) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    try {
        const data = await runScraper(targetScraper, params); 
        
        const icsString = generateIcsFromTimetable(data);

        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${taskId}.ics"`);
        
        res.send(icsString);
    } catch (error) {
        console.error(`[ERROR] (ICS Endpoint):`, error);
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/api/scrape/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const params = req.query;

    const targetScraper = scrapers[taskId];

    if (!targetScraper) {
        return res.status(404).json({ success: false, message: 'Task not found.' });
    }

    try {
        const data = await runScraper(targetScraper, params); 
        res.status(200).json({ success: true, data });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = app;