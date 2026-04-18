// src/utils/icsGenerator.js
const ics = require('ics');

const dayMap = {
    pazartesi: 1,
    sali: 2,
    carsamba: 3,
    persembe: 4,
    cuma: 5,
    cumartesi: 6,
    pazar: 0
};

function getNextDayDate(targetDayIndex) {
    const now = new Date();
    const currentDay = now.getDay();
    
    const currentDayAdj = currentDay === 0 ? 7 : currentDay;
    const targetDayAdj = targetDayIndex === 0 ? 7 : targetDayIndex;
    
    const diff = targetDayAdj - currentDayAdj;
    
    const targetDate = new Date(now);
    targetDate.setDate(now.getDate() + diff);
    return targetDate;
}

function generateIcsFromTimetable(timetableData) {
    const events = [];

    for (const [dayKey, dayData] of Object.entries(timetableData)) {
        if (!dayMap.hasOwnProperty(dayKey)) continue;

        const targetDate = getNextDayDate(dayMap[dayKey]);
        const year = targetDate.getFullYear();
        const month = targetDate.getMonth() + 1;
        const date = targetDate.getDate();

        for (const [dersNo, dersBilgisi] of Object.entries(dayData.dersler)) {
            const [startStr, endStr] = dersBilgisi.saat.split(' ');
            const [startH, startM] = startStr.split(':').map(Number);
            const [endH, endM] = endStr.split(':').map(Number);

            events.push({
                start: [year, month, date, startH, startM],
                end: [year, month, date, endH, endM],
                title: `${dersBilgisi.ders}`,
                description: `Öğretmen: ${dersBilgisi.ogretmen || 'Belirtilmemiş'}\nSınıf: ${dersBilgisi.sinif || '-'}\nDerslik: ${dersBilgisi.derslik || '-'}`,
                location: dersBilgisi.derslik || '',
                recurrenceRule: 'FREQ=WEEKLY',
                busyStatus: dersBilgisi.ders === 'Öğle Arası' ? 'FREE' : 'BUSY',
                status: 'CONFIRMED'
            });
        }
    }

    const { error, value } = ics.createEvents(events);

    if (error) {
        console.error('[ERROR] (icsGenerator): ', error);
        throw error;
    }

    return value;
}

module.exports = { generateIcsFromTimetable };