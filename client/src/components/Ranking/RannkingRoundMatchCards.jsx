// [NUEVO ARCHIVO] src/components/ranking/RankingRoundMatchCard.jsx
// Card de UN partido de ranking (1 vs 1) dentro de una ronda: jugadores,
// rating de cada uno, diferencia de rating, estado y resultado si existe.
// Solo lo usa RankingRoundMatchList (vista de admin).
// [CAMBIO] + Button, Tooltip (botón de editar resultado y nota del admin)
import { Button, Card, Flex, Tag, Tooltip, Typography } from "antd";
// [CAMBIO] + EditOutlined, InfoCircleOutlined
import { CrownFilled, EditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import { BRAND } from "../../helpers/seasonConsants.js";
import ProfilePicture from "../uploads/ProfilePicture.jsx";

const { Text } = Typography;

// Textos visibles en inglés. `color` = preset de Tag de antd.
const MATCH_STATUS_META = {
    proposed: { label: "Proposed", color: "gold" },
    scheduled: { label: "Waiting for result", color: "blue" },
    played: { label: "Played", color: "green" },
    walkover: { label: "Walkover", color: "purple" },
    disputed: { label: "Disputed", color: "red" },
    admin_resolved: { label: "Resolved by admin", color: "cyan" },
    cancelled: { label: "Cancelled", color: "default" },
};

// Diferencia de rating a partir de la cual se avisa al admin de que el
// emparejamiento está descompensado (solo visual, no cambia nada).
const UNBALANCED_GAP = 150;

const fullName = (player) =>
    player ? [player.name, player.lastname].filter(Boolean).join(" ") || "Unknown player" : "Deleted user";

const formatScore = (match) => {
    if (!Array.isArray(match?.sets) || match.sets.length === 0) return null;
    const sets = match.sets.map((s) => `${s.gamesA}-${s.gamesB}`).join(" · ");
    const stb = match.superTieBreak?.played
        ? ` · [${match.superTieBreak.pointsA}-${match.superTieBreak.pointsB}]`
        : "";
    return sets + stb;
};

const PlayerRow = ({ player, rating, isWinner }) => (
    <Flex align="center" gap={10} style={{ minWidth: 0 }}>
        {/* key: ProfilePicture guarda la URL en estado interno; al cambiar de jugador hay que remontarlo */}
        <ProfilePicture
            key={player?._id ?? "deleted"}
            user={player}
            profilePicture={player?.profilePicture?.url}
            size={40}
            editable={false}
        />
        <Flex vertical style={{ minWidth: 0, flex: 1 }}>
            <Text strong ellipsis style={{ color: BRAND.navy }}>
                {fullName(player)}
                {isWinner && <CrownFilled style={{ color: BRAND.gold, marginLeft: 6 }} />}
            </Text>
            <Text type="secondary" style={{ fontSize: 12 }}>
                Rating {rating ?? "—"}
            </Text>
        </Flex>
    </Flex>
);

// [CAMBIO] NUEVO: estados en los que el admin puede fijar/corregir el resultado (igual que el servidor)
const EDITABLE_STATUSES = ["scheduled", "played", "disputed", "admin_resolved", "walkover"];

// [CAMBIO] NUEVO prop `onEditResult` (opcional): si llega, se muestra el botón de editar
const RankingRoundMatchCard = ({ match, index, onEditResult }) => {
    const statusKey = !match?.published && match?.status === "scheduled" ? "proposed" : match?.status;
    const status = MATCH_STATUS_META[statusKey] || { label: match?.status || "Unknown", color: "default" };

    const ratingA = match?.ratingBefore?.playerA;
    const ratingB = match?.ratingBefore?.playerB;
    const gap = Number.isFinite(ratingA) && Number.isFinite(ratingB) ? Math.abs(ratingA - ratingB) : null;

    const winnerId = match?.winner ? String(match.winner) : null;
    const score = formatScore(match);

    return (
        <Card style={{ borderRadius: 14, height: "100%" }} styles={{ body: { padding: 16 } }}>
            <Flex vertical gap={12}>
                <Flex justify="space-between" align="center" gap={8}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                        Match {index + 1}
                    </Text>
                    <Tag color={status.color} style={{ marginInlineEnd: 0 }}>
                        {status.label}
                    </Tag>
                </Flex>

                <PlayerRow
                    player={match?.playerA}
                    rating={ratingA}
                    isWinner={winnerId && winnerId === String(match?.playerA?._id)}
                />

                <Flex align="center" gap={8}>
                    <div style={{ flex: 1, height: 1, background: "#F0F0F0" }} />
                    <Text strong style={{ color: BRAND.green, fontSize: 12 }}>
                        VS
                    </Text>
                    <div style={{ flex: 1, height: 1, background: "#F0F0F0" }} />
                </Flex>

                <PlayerRow
                    player={match?.playerB}
                    rating={ratingB}
                    isWinner={winnerId && winnerId === String(match?.playerB?._id)}
                />

                <Flex justify="space-between" align="center" wrap gap={8}>
                    {gap !== null && (
                        <Tag color={gap >= UNBALANCED_GAP ? "orange" : "default"} style={{ marginInlineEnd: 0 }}>
                            Rating gap {gap}
                        </Tag>
                    )}
                    {score && (
                        <Text strong style={{ fontFamily: "monospace" }}>
                            {score}
                        </Text>
                    )}
                </Flex>

                {/* [CAMBIO] NUEVO: nota de auditoría del admin + botón para fijar/corregir el resultado */}
                {(match?.notes || (onEditResult && match?.published && EDITABLE_STATUSES.includes(match?.status))) && (
                    <Flex justify="space-between" align="center" gap={8}>
                        {match?.notes ? (
                            <Tooltip title={<span style={{ whiteSpace: "pre-line" }}>{match.notes}</span>}>
                                <Text type="secondary" style={{ fontSize: 12, cursor: "help" }}>
                                    <InfoCircleOutlined /> Admin note
                                </Text>
                            </Tooltip>
                        ) : <span />}
                        {onEditResult && match?.published && EDITABLE_STATUSES.includes(match?.status) && (
                            <Button
                                size="small"
                                type={match.status === "disputed" ? "primary" : "default"}
                                danger={match.status === "disputed"}
                                icon={<EditOutlined />}
                                onClick={() => onEditResult(match)}
                            >
                                {["scheduled", "disputed"].includes(match.status) ? "Set result" : "Edit result"}
                            </Button>
                        )}
                    </Flex>
                )}
            </Flex>
        </Card>
    );
};

export default RankingRoundMatchCard;