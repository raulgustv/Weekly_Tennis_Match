import {
    Typography,
    Space,
    Tag,
    Row,
    Progress,
    Button,
    Popconfirm
} from "antd";
import {
    ClockCircleOutlined,
    EnvironmentOutlined,
    TeamOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import colors from "../../themes/colors";

const MatchSummaryTabs = ({ matchSummary, showJoinButton = false, onJoin, onLeave }) => {
    const { Text, Title } = Typography;
    const { user } = useAuth();

    const navigate = useNavigate()

    const {
        location,
        date,
        startTime,
        endTime,
        status,
        maxPlayers,
        players = [],
        backUps = [],
        _id
    } = matchSummary;

    const progress = Math.round((players.length / maxPlayers) * 100);

    if (!user?._id) return null;


    const getId = (v) => (typeof v === "string" ? v : v?.user?._id);

    const isJoinedPlayer = players.some(
        p => String(getId(p?.user?._id)) === String(user._id)
    );

    const isJoinedBackup = backUps.some(
        b => String(getId(b?.user?._id)) === String(user._id)
    );

    const isJoined = isJoinedPlayer || isJoinedBackup;

    return (
        <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
            <div>
                <Title level={5}>
                    {dayjs(date).format("dddd MMMM DD, YYYY")}
                </Title>
                <Text type="secondary">
                    <ClockCircleOutlined /> {startTime} - {endTime}
                </Text>
            </div>

            <div>
                <Text>
                    <EnvironmentOutlined /> {location?.name}
                </Text>
            </div>

            <Tag color="green">{status}</Tag>

            <div>
                <Row justify="space-between">
                    <Text>
                        <TeamOutlined /> Player availability
                        <br />
                        <Button size="small" style={{marginTop: 5, background: colors.warning }} type="default" onClick={() => navigate(`/match/details/${_id}`)}>
                            View players and match details
                        </Button>
                    </Text>
                    <Text strong>
                        {players.length} / {maxPlayers}
                    </Text>
                </Row>

                <Progress
                    size="small"
                    status={progress === 100 ? "success" : "active"}
                    showInfo={false}
                    percent={progress}
                />
            </div>

            {isJoinedPlayer && <Tag color="blue">You are a player</Tag>}
            {isJoinedBackup && <Tag color="orange">You are a backup</Tag>}

            {showJoinButton && (
                <div>
                    {!isJoined ? (
                        <>
                            <Button
                                type="primary"
                                block
                                disabled={players.length >= maxPlayers}
                                onClick={() => onJoin(_id, false)}
                                style={{ marginBottom: 10 }}
                            >
                                Join Match
                            </Button>

                            <Popconfirm
                                title="Joining as backup"
                                description="You are joining this match as backup. Are you sure?"
                                onConfirm={() => onJoin(_id, true)}
                            >
                                <Button type="link" block>
                                    Join as backup
                                </Button>
                            </Popconfirm>
                        </>
                    ) : (
                        <Popconfirm
                            title="Leave match"
                            description="Are you sure you want to leave this match?"
                            onConfirm={() => onLeave(_id)}
                        >
                            <Button danger block>
                                Leave match
                            </Button>
                        </Popconfirm>
                    )}
                </div>
            )}
        </Space>
    );
};

export default MatchSummaryTabs;
