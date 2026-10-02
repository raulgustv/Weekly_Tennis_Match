import { useEffect, useState } from "react";
import {ArrowLeftOutlined} from "@ant-design/icons";
import RankingStatCard from "../../components/ranking/RankingStatCard";


const BRAND = {
    navy: "#0B2C3D",
    green: "#1E7F43",
    gold: "#F4D03F",
    gradient: "linear-gradient(120deg, #0B2C3D 0%, #13506B 55%, #1E7F43 100%)",
};

const TYPE_META = {
    Winter: { emoji: "❄️", color: "#4DA3FF", soft: "#EAF4FF" },
    Spring: { emoji: "🌱", color: "#52C41A", soft: "#EFFAE8" },
    Summer: { emoji: "☀️", color: "#FA8C16", soft: "#FFF4E6" },
    Fall: { emoji: "🍂", color: "#B5651D", soft: "#FBF0E6" },
};
 
const MADRID_TZ = 'Europe/Madrid';

const madridOffsetMs = (utcMs) => {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: MADRID_TZ,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    }).formatToParts(new Date(utcMs));


    const get = (type) => Number(parts.find((p) => p.type === type)?.value);
    const asUtc = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
    return asUtc - utcMs;
};

const buildMadridMoment = (dateValue, time) => {
    if (!dateValue || !time) return null;
    const d = new Date(dateValue);
    if (Number.isNaN(d.getTime())) return null;
 
    const [h, m] = String(time).split(":").map(Number);
    if (Number.isNaN(h) || Number.isNaN(m)) return null;
 
    const naiveUtc = Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), h, m);
    // Dos pasadas para que el cambio de hora (DST) quede bien
    let result = naiveUtc - madridOffsetMs(naiveUtc);
    result = naiveUtc - madridOffsetMs(result);
    return new Date(result);
};
 
const fmt = (value, options) => {
    if (!value) return "—";
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return "—";
    return new Intl.DateTimeFormat("en-GB", { timeZone: MADRID_TZ, ...options }).format(d);
};
 
const fmtDateTime = (value) =>
    fmt(value, { weekday: "short", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
 
const fmtShortDate = (value) => fmt(value, { day: "2-digit", month: "short", year: "numeric" });



// "3d 4h 12m" / "4h 12m" / "12m" / "Closing now"
const formatRemaining = (ms) => {
    if (ms <= 0) return "Closing now";
    const totalMin = Math.floor(ms / 60000);
    const days = Math.floor(totalMin / 1440);
    const hours = Math.floor((totalMin % 1440) / 60);
    const mins = totalMin % 60;
    if (days > 0) return `${days}d ${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
};
 
// Reloj que se actualiza cada 30 s (para la cuenta atrás)
const useNow = (intervalMs = 30000) => {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), intervalMs);
        return () => clearInterval(id);
    }, [intervalMs]);
    return now;
};

const getErrorMessage = (error, fallback) => error?.response?.data?.message || fallback;
 


const RankingSeason = () => {


    return (
        <>
            <RankingStatCard />
        </>
    )
}

export default RankingSeason