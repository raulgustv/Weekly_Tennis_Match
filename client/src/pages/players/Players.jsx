import { usePlayers } from "../../hooks/usePlayers";
import PlayersTable from "./PlayersTable";
import CountUp from "react-countup";
import dayjs from "dayjs";
import { Col, Row, Statistic, Typography } from "antd";
import {
    UsergroupAddOutlined,
    UserSwitchOutlined,
} from "@ant-design/icons";
import StatsCard from "../../components/common/StatsCard";

const Players = () => {
    const { players, fetchPlayers, loadPlayers } = usePlayers();

    const { Title, Text } = Typography;

    const activePlayers = players.filter((p) => p?.isActive === true);

    const totalPlayers = () => <CountUp end={players?.length} />;
    const totalActivePlayers = () => <CountUp end={activePlayers?.length} />;

    const newUsers = players.filter((p) =>
        dayjs(p?.createdAt).isAfter(dayjs().subtract(30, "day"))
    );

    const playersActiveRatio =
        players?.length > 0
            ? ((activePlayers.length / players.length) * 100).toFixed(1)
            : 0;

    return (
        <>
            {/* 🔥 HEADER + STATS */}
            <Row gutter={[16, 16]} align="stretch">
                {/* TITLE SECTION */}
                <Col xs={24} md={8}>
                    <div style={{ marginBottom: 24 }}>
                        <Title level={3} style={{ marginBottom: 0 }}>
                            Players
                        </Title>
                        <Text type="secondary">
                            Manage and view players in the group
                        </Text>
                    </div>
                </Col>

                {/* STATS CARD 1 */}
                <Col xs={24} md={8}>
                    <div style={{ marginBottom: 24 }}>
                        <StatsCard
                            accent="info"
                            icon={<UserSwitchOutlined />}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <Statistic
                                        title="Total users"
                                        formatter={totalPlayers}
                                    />
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Statistic
                                        title={
                                            <div>
                                                New users
                                                <br />
                                                <small>
                                                    (Last 30 days)
                                                </small>
                                            </div>
                                        }
                                        formatter={() => (
                                            <CountUp
                                                end={newUsers?.length}
                                            />
                                        )}
                                    />
                                </Col>
                            </Row>
                        </StatsCard>
                    </div>
                </Col>

                {/* STATS CARD 2 */}
                <Col xs={24} md={8}>
                    <div style={{ marginBottom: 24 }}>
                        <StatsCard
                            accent="info"
                            icon={<UsergroupAddOutlined />}
                        >
                            <Row gutter={[16, 16]}>
                                <Col xs={24} sm={12}>
                                    <Statistic
                                        title="Total active users"
                                        formatter={totalActivePlayers}
                                    />
                                </Col>

                                <Col xs={24} sm={12}>
                                    <Statistic
                                        title="Active users ratio"
                                        value={playersActiveRatio}
                                        suffix="%"
                                    />
                                </Col>
                            </Row>
                        </StatsCard>
                    </div>
                </Col>
            </Row>

            {/* 🔥 TABLE SECTION */}
            <Row gutter={[16, 16]}>
                <Col xs={24}>
                    <PlayersTable
                        players={players}
                        loading={loadPlayers}
                        fetchPlayers={fetchPlayers}
                    />
                </Col>
            </Row>
        </>
    );
};

export default Players;
