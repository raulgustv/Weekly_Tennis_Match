// [NUEVO ARCHIVO] src/components/Ranking/RankingPublicStandings.jsx
// Pestaña "Standings" de /ranking: clasificación pública de la temporada
// activa (GET /ranking/standings). Posición, jugador, jugados y W-L.
// Resalta la fila del usuario logueado.
//
// No muestra rating ni puntos de penalización: son solo para admin
// (la vista admin es RankingStandingsTable.jsx, que NO se toca).
import { useEffect, useState } from "react";
import { Alert, Empty, Flex, Grid, Table, Tag, Typography } from "antd";
import { TrophyFilled } from "@ant-design/icons";
import { getRankingStandings } from "../../actions/ranking";
import { BRAND } from "../../helpers/seasonConsants.js";
import ProfilePicture from "../uploads/ProfilePicture";

const { Text, Title } = Typography;
const { useBreakpoint } = Grid;

// Colores de las 3 primeras posiciones (oro, plata, bronce) — igual que la vista admin
const PODIUM_COLORS = { 1: BRAND.gold, 2: "#BFBFBF", 3: "#CD7F32" };

const fullName = (p) => (p ? [p.name, p.lastname].filter(Boolean).join(" ") || "Unknown player" : "Former player");

const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    if (Array.isArray(data)) return data[0]?.msg || fallback;
    return data?.message || fallback;
};

const RankPublickStands = ({ currentUserId }) => {
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    const [season, setSeason] = useState(null);
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getRankingStandings();
                if (!active) return;
                setSeason(data?.season ?? null);
                setStandings(Array.isArray(data?.standings) ? data.standings : []);
            } catch (err) {
                if (active) setError(getErrorMessage(err, "Could not load the standings. Please try again."));
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, []);

    const isMe = (row) => currentUserId && String(row?.player?._id) === String(currentUserId);

    const columns = [
        {
            title: "#",
            dataIndex: "rank",
            key: "rank",
            width: 64,
            render: (rank) => (
                <Flex align="center" gap={4}>
                    {PODIUM_COLORS[rank] && <TrophyFilled style={{ color: PODIUM_COLORS[rank] }} />}
                    <Text strong>{rank}</Text>
                </Flex>
            ),
        },
        {
            title: "Player",
            key: "player",
            render: (_, row) => (
                <Flex align="center" gap={10} style={{ minWidth: 0 }}>
                    {/* key: ProfilePicture guarda la URL en estado interno; al cambiar de jugador hay que remontarlo */}
                    <ProfilePicture key={row.player?._id ?? row._id} user={row.player} profilePicture={row.player?.profilePicture?.url} size={32} editable={false} />
                    <Text strong ellipsis style={{ color: BRAND.navy }}>{fullName(row.player)}</Text>
                    {isMe(row) && <Tag color="green" style={{ marginInlineEnd: 0 }}>You</Tag>}
                </Flex>
            ),
        },
        {
            title: "Played",
            dataIndex: "played",
            key: "played",
            width: 80,
            align: "center",
            responsive: ["sm"],
        },
        {
            title: "W-L",
            key: "record",
            width: 80,
            align: "center",
            render: (_, row) => <Text>{`${row.won}-${row.lost}`}</Text>,
        },
    ];

    if (error) return <Alert type="error" showIcon title={error} />;
    if (!loading && !season) return <Empty description="There is no active ranking season right now." />;

    return (
        <Flex vertical gap={12}>
            {season && (
                <Title level={5} style={{ margin: 0, color: BRAND.navy }}>
                    {season.name}
                </Title>
            )}
            <Table
                rowKey="_id"
                columns={columns}
                dataSource={standings}
                loading={loading}
                pagination={false}
                size={isMobile ? "small" : "middle"}
                scroll={{ x: "max-content" }}
                onRow={(row) => (isMe(row) ? { style: { background: "#EFFAE8" } } : {})}
                locale={{ emptyText: <Empty description="No players in the standings yet. Positions appear after the first round is generated." /> }}
            />
            <Text type="secondary" style={{ fontSize: 12 }}>
                Only active players are listed. New and reactivated players start at the last position.
            </Text>
        </Flex>
    );
};

export default RankPublickStands;