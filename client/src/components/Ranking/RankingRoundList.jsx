// [NUEVO ARCHIVO] src/components/ranking/RankingRoundMatchList.jsx
// Lista de partidos de una ronda: gestiona loading / error / vacío, pinta la
// rejilla de RankingRoundMatchCard y, si la ronda es una propuesta sin publicar,
// los jugadores elegibles que se han quedado sin rival (bye).
// Mismo patrón que RankingSeasonList.
import { Alert, Card, Col, Empty, Flex, Row, Skeleton, Tag, Typography } from "antd";

import { BRAND } from "../../helpers/seasonConsants.js";
import RankingRoundMatchCard from "./RannkingRoundMatchCards.jsx";

const { Title, Text } = Typography;

const fullName = (p) => [p?.name, p?.lastname].filter(Boolean).join(" ") || "Unknown player";

// [CAMBIO] NUEVO prop `onEditResult` (se pasa tal cual a cada card; si no llega, no hay botón)
const RankingRoundMatchList = ({ matches = [], unpaired = [], selectedRound = null, loading = false, error = null, onEditResult }) => {
    const isProposal = matches.length > 0 && matches.every((m) => !m.published);

    if (loading) {
        return (
            <Row gutter={[16, 16]}>
                {[0, 1, 2].map((i) => (
                    <Col key={i} xs={24} md={12} xl={8}>
                        <Skeleton active avatar paragraph={{ rows: 3 }} />
                    </Col>
                ))}
            </Row>
        );
    }

    if (error) {
        return <Alert type="error" showIcon title={error} />;
    }

    if (!selectedRound) {
        return <Empty description="No rounds yet. Propose the first round to start the season." />;
    }

    return (
        <Flex vertical gap={16}>
            <Title level={4} style={{ margin: 0, color: BRAND.navy }}>
                Round {selectedRound} matches ({matches.length})
            </Title>

            {/* [CAMBIO] NUEVO: aviso de partidos disputados pendientes de decisión del admin */}
            {matches.some((m) => m.status === "disputed") && (
                <Alert
                    type="error"
                    showIcon
                    title={`${matches.filter((m) => m.status === "disputed").length} disputed match(es) in this round waiting for your decision`}
                />
            )}

            {isProposal && (
                <Alert
                    type="warning"
                    showIcon
                    title="This round is a proposal. Players cannot see these matches until you publish the round."
                />
            )}

            {matches.length === 0 ? (
                <Empty description="No matches in this round" />
            ) : (
                <Row gutter={[16, 16]}>
                    {matches.map((match, index) => (
                        <Col key={match._id} xs={24} md={12} xl={8}>
                            <RankingRoundMatchCard match={match} index={index} onEditResult={onEditResult} /> {/* [CAMBIO] + onEditResult */}
                        </Col>
                    ))}
                </Row>
            )}

            {isProposal && unpaired.length > 0 && (
                <Card size="small" style={{ borderRadius: 12 }} title="Without opponent this round">
                    <Flex vertical gap={8}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            Eligible players left out of this proposal (odd number of players, or registered after it was generated).
                        </Text>
                        <Flex wrap gap={8}>
                            {unpaired.map((p) => (
                                <Tag key={p._id}>
                                    {fullName(p)} · {p.rating}
                                </Tag>
                            ))}
                        </Flex>
                    </Flex>
                </Card>
            )}
        </Flex>
    );
};

export default RankingRoundMatchList;