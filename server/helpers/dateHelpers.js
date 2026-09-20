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

    if(Number.isNaN(hours) || Number.isNaN(minutes)){
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

export const computeRoundWindow = (closeDate, closeTime, intervalDays) => {
    const start = buildMadridDateTime(closeDate, closeTime);
    if (!start) return { startDate: null, endDate: null };
    const end = addRoundInterval(start, intervalDays).subtract(1, 'minute');
    return { startDate: start.toDate(), endDate: end.toDate() };
};

// CHANGE: calcula edad exacta (no solo restar años del calendario — dayjs
// .diff(..., 'year') ya tiene en cuenta mes/día, así que alguien que cumple
// 18 mañana no pasa el check hoy).
export const isAtLeast18 = (dateOfBirth) => {
    if (!dateOfBirth) return false;
    const birth = dayjs(dateOfBirth);
    if (!birth.isValid()) return false;
    return dayjs().diff(birth, 'year') >= 18;
};

export {dayjs}