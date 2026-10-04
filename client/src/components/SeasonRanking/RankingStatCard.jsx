// src/components/ranking/RankingStatCard.jsx
// Card de una temporada: tipo, estado, fechas y cuenta atrás de inscripción.
import { Button, Card, Flex, Tag, Typography } from "antd";
import { CalendarOutlined, ClockCircleOutlined, OrderedListOutlined } from "@ant-design/icons";
import { BRAND, TYPE_META, FALLBACK_TYPE_META, STATUS_META } from "../../helpers/seasonConsants.js";
import { buildMadridMoment, fmtDateTime,fmtShortDate, formatRemaining } from "../utils/Madridtime.js";
import { useNavigate } from "react-router-dom";


const { Text } = Typography;

// Estado de la temporada calculado con fechas (hora de Madrid)
const getSeasonStatus = (start, end, now) => {
    if (!start) return "unknown";
    if (now < start.getTime()) return "upcoming";
    if (end && now > end.getTime()) return "finished";
    return "active";
};

// SUPUESTO de campos del backend (confírmalos):
// name, type, year, startDate, endDate, registrationDeadline (fecha), registrationDeadlineTime ("HH:mm")
const RankingStatCard = ({ season, now }) => {

    const navigate = useNavigate()

    //console.log(season)

    const meta = TYPE_META[season?.type] || FALLBACK_TYPE_META;
    const title = season?.name || [season?.type, season?.year].filter(Boolean).join(" ") || "Untitled season";

    const start = buildMadridMoment(season?.startDate, "00:00");
    const end = buildMadridMoment(season?.endDate, "23:59");
    const status = STATUS_META[getSeasonStatus(start, end, now)];

    const deadline = season?.registrationDeadline
    ? new Date(season.registrationDeadline)
    : null; 


    const remaining = deadline ? deadline.getTime() - now : null;
    const isRegistrationOpen = remaining !== null && remaining > 0;

    return (
        <Card
            style={{ borderRadius: 14, borderTop: `4px solid ${meta.color}`, height: "100%" }}
            styles={{ body: { padding: 16 } }}
        >
            <Flex vertical gap={12}>
                {/* Cabecera: emoji + nombre + tipo | estado */}
                <Flex justify="space-between" align="flex-start" gap={8}>
                    <Flex align="center" gap={10} style={{ minWidth: 0 }}>
                        <Flex
                            align="center"
                            justify="center"
                            style={{ width: 40, height: 40, borderRadius: 12, background: meta.soft, fontSize: 20, flexShrink: 0 }}
                        >
                            {meta.emoji}
                        </Flex>
                        <Flex vertical style={{ minWidth: 0 }}>
                            <Text strong ellipsis style={{ fontSize: 16, color: BRAND.navy }}>
                                {title}
                            </Text>
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {season?.type || "Unknown type"}
                            </Text>
                        </Flex>
                    </Flex>
                    <Tag color={status.color} style={{ marginInlineEnd: 0 }}>
                        {status.label}
                    </Tag>
                </Flex>

                {/* Fechas de la temporada */}
                <Flex align="center" gap={8}>
                    <CalendarOutlined style={{ color: meta.color }} />
                    <Text>
                        {/* [CAMBIO] fmtShortDate en el inicio (antes fmtDateTime mostraba "00:00" y no cuadraba con el fin) */}
                        {fmtShortDate(start)} – {fmtShortDate(end)}
                    </Text>
                </Flex>

                {/* Inscripción: cuenta atrás / cerrada / sin fecha */}
                <Flex
                    align="flex-start"
                    gap={8}
                    style={{ background: meta.soft, borderRadius: 10, padding: "10px 12px" }}
                >
                    <ClockCircleOutlined style={{ color: isRegistrationOpen ? BRAND.green : "#8C8C8C", marginTop: 4 }} />
                    {!deadline && <Text type="secondary">No registration deadline set</Text>}
                    {deadline && (
                        <Flex vertical>
                            {isRegistrationOpen ? (
                                <Text strong style={{ color: BRAND.green }}>
                                    Registration closes in {formatRemaining(remaining)}
                                </Text>
                            ) : (
                                <Text strong type="secondary">
                                    Registration closed
                                </Text>
                            )}
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {fmtDateTime(deadline)} (Madrid time)
                            </Text>
                        </Flex>
                    )}
                </Flex>
                {season?._id && (
                    <Button
                        icon={<OrderedListOutlined />}
                        onClick={() => navigate(`/admin/seasons/${season?._id}/rounds`)}
                        block
                    >
                        Manage rounds
                    </Button>
                )}
            </Flex>
        </Card>
    );
};

export default RankingStatCard;