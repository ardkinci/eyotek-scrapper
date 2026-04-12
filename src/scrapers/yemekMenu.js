const config = require('../config');
module.exports = {
    id: 'yemek',
    url: `https://${config.eyotek_url}/v1/Pages/Student/parent-food-menu`,
    
    scrape: async (page) => {
        return await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('#GridView1 tr'));
            rows.shift();
            return rows.map(row => {
                const cells = row.querySelectorAll('td');
                return {
                    yemek: cells[1] ? cells[1].innerText.trim() : '',
                    ogun: cells[2] ? cells[2].innerText.trim() : ''
                };
            });
        });
    }
};