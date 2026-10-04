// [NUEVO ARCHIVO] src/components/ranking/RankingSeasonList.jsx
// Lista de temporadas: gestiona los estados loading / error / vacío y pinta la rejilla de cards.
import { Alert, Col, Empty, Flex, Row, Skeleton, Typography } from "antd";
// [CAMBIO] Antes importaba "./RankingSeasonCard", que ya no existe → por eso petaba al abrir Seasons
import RankingStatCard from "./RankingStatCard";
import { BRAND } from "../../helpers/seasonConsants.js";

const { Title } = Typography;

const RankingSeasonList = ({ seasons = [], loading = false, error = null, selectedType = null, now }) => {
    const heading = selectedType ? `${selectedType} seasons` : "All seasons";

    return (
        <Flex vertical gap={16}>
            <Title level={4} style={{ margin: 0, color: BRAND.navy }}>
                {heading} {!loading && !error && `(${seasons.length})`}
            </Title>

            {error && <Alert type="error" showIcon message={error} />}

            {loading && (
                <Row gutter={[16, 16]}>
                    {[0, 1, 2].map((i) => (
                        <Col key={i} xs={24} md={12} xl={8}>
                            <Skeleton active paragraph={{ rows: 3 }} />
                        </Col>
                    ))}
                </Row>
            )}

            {!loading && !error && seasons.length === 0 && (
                <Empty description={selectedType ? `No ${selectedType} seasons yet` : "No seasons yet"} />
            )}

            {!loading && !error && seasons.length > 0 && (
                <Row gutter={[16, 16]}>
                    {seasons.map((season, index) => (
                        <Col key={season?._id ?? season?.id ?? index} xs={24} md={12} xl={8}>
                            {/* [CAMBIO] antes <RankingSeasonCard /> */}
                            <RankingStatCard season={season} now={now} />
                        </Col>
                    ))}
                </Row>
            )}
        </Flex>
    );
};

export default RankingSeasonList;