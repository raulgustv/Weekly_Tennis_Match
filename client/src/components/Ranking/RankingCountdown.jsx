import { useNavigate } from 'react-router-dom';
import useNow from '../../hooks/useNow';
import { useEffect, useState } from 'react';
import { getUpcomingSeason } from '../../actions/ranking';
import { buildMadridMoment, formatRemaining, fmtDateTime } from '../utils/Madridtime';
import { Card, Flex, Typography, Button } from 'antd';
import { BRAND, FALLBACK_TYPE_META, TYPE_META } from '../../helpers/seasonConsants';
import {
  ClockCircleOutlined, RightOutlined
} from "@ant-design/icons";

const { Text } = Typography

const getRoundOneStart = (season) => {
    if (!season?.nextRoundCloseDate || !season?.roundCloseTime) return null;

    const interval = Number(season.roundIntervalDays);
    if (!Number.isInteger(interval) || interval <= 0) return null;

    const day = new Date(season.nextRoundCloseDate);
    if (Number.isNaN(day.getTime())) return null;

    day.setUTCDate(day.getUTCDate() - interval)

    return buildMadridMoment(day, season?.roundCloseTime)
}

const toValidDate = (value) => {
    if (!value) return null;

    const d = new Date(value)

    return Number.isNaN(d.getTime()) ? null : d;
}

const splitRemaining = (ms) => {
    const total = Math.max(0, Math.floor(ms / 1000));

    return {
        days: Math.floor(total / 86400),
        hours: Math.floor((total % 86400) / 3600),
        minutes: Math.floor((total % 3600) / 60),
        seconds: total % 60
    }
}

const pad = (n) => String(n).padStart(2, "0")

const RankingCountdown = ({ showRankingLink = false }) => {

    const navigate = useNavigate();
    const now = useNow(1000);

    const [season, setSeason] = useState(null);

    useEffect(() => {
        let active = true;

        const loadSeason = async () => {
            try {
                const data = await getUpcomingSeason();

                if (active) setSeason(data?.season ?? null)

                //console.log(data)
            } catch (error) {
                console.log(error)
                if (active) setSeason(null)
            }
        }

        loadSeason();
        return () => {
            active = false;
        }
    }, [])

    //console.log(season)


    const start = getRoundOneStart(season)

    if (!season || !start || now >= start.getTime()) return null;

    const deadline = toValidDate(season?.registrationDeadline)
    const registrationOpen = deadline && now < deadline.getTime();


    const meta = TYPE_META[season?.type] || FALLBACK_TYPE_META;
    const title = season?.name || [season?.type, season?.year].filter(Boolean).join(" ") || "The new season";
    const { days, hours, minutes, seconds } = splitRemaining(start.getTime() - now);


    const units = [
        { label: "Days", value: days },
        { label: "Hours", value: pad(hours) },
        { label: "Min", value: pad(minutes) },
        { label: "Sec", value: pad(seconds) },
    ];

    return (
        <Card
            style={{
                marginBottom: 20,
                borderRadius: 14,
                border: "none",
                background: BRAND.gradient,
                overflow: "hidden",
            }}
            styles={{ body: { padding: 20 } }}
        >
            <Flex vertical gap={14}>
                {/* Título */}
                <Flex align="center" gap={8} wrap>
                    <span style={{ fontSize: 22 }} aria-hidden>{meta.emoji}</span>
                    <Text strong style={{ color: "#fff", fontSize: 17 }}>
                        {title} ranking starts in
                    </Text>
                </Flex>

                {/* Contador */}
                <Flex gap={8} wrap>
                    {units.map((u) => (
                        <Flex
                            key={u.label}
                            vertical
                            align="center"
                            style={{
                                minWidth: 62,
                                padding: "8px 10px",
                                borderRadius: 10,
                                background: "rgba(255,255,255,.14)",
                            }}
                        >
                            <Text strong style={{ color: "#fff", fontSize: 22, lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
                                {u.value}
                            </Text>
                            <Text style={{ color: "rgba(255,255,255,.8)", fontSize: 11 }}>
                                {u.label}
                            </Text>
                        </Flex>
                    ))}
                </Flex>

                {/* Fechas */}
                <Flex vertical gap={4}>
                    <Text style={{ color: "rgba(255,255,255,.9)", fontSize: 13 }}>
                        Round 1 starts on {fmtDateTime(start)} (Madrid time)
                    </Text>

                    {registrationOpen && (
                        <Text style={{ color: BRAND.gold, fontSize: 13 }}>
                            <ClockCircleOutlined /> Registration closes on {fmtDateTime(deadline)} · {formatRemaining(deadline.getTime() - now)} left
                        </Text>
                    )}
                    {deadline && !registrationOpen && (
                        <Text style={{ color: "rgba(255,255,255,.8)", fontSize: 13 }}>
                            Registration is closed
                        </Text>
                    )}
                </Flex>

                {showRankingLink && (
                    <Button
                        onClick={() => navigate("/ranking")}
                        icon={<RightOutlined />}
                        iconPosition="end"
                        style={{ alignSelf: "flex-start", borderRadius: 999, fontWeight: 600 }}
                    >
                        {registrationOpen ? "Join the ranking" : "View ranking"}
                    </Button>
                )}
            </Flex>
        </Card>
    );
}

export default RankingCountdown