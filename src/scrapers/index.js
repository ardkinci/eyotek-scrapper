const yemekMenu = require('./yemekMenu');
const dersProgrami = require('./dersProgrami');
const odevler = require('./odevler');

const scrapers = {
    [yemekMenu.id]: yemekMenu,
    [dersProgrami.id]: dersProgrami,
    [odevler.id]: odevler,
};

module.exports = scrapers;