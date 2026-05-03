const express = require('express');
const { runScraper } = require('./core/scraperEngine');
const scrapers = require('./scrapers');
const { generateIcsFromTimetable } = require('./utils/icsGenerator'); 
const apiKeyMiddleware = require('./middleware/apiAuth');

const { successResponse, errorResponse } = require('./utils/response');

const app = express();
app.use(express.json());

app.use(apiKeyMiddleware); // API KEY CONTROL

app.get('/api/scrape/:taskId/ics', async (req, res) => {
    const { taskId } = req.params;
    const params = req.query;

    if (taskId !== 'ders-programi') {

        return res.status(400).json(
            errorResponse('The ICS format is currently only supported for "ders-programi"')
        );
    }

    const targetScraper = scrapers[taskId];

    if (!targetScraper) {
        return res.status(404).json(errorResponse('Task not found.'));
    }

    try {
        const data = await runScraper(targetScraper, params); 
        
        const icsString = generateIcsFromTimetable(data);

        res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
        res.setHeader('Content-Disposition', `attachment; filename="${taskId}.ics"`);
        
        res.send(icsString);
    } catch (error) {
        console.error(`[ERROR] (ICS Endpoint):`, error);
        res.status(500).json(errorResponse(error.message));
    }
});

app.get('/api/scrape/:taskId', async (req, res) => {

    const startTime = Date.now(); 

    const { taskId } = req.params;
    const params = req.query;

    const targetScraper = scrapers[taskId];

    if (!targetScraper) {
        return res.status(404).json(errorResponse('Task not found.'));
    }

    try {
        const data = await runScraper(targetScraper, params); 
        
        res.status(200).json(successResponse(data, startTime));

    } catch (error) {
        res.status(500).json(errorResponse(error.message));
    }
});

module.exports = app;