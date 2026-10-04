// [NUEVO ARCHIVO] src/components/Ranking/RankingRoundMatches.jsx
// Pestaña "Round matches" de /ranking: TODOS los partidos publicados de la
// temporada activa, ronda a ronda, para que cualquier jugador vea quién juega
// con quién y los resultados (aunque no juegue ese partido).
// Carga sus propios datos (GET /ranking/matches?round=N).
//
// Seguridad: el servidor solo envía nombre, apellido y foto de cada jugador
// (nunca teléfono, rating ni penalizaciones) y nunca propuestas sin publicar.
import { useEffect, useState } from "react";
import { Alert, Col, Empty, Flex, Progress, Row, Select, Skeleton, Typography } from "antd";
import { getPublicRoundMatches } from "../../actions/ranking";
import { BRAND } from "../../helpers/seasonConsants.js";
import RankingMiniScore from "./RankingMiniScore";

const { Text, Title } = Typography;

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    if (Array.isArray(data)) return data[0]?.msg || fallback;
    return data?.message || fallback;
};

// Insignia y barra lateral por estado (textos visibles en inglés)
const STATUS_META = {
    scheduled: { badge: { label: "To be played", variant: "pending" }, variant: "pending" },
    played: { badge: { label: "Final", variant: "neutral" }, variant: "won" },
    admin_resolved: { badge: { label: "Resolved by admin", variant: "neutral" }, variant: "won" },
    walkover: { badge: { label: "Walkover", variant: "neutral" }, variant: "won" },
    disputed: { badge: { label: "Pending admin decision", variant: "disputed" }, variant: "disputed" },
    cancelled: { badge: { label: "Cancelled", variant: "neutral" }, variant: null },
};

const toTopBottom = (m) => ({
    sets: (m.sets || []).map((s) => ({ top: s.gamesA, bottom: s.gamesB })),
    stb: m.superTieBreak?.played ? { top: m.superTieBreak.pointsA, bottom: m.superTieBreak.pointsB } : null,
});

const RankingRoundMatches = ({ currentUserId }) => {
    const [round, setRound] = useState(null); // null = última ronda publicada
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await getPublicRoundMatches(round);
                if (active) setData(res);
            } catch (err) {
                if (active) setError(getErrorMessage(err, "Could not load the round matches. Please try again."));
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, [round]);

    if (error) return <Alert type="error" showIcon title={error} />;
    if (!loading && !data?.season) return <Empty description="There is no active ranking season right now." />;
    if (!loading && !data?.selectedRound) return <Empty description="No round has been published yet." />;

    const rounds = data?.rounds || [];
    const matches = data?.matches || [];
    const selected = rounds.find((r) => r.round === data?.selectedRound);
    const isMine = (m) =>
        !!currentUserId && [m.playerA?._id, m.playerB?._id].some((id) => id && String(id) === String(currentUserId));

    // Mi partido primero; el resto en el orden del servidor
    const ordered = [...matches].sort((a, b) => Number(isMine(b)) - Number(isMine(a)));

    return (
        <Flex vertical gap={16}>
            <Flex justify="space-between" align="center" wrap gap={12}>
                <Flex vertical>
                    <Text type="secondary" style={{ fontSize: 12 }}>{data?.season?.name}</Text>
                    <Title level={4} style={{ margin: 0, color: BRAND.navy }}>
                        Round {data?.selectedRound ?? "—"}
                    </Title>
                </Flex>

                <Flex align="center" gap={12} wrap>
                    {selected && (
                        <Flex align="center" gap={8}>
                            <Progress
                                type="circle"
                                size={36}
                                percent={selected.total ? Math.round((selected.finished / selected.total) * 100) : 0}
                                strokeColor={BRAND.green}
                                format={() => null}
                            />
                            <Text type="secondary" style={{ fontSize: 12 }}>
                                {selected.finished}/{selected.total} played
                            </Text>
                        </Flex>
                    )}
                    <Select
                        value={data?.selectedRound ?? undefined}
                        onChange={setRound}
                        disabled={loading || rounds.length < 2}
                        style={{ minWidth: 130 }}
                        options={rounds.map((r) => ({ value: r.round, label: `Round ${r.round}` }))}
                    />
                </Flex>
            </Flex>

            {loading ? (
                <Row gutter={[12, 12]}>
                    {[0, 1, 2, 3].map((i) => (
                        <Col key={i} xs={24} md={12} xl={8}>
                            <Skeleton active paragraph={{ rows: 2 }} />
                        </Col>
                    ))}
                </Row>
            ) : ordered.length === 0 ? (
                <Empty description="No matches in this round." />
            ) : (
                <Row gutter={[12, 12]}>
                    {ordered.map((m, i) => {
                        const meta = STATUS_META[m.status] || { badge: { label: m.status, variant: "neutral" }, variant: null };
                        const { sets, stb } = toTopBottom(m);
                        const mine = isMine(m);
                        const meId = currentUserId ? String(currentUserId) : null;
                        return (
                            <Col key={m._id} xs={24} md={12} xl={8}>
                                <RankingMiniScore
                                    index={i}
                                    title={mine ? "Your match" : `Match ${matches.indexOf(m) + 1}`}
                                    badge={meta.badge}
                                    variant={meta.variant}
                                    mine={mine}
                                    top={{ player: m.playerA, isWinner: m.winner === "A", isMe: !!meId && String(m.playerA?._id) === meId }}
                                    bottom={{ player: m.playerB, isWinner: m.winner === "B", isMe: !!meId && String(m.playerB?._id) === meId }}
                                    sets={sets}
                                    stb={stb}
                                />
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Flex>
    );
};

export default RankingRoundMatches;