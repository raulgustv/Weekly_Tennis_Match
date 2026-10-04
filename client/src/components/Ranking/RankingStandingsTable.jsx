// [NUEVO ARCHIVO] src/components/ranking/RankingStandingsTable.jsx
// Clasificación actual de la temporada (vista admin): posición, jugador,
// rating, puntos de penalización, estado y última ronda jugada.
// Debajo, los jugadores inscritos que aún no tienen posición (entran en la
// última posición cuando se genere la próxima propuesta de ronda).
// No llama a la API: recibe los datos de RankingRounds.jsx.
import { Alert, Card, Empty, Flex, Grid, Table, Tag, Typography } from "antd";
import { TrophyFilled } from "@ant-design/icons";
import ProfilePicture from "../uploads/ProfilePicture";
import { BRAND } from "../../helpers/seasonConsants.js";
import { fmtShortDate } from "../utils/Madridtime.js";

const { Text } = Typography;
const { useBreakpoint } = Grid;

// Textos visibles en inglés. `color` = preset de Tag de antd.
const STANDING_STATUS_META = {
    active: { label: "Active", color: "green" },
    suspended: { label: "Suspended", color: "red" },
    retired: { label: "Retired", color: "default" },
};

// Colores de las 3 primeras posiciones (oro, plata, bronce)
const PODIUM_COLORS = { 1: BRAND.gold, 2: "#BFBFBF", 3: "#CD7F32" };

const fullName = (player) =>
    player ? [player.name, player.lastname].filter(Boolean).join(" ") || "Unknown player" : "Deleted user";

const PlayerCell = ({ player }) => (
    <Flex align="center" gap={10} style={{ minWidth: 0 }}>
        {/* key: ProfilePicture guarda la URL en estado interno; al cambiar de jugador hay que remontarlo */}
        <ProfilePicture
            key={player?._id ?? "deleted"}
            user={player}
            profilePicture={player?.profilePicture?.url}
            size={32}
            editable={false}
        />
        <Text strong ellipsis style={{ color: BRAND.navy }}>
            {fullName(player)}
        </Text>
    </Flex>
);

const RankingStandingsTable = ({ standings = [], pendingPlayers = [], loading = false, error = null }) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const columns = [
        {
            title: "#",
            dataIndex: "rank",
            key: "rank",
            width: 64,
            // Solo los activos tienen posición real; suspendidos/retirados conservan
            // su número antiguo en BD, que ya no es una posición válida.
            render: (rank, row) =>
                row.status === "active" ? (
                    <Flex align="center" gap={4}>
                        {PODIUM_COLORS[rank] && <TrophyFilled style={{ color: PODIUM_COLORS[rank] }} />}
                        <Text strong>{rank}</Text>
                    </Flex>
                ) : (
                    <Text type="secondary">—</Text>
                ),
        },
        {
            title: "Player",
            key: "player",
            render: (_, row) => <PlayerCell player={row.player} />,
        },
        {
            title: "Rating",
            dataIndex: "rating",
            key: "rating",
            width: 90,
            align: "right",
        },
        {
            title: "Penalty pts",
            dataIndex: "penaltyPoints",
            key: "penaltyPoints",
            width: 110,
            align: "center",
            responsive: ["sm"],
            render: (points) => (
                <Tag color={points >= 3 ? "red" : points > 0 ? "orange" : "default"} style={{ marginInlineEnd: 0 }}>
                    {points}
                </Tag>
            ),
        },
        {
            title: "Status",
            dataIndex: "status",
            key: "status",
            width: 120,
            responsive: ["md"],
            render: (status, row) => {
                const meta = STANDING_STATUS_META[status] || { label: status || "Unknown", color: "default" };
                return (
                    <Flex vertical>
                        <Tag color={meta.color} style={{ marginInlineEnd: 0, width: "fit-content" }}>
                            {meta.label}
                        </Tag>
                        {status === "suspended" && row.suspendedUntilRound && (
                            <Text type="secondary" style={{ fontSize: 11 }}>
                                Until round {row.suspendedUntilRound}
                            </Text>
                        )}
                    </Flex>
                );
            },
        },
        {
            title: "Last round",
            dataIndex: "lastRoundPlayed",
            key: "lastRoundPlayed",
            width: 100,
            align: "center",
            responsive: ["md"],
            render: (round) => (round ? round : <Text type="secondary">—</Text>),
        },
    ];

    if (error) {
        return <Alert type="error" showIcon title={error} />;
    }

    return (
        <Flex vertical gap={16}>
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={standings}
                loading={loading}
                pagination={false}
                size={isMobile ? "small" : "middle"}
                scroll={{ x: "max-content" }}
                locale={{ emptyText: <Empty description="No players in this season's ranking yet" /> }}
            />

            {!loading && pendingPlayers.length > 0 && (
                <Card size="small" style={{ borderRadius: 12 }} title={`Registered, waiting for a position (${pendingPlayers.length})`}>
                    <Flex vertical gap={8}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            These players will join at the last position when the next round is proposed.
                        </Text>
                        <Flex wrap gap={8}>
                            {pendingPlayers.map((p) => (
                                <Tag key={p._id}>
                                    {fullName(p)}
                                    {p.rankingRegisteredAt && ` · since ${fmtShortDate(p.rankingRegisteredAt)}`}
                                </Tag>
                            ))}
                        </Flex>
                    </Flex>
                </Card>
            )}
        </Flex>
    );
};

export default RankingStandingsTable;