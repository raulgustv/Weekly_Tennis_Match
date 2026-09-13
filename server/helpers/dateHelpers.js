import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js'

dayjs.extend(utc);
dayjs.extend(timezone);

export const MADRID_TIMEZONE = 'Europe/Madrid';

export const buildMadridDateTime = (date, time) =>{
    if(!date || !time) return null;

    const dateString = dayjs(date).utc().format('YYYY-MM-DD');
    const [hours, minutes] = time.split(':').map(Number);

    if(Number.isNaN(hours) || Number.isNaN(mintues)){
        console.log('Invalid time string: ', time)
        return null;
    }

    return dayjs.tz(
        `${dateString} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
        'YYYY-MM-DD HH:mm',
        MADRID_TIMEZONE
    )
};

export const addRoundInterval = (madridTimeDate, intervalDays) =>{
    return madridTimeDate.add(intervalDays, 'day')
};

export {dayjs}