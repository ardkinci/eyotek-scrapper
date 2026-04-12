const config = require('../config');
module.exports = {
    id: 'ders-programi',
    url: `https://${config.eyotek_url}/v1/Pages/Student/parent-timetable`,
    
    scrape: async (page) => {
        return await page.evaluate(() => {
            const rows = Array.from(document.querySelectorAll('#GridView1 tr'));
            rows.shift();

            const haftalikProgram = {
                pazartesi: { gunAdi: 'Pazartesi', tarih: null, dersler: {} },
                sali:      { gunAdi: 'Salı',      tarih: null, dersler: {} },
                carsamba:  { gunAdi: 'Çarşamba',  tarih: null, dersler: {} },
                persembe:  { gunAdi: 'Perşembe',  tarih: null, dersler: {} },
                cuma:      { gunAdi: 'Cuma',      tarih: null, dersler: {} },
                cumartesi: { gunAdi: 'Cumartesi', tarih: null, dersler: {} },
                pazar:     { gunAdi: 'Pazar',     tarih: null, dersler: {} }
            };

            const parseCell = (cell) => {
                if (!cell) return null;
                const text = cell.innerText.trim();
                if (!text || text === '') return null;
                
                const lines = text.split('\n').map(l => l.trim()).filter(l => l !== '');
                return {
                    ders: lines[0] || '', 
                    detaylar: lines.slice(1).join(' | ') 
                };
            };

            rows.forEach((row, index) => {
                const cells = row.querySelectorAll('td');
                const ders_no = index + 1;

                const haftaIciSaat = cells[0] ? cells[0].innerText.trim().replace('\n', ' - ') : '';
                const haftaSonuSaat = cells[6] ? cells[6].innerText.trim().replace('\n', ' - ') : '';

                const gunler = [
                    { ad: 'pazartesi', index: 1, saat: haftaIciSaat },
                    { ad: 'sali',      index: 2, saat: haftaIciSaat },
                    { ad: 'carsamba',  index: 3, saat: haftaIciSaat },
                    { ad: 'persembe',  index: 4, saat: haftaIciSaat },
                    { ad: 'cuma',      index: 5, saat: haftaIciSaat },
                    { ad: 'cumartesi', index: 7, saat: haftaSonuSaat },
                    { ad: 'pazar',     index: 8, saat: haftaSonuSaat }
                ];

                gunler.forEach(gun => {
                    const parsedData = parseCell(cells[gun.index]);
                    
                    if (parsedData) {
                        haftalikProgram[gun.ad].dersler[ders_no] = {
                            saat: gun.saat,
                            ders: parsedData.ders,
                            detaylar: parsedData.detaylar
                        };
                    }
                });
            });

            // clear off days
            Object.keys(haftalikProgram).forEach(gun => {
                if (Object.keys(haftalikProgram[gun].dersler).length === 0) {
                    delete haftalikProgram[gun];
                }
            });

            return haftalikProgram;
        });
    }
};