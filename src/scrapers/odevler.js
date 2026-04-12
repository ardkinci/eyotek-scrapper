const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dayjs.extend(customParseFormat);

const config = require('../config');

module.exports = {
    id: 'odevler',
    url: `https://${config.eyotek_url}/v1/Pages/Student/parent-homework`,
    
    scrape: async (page) => {
        const hamVeri = await page.evaluate(() => {
            let istatistik = [];
            const chartInput = document.querySelector('#hddnChart');
            if (chartInput && chartInput.value) {
                try {
                    istatistik = JSON.parse(chartInput.value);
                } catch (e) {
                    console.error("Statistics JSON could not be parsed.");
                }
            }

            let rows = Array.from(document.querySelectorAll('#GridView6 tr'));
            if (rows.length === 0) {
                rows = Array.from(document.querySelectorAll('.tab-pane.active table tr'));
            }
            
            rows.shift();

            const odevListesi = rows.map(row => {
                if (row.classList.contains('pagination')) return null;

                const cells = row.querySelectorAll('td');
                if (cells.length < 8) return null;

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
            }).filter(item => item !== null);

            return {
                istatistik: istatistik,
                liste: odevListesi
            };
        });

        const formatla = (tarihMetni) => {
            if (!tarihMetni) return '';
            
            const parseEdilmis = dayjs(tarihMetni, config.EYOTEK_DATE_FORMAT);
            
            // convert to YYYY-MM-DD
            return parseEdilmis.isValid() ? parseEdilmis.format('YYYY-MM-DD') : tarihMetni;
        };

        hamVeri.liste = hamVeri.liste.map(odev => {
            return {
                ...odev,
                verilisTarihi: formatla(odev.verilisTarihi),
                kontrolTarihi: formatla(odev.kontrolTarihi)
            };
        });

        return hamVeri;
    }
};