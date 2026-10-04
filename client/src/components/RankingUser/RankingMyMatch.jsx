// [NUEVO ARCHIVO] src/components/Ranking/RankingMyMatch.jsx
// Pestaña "My match" de /ranking (solo jugadores inscritos).
// Muestra: mi posición, el cierre de la ronda, mi partido de la ronda publicada
// (rival + teléfono mientras esté por jugar + botón "Report result") y mi
// historial de la temporada. Carga sus propios datos (GET /ranking/me/match).
//
// Seguridad: el teléfono del rival SOLO lo devuelve el servidor para el partido
// actual 'scheduled'. Las propuestas sin publicar nunca llegan aquí.
import { useCallback, useEffect, useState } from "react";
// [CAMBIO] quitado Divider (el historial ahora lo pinta RankingMatchHistory)
import { Alert, Button, Card, Col, Empty, Flex, Row, Skeleton, Statistic, Tag, Typography } from "antd"; // List no: deprecated en antd 6
// [CAMBIO] quitado CrownFilled: la corona del ganador ahora la pinta RankingMatchScoreboard
import { PhoneOutlined, TrophyOutlined } from "@ant-design/icons";
import { getMyRankingMatch } from "../../actions/ranking";
import { BRAND } from "../../helpers/seasonConsants.js";
import { fmtDateTime, formatRemaining } from "../utils/Madridtime.js";
import ProfilePicture from "../uploads/ProfilePicture";
import RankingResultModal from "../modals/RankingResultModal.jsx";
// [CAMBIO] NUEVO: marcador animado del partido jugado (banner ganador/perdedor + sets + súper tie break)
import RankingMatchScoreboard from "./RankingMatchScoreBoard.jsx";
// [CAMBIO] NUEVO: historial como mini marcadores (antes una lista plana con Divider)
import RankingMatchHistory from "./RankingMatchHistory";

const { Text, Title } = Typography;

// Textos visibles en inglés. `color` = preset de Tag de antd.
const MATCH_STATUS_META = {
    scheduled: { label: "To be played", color: "blue" },
    played: { label: "Played", color: "green" },
    walkover: { label: "Walkover", color: "purple" },
    disputed: { label: "Pending admin decision", color: "red" },
    admin_resolved: { label: "Resolved by admin", color: "cyan" },
    cancelled: { label: "Cancelled", color: "default" },
};

const RANKING_STATUS_META = {
    active: { label: "Active", color: "green" },
    suspended: { label: "Suspended", color: "red" },
    retired: { label: "Retired", color: "default" },
};

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    if (Array.isArray(data)) return data[0]?.msg || fallback;
    return data?.message || fallback;
};

const fullName = (p) => (p ? [p.name, p.lastname].filter(Boolean).join(" ") || "Unknown player" : "Deleted user");

// [CAMBIO] quitados formatMyScore y ResultTag: ya no se usan (marcador e historial están en sus componentes)

// Cuenta atrás que se refresca cada minuto
const useNow = () => {
    const [now, setNow] = useState(() => Date.now());
    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), 60000);
        return () => clearInterval(id);
    }, []);
    return now;
};

const RankingMyMatch = ({ isMobile }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [resultOpen, setResultOpen] = useState(false);
    const now = useNow();

    const reload = useCallback(() => setReloadKey((k) => k + 1), []);

    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getMyRankingMatch();
                if (active) setData(res);
            } catch (err) {
                if (active) setError(getErrorMessage(err, "Could not load your ranking match. Please try again."));
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, [reloadKey]);

    if (loading) return <Skeleton active avatar paragraph={{ rows: 4 }} />;
    if (error) return <Alert type="error" showIcon title={error} />;
    if (!data?.season) return <Empty description="There is no active ranking season right now." />;

    const { season, myRanking, currentRound, currentMatch, history = [] } = data;
    const closeMs = season.roundCloseAt ? new Date(season.roundCloseAt).getTime() - now : null;
    const rankingStatus = myRanking ? RANKING_STATUS_META[myRanking.status] : null;

    const renderCurrentMatch = () => {
        if (!myRanking) {
            return <Empty description="You will get a ranking position and an opponent when the next round is generated." />;
        }
        if (myRanking.status === "suspended") {
            return (
                <Alert
                    type="error"
                    showIcon
                    title="You are currently suspended from the ranking"
                    description={myRanking.suspendedUntilRound ? `You can play again from round ${myRanking.suspendedUntilRound}.` : "Please contact the administration."}
                />
            );
        }
        if (!currentRound) return <Empty description="No round has been published yet. Your opponent will appear here." />;
        if (!currentMatch) {
            return <Empty description={`You have no match in round ${currentRound}. This happens when there is an odd number of players or you joined after the round was generated.`} />;
        }

        const status = MATCH_STATUS_META[currentMatch.status] || { label: currentMatch.status, color: "default" };
        const opponent = currentMatch.opponent;

        return (
            <Flex vertical gap={16}>
                <Flex align="center" gap={12} wrap>
                    {/* key: ProfilePicture guarda la URL en estado interno; al cambiar de rival hay que remontarlo */}
                    <ProfilePicture key={opponent?._id ?? "deleted"} user={opponent} profilePicture={opponent?.profilePicture?.url} size={56} editable={false} />
                    <Flex vertical style={{ minWidth: 0, flex: 1 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>Your opponent</Text>
                        {/* [CAMBIO] quitada la corona junto al nombre (ahora va en el marcador) */}
                        <Text strong style={{ fontSize: 16, color: BRAND.navy }}>
                            {fullName(opponent)}
                        </Text>
                        {opponent?.phone && (
                            <a href={`tel:${opponent.phone}`}>
                                <PhoneOutlined /> {opponent.phone}
                            </a>
                        )}
                    </Flex>
                    <Tag color={status.color} style={{ marginInlineEnd: 0 }}>{status.label}</Tag>
                </Flex>

                {currentMatch.status === "scheduled" && (
                    <>
                        <Alert
                            type="info"
                            showIcon
                            title="You are responsible for scheduling this match with your opponent"
                            description="Report the result before the round closes. If nobody reports it, both players receive 1 penalty point and the administration decides the result."
                        />
                        <Button type="primary" size="large" block={isMobile} onClick={() => setResultOpen(true)} style={{ background: BRAND.green }}>
                            Report result
                        </Button>
                    </>
                )}

                {/* [CAMBIO] antes: texto monoespaciado "5-7 · 6-1 · [21-23]" + Tag Won/Lost + "Reported by".
                    Ahora: marcador estilo TV con banner animado (key = remonta si cambia el partido) */}
                {currentMatch.result && (
                    <RankingMatchScoreboard key={currentMatch._id} match={currentMatch} />
                )}

                {currentMatch.status === "disputed" && (
                    <Alert
                        type="warning"
                        showIcon
                        title="No result was reported before the round closed"
                        description="The administration will decide the result. Both players received 1 penalty point."
                    />
                )}
            </Flex>
        );
    };

    return (
        <Row gutter={[16, 16]}>
            {/* Resumen: posición, penalizaciones, cierre de ronda */}
            <Col xs={24}>
                <Card style={{ borderRadius: 14 }}>
                    <Row gutter={[16, 16]}>
                        <Col xs={12} md={6}>
                            <Statistic
                                title="Your position"
                                value={myRanking?.rank ?? "—"}
                                prefix={myRanking?.rank ? <TrophyOutlined style={{ color: BRAND.gold }} /> : null}
                            />
                            {rankingStatus && myRanking.status !== "active" && (
                                <Tag color={rankingStatus.color}>{rankingStatus.label}</Tag>
                            )}
                        </Col>
                        <Col xs={12} md={6}>
                            <Statistic title="Penalty points" value={myRanking?.penaltyPoints ?? 0} />
                        </Col>
                        <Col xs={24} md={12}>
                            <Text type="secondary">{season.name}{currentRound ? ` · Round ${currentRound}` : ""}</Text>
                            <Title level={5} style={{ margin: "4px 0 0", color: BRAND.navy }}>
                                {season.roundCloseAt ? `Round closes ${fmtDateTime(season.roundCloseAt)}` : "Round close date not set"}
                            </Title>
                            {closeMs !== null && closeMs > 0 && (
                                <Text type="secondary">({formatRemaining(closeMs)} left, Madrid time)</Text>
                            )}
                        </Col>
                    </Row>
                </Card>
            </Col>

            {/* Partido de la ronda actual */}
            <Col xs={24} lg={14}>
                <Card title={currentRound ? `Round ${currentRound} match` : "Current match"} style={{ borderRadius: 14, height: "100%" }}>
                    {renderCurrentMatch()}
                </Card>
            </Col>

            {/* Historial de la temporada */}
            <Col xs={24} lg={10}>
                <Card title="Your previous matches" style={{ borderRadius: 14, height: "100%" }}>
                    {/* [CAMBIO] antes: lista plana (texto + Divider). Ahora: mini marcadores con color por resultado */}
                    <RankingMatchHistory history={history} />
                </Card>
            </Col>

            <RankingResultModal
                open={resultOpen}
                match={currentMatch}
                onClose={() => setResultOpen(false)}
                onSubmitted={() => {
                    setResultOpen(false);
                    reload();
                }}
            />
        </Row>
    );
};

export default RankingMyMatch;