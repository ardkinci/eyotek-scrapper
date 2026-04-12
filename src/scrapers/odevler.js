const config = require('../config');
module.exports = {
    id: 'odevler',
    url: `https://${config.eyotek_url}/v1/Pages/Student/parent-homework`,
    
    scrape: async (page) => {
        return await page.evaluate(() => {
            // get stats from hidden html inputs
            let istatistik = [];
            const chartInput = document.querySelector('#hddnChart');
            if (chartInput && chartInput.value) {
                try {
                    // Parse JSON that comes in HTML entity format.
                    istatistik = JSON.parse(chartInput.value);
                } catch (e) {
                    console.error("Statistics JSON could not be parsed.");
                }
            }

            // "tümü" tab
            let rows = Array.from(document.querySelectorAll('#GridView6 tr'));
            if (rows.length === 0) {
                rows = Array.from(document.querySelectorAll('.tab-pane.active table tr'));
            }
            
            // clear headers (first row)
            rows.shift();

            const odevListesi = rows.map(row => {
                // skip paginations
                if (row.classList.contains('pagination')) return null;

                const cells = row.querySelectorAll('td');
                
                // skip "Kayıt bulunamadı!" 
                if (cells.length < 8) return null;

                // clear the gaps
                const cleanText = (cell) => {
                    if (!cell) return '';
                    return cell.innerText.replace(/\s+/g, ' ').trim();
                };

                return {
                    tur: cleanText(cells[0]),
                    ders: cleanText(cells[1]),
                    konu: cleanText(cells[2]),
                    aciklama: cleanText(cells[3]),
                    verilisTarihi: cleanText(cells[4]),
                    kontrolTarihi: cleanText(cells[5]),
                    ogretmen: cleanText(cells[6]),
                    durum: cleanText(cells[7])
                };
            }).filter(item => item !== null); // clear nulls

            return {
                istatistik: istatistik,
                liste: odevListesi
            };
        });
    }
};