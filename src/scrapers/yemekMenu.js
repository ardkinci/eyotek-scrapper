module.exports = {
    id: 'yemek',
    url: `https://${config.eyotek_url}/v1/Pages/Student/parent-food-menu`,
    
    scrape: async (page, params) => {
        
        if (params && params.date) {
            console.log(`📅 Date: ${params.date}`);
            
            await page.waitForSelector('#txtHistory');
            
            const eskiTabloHTML = await page.evaluate(() => {
                const tablo = document.querySelector('#GridView1');
                return tablo ? tablo.innerHTML : '';
            });

            await page.evaluate((hedefTarih) => {
                const input = document.getElementById('txtHistory');
                input.value = hedefTarih;
                input.dispatchEvent(new Event('change', { bubbles: true }));
            }, params.date);

            console.log('⏳ Waiting for table update...');

            try {
                await page.waitForFunction((eskiHTML) => {
                    const guncelTablo = document.querySelector('#GridView1');
                    const guncelHTML = guncelTablo ? guncelTablo.innerHTML : '';
                    return guncelHTML !== eskiHTML;
                }, { timeout: 10000 }, eskiTabloHTML); 
                
                console.log('✅ Table updated!');
            } catch (error) {
                console.log('⚠️ The table was not updated (the same data was received or a timeout occurred).');
            }

            await new Promise(r => setTimeout(r, 500)); 
        }

        return await page.evaluate(() => {
            const tableRows = document.querySelectorAll('#GridView1 tr');
            const data = [];
            
            for (let i = 1; i < tableRows.length; i++) {
                const cells = tableRows[i].querySelectorAll('td');
                if (cells.length < 3) continue;

                if (cells[0].innerText.includes('bulunamadı') || (cells[1] && cells[1].innerText.includes('bulunamadı'))) {
                    return [];
                }

                const yemek = cells[1] ? cells[1].innerText.trim() : '';
                const ogun = cells[2] ? cells[2].innerText.trim().replace(/\s+/g, ' ') : '';
                
                if (yemek !== '') { 
                    data.push({ yemek, ogun });
                }
            }
            return data;
        });
    }
};