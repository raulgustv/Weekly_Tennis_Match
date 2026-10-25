// [NUEVO ARCHIVO] src/components/RankingUser/RankingRegisteredPlayers.jsx
// Pestaña "Players" de /ranking: jugadores inscritos en el ranking, visible
// aunque la temporada no haya empezado.
//
// - Datos: GET /ranking/registered (solo ranked o admin; el servidor devuelve 403 al resto)
// - Solo llega nombre, apellido y foto de cada jugador (el servidor no envía nada más)
// - Orden: el del servidor (orden de inscripción). No se numera para que no
//   parezca una clasificación.
// - Búsqueda local por nombre (no hace peticiones extra)
import { useEffect, useMemo, useState } from "react";
import { Alert, Avatar, Card, Col, Empty, Flex, Input, Row, Skeleton, Tag, Typography } from "antd";
import { SearchOutlined, TeamOutlined } from "@ant-design/icons";
import { getRegisteredPlayers } from "../../actions/ranking";
import { BRAND } from "../../helpers/seasonConsants.js";

const { Text } = Typography;

const getErrorMessage = (error, fallback) => error?.response?.data?.message || fallback;

const fullName = (p) => [p?.name, p?.lastname].filter(Boolean).join(" ") || "Unknown player";

const initials = (p) =>
    [p?.name, p?.lastname]
        .filter(Boolean)
        .map((s) => s.trim().charAt(0).toUpperCase())
        .join("") || "?";

const RankingRegisteredPlayers = ({ currentUserId }) => {
    const [players, setPlayers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [search, setSearch] = useState("");

    useEffect(() => {
        let active = true;
        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getRegisteredPlayers();
                if (active) setPlayers(Array.isArray(data?.players) ? data.players : []);
            } catch (err) {
                if (active) setError(getErrorMessage(err, "Could not load the registered players. Please try again."));
            } finally {
                if (active) setLoading(false);
            }
        };
        load();
        return () => {
            active = false;
        };
    }, []);

    const filtered = useMemo(() => {
        const term = search.trim().toLowerCase();
        if (!term) return players;
        return players.filter((p) => fullName(p).toLowerCase().includes(term));
    }, [players, search]);

    if (loading) return <Skeleton active avatar paragraph={{ rows: 4 }} />;

    if (error) return <Alert type="error" showIcon message={error} />;

    if (!players.length) {
        return <Empty description="No players have registered yet" />;
    }

    return (
        <Flex vertical gap={16}>
            {/* Cabecera: total + búsqueda */}
            <Flex justify="space-between" align="center" gap={12} wrap>
                <Flex align="center" gap={8}>
                    <TeamOutlined style={{ color: BRAND.green, fontSize: 18 }} />
                    <Text strong>
                        {players.length} {players.length === 1 ? "player" : "players"} registered
                    </Text>
                </Flex>

                <Input
                    allowClear
                    maxLength={50}
                    prefix={<SearchOutlined />}
                    placeholder="Search player"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ maxWidth: 260 }}
                />
            </Flex>

            <Text type="secondary" style={{ fontSize: 12 }}>
                Listed in order of registration. New players join at the bottom of the ranking.
            </Text>

            {filtered.length === 0 ? (
                <Empty description="No players match your search" />
            ) : (
                <Row gutter={[12, 12]}>
                    {filtered.map((p) => {
                        const isMe = currentUserId && String(p?._id) === String(currentUserId);
                        return (
                            <Col key={p?._id} xs={24} sm={12} lg={8}>
                                <Card
                                    size="small"
                                    style={{
                                        borderRadius: 12,
                                        borderColor: isMe ? BRAND.green : undefined,
                                    }}
                                >
                                    <Flex align="center" gap={12}>
                                        <Avatar
                                            size={40}
                                            src={p?.profilePicture?.url || undefined}
                                            style={{ background: BRAND.navy, flexShrink: 0 }}
                                        >
                                            {initials(p)}
                                        </Avatar>
                                        <Text strong ellipsis style={{ minWidth: 0 }}>
                                            {fullName(p)}
                                        </Text>
                                        {isMe && <Tag color="green" style={{ marginInlineStart: "auto" }}>You</Tag>}
                                    </Flex>
                                </Card>
                            </Col>
                        );
                    })}
                </Row>
            )}
        </Flex>
    );
};

export default RankingRegisteredPlayers;