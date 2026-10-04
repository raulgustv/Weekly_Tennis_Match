// [NUEVO ARCHIVO] src/components/Ranking/RankingMatchHistory.jsx
// "Your previous matches" (pestaña My match): mis partidos anteriores de la
// temporada como mini marcadores (RankingMiniScore), con barra verde si gané,
// roja suave si perdí y naranja si está pendiente de decisión del admin.
// Recibe `history` de RankingMyMatch (GET /ranking/me/match): no llama a la API.
import { Empty, Flex, Typography } from "antd";
import { useAuth } from "../../context";
import RankingMiniScore from "./RankingMiniScore";

const { Text } = Typography;

// Insignia y color de barra según el resultado/estado (textos visibles en inglés)
const outcomeMeta = (m) => {
    if (m.result === "won") return { badge: { label: "Won", variant: "won" }, variant: "won" };
    if (m.result === "lost") return { badge: { label: "Lost", variant: "lost" }, variant: "lost" };
    if (m.status === "disputed") return { badge: { label: "Pending admin decision", variant: "disputed" }, variant: "disputed" };
    if (m.status === "cancelled") return { badge: { label: "Cancelled", variant: "neutral" }, variant: null };
    if (m.status === "walkover") return { badge: { label: "Walkover", variant: "neutral" }, variant: null };
    return { badge: { label: "Not played", variant: "neutral" }, variant: null };
};

// Sets y súper tie break vistos como "yo (arriba) / rival (abajo)"
const toTopBottom = (m) => {
    const meIsA = m.mySide === "A";
    const sets = (m.sets || []).map((s) => ({ top: meIsA ? s.gamesA : s.gamesB, bottom: meIsA ? s.gamesB : s.gamesA }));
    const stb = m.superTieBreak?.played
        ? {
            top: meIsA ? m.superTieBreak.pointsA : m.superTieBreak.pointsB,
            bottom: meIsA ? m.superTieBreak.pointsB : m.superTieBreak.pointsA,
        }
        : null;
    return { sets, stb };
};

const RankingMatchHistory = ({ history = [] }) => {
    const { user } = useAuth();

    if (history.length === 0) {
        return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No previous matches this season" />;
    }

    const wins = history.filter((m) => m.result === "won").length;
    const losses = history.filter((m) => m.result === "lost").length;

    return (
        <Flex vertical gap={10}>
            <Text type="secondary" style={{ fontSize: 12 }}>
                Season record: <Text strong style={{ color: "#1E7F43" }}>{wins}W</Text> · <Text strong style={{ color: "#B54848" }}>{losses}L</Text>
            </Text>

            {history.map((m, i) => {
                const { badge, variant } = outcomeMeta(m);
                const { sets, stb } = toTopBottom(m);
                return (
                    <RankingMiniScore
                        key={m._id}
                        index={i}
                        title={`Round ${m.round}`}
                        badge={badge}
                        variant={variant}
                        top={{ player: user, label: "You", isWinner: m.result === "won" }}
                        bottom={{ player: m.opponent, isWinner: m.result === "lost" }}
                        sets={sets}
                        stb={stb}
                    />
                );
            })}
        </Flex>
    );
};

export default RankingMatchHistory;