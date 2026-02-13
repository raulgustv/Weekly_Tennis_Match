import { usePlayers } from "../../hooks/usePlayers"
import PlayersTable from "./PlayersTable";
import CountUp from 'react-countup';
import dayjs from "dayjs";
import { Col, Row, Statistic, Typography } from "antd";
import { UsergroupAddOutlined, UserSwitchOutlined } from "@ant-design/icons";
import StatsCard from "../../components/common/StatsCard";

const Players = () => {

    const { players, fetchPlayers, loadPlayers } = usePlayers();

    //console.log(players)

    const { Title, Text } = Typography;

    const activePlayers = players.filter((p) => p?.isActive === true);

    const totalPlayers = value => <CountUp end={players?.length} />
    const totalActivePlayers = value => <CountUp end={activePlayers?.length} />
    const newUsers = players.filter((p) => dayjs(p?.createdAt).isAfter(dayjs().subtract(12, "day")))
    const playersActiveRatio = players?.length > 0 ? ((activePlayers.length / players.length) * 100).toFixed(1) : 0;




    return (
        <>

            <Row gutter={16}>
                <Col span={8}>
                    <div style={{ marginBottom: 24 }}>
                        <Title level={3} style={{ marginBottom: 0 }}>
                            Players
                        </Title>
                        <Text type="secondary">
                            Manage and view players in the group
                        </Text>
                    </div>
                </Col>

                <Col span={8}>
                    <div style={{ marginBottom: 24 }}>
                        <StatsCard accent="info" icon={<UserSwitchOutlined />}>
                            <Row gutter={16}>
                                <Col span={12}>
                                    <Statistic title="Total users" formatter={totalPlayers} />
                                </Col>
                                <Col span={12}>
                                    <Statistic
                                        title={(
                                            <div>
                                                New users
                                                <small>(Last 30 days)</small>
                                            </div>
                                        )}
                                        formatter={() => <CountUp end={newUsers?.length} />}
                                    />
                                </Col>
                            </Row>
                        </StatsCard>
                    </div>
                </Col>

                <Col span={8}>
                    <div style={{ marginBottom: 24 }}>
                        <StatsCard accent="info" icon={<UsergroupAddOutlined />}>
                            <Row>
                                <Col span={12}>
                                    <Statistic title="Total active users" formatter={totalActivePlayers} />
                                </Col>
                                <Col span={12}>
                                    <Statistic title="Active users ratio" value={playersActiveRatio} suffix='%' />
                                </Col>
                            </Row>
                        </StatsCard>
                    </div>
                </Col>
            </Row>


            <Row gutter={16}>
                <Col span={24}>
                    <PlayersTable players={players} loading={loadPlayers} fetchPlayers={fetchPlayers} />
                </Col>
            </Row>
        </>
    )
}

export default Players