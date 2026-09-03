import {
    Typography,
    Space,
    Tag,
    Row,
    Progress,
    Button,
    Popconfirm,
    Flex,
    Tooltip
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
import { useMemo } from "react";

// 🔵 CAMBIO: prop "onJoin" eliminada (ya no se usa para el join directo de
// backup); prop "onRequestBackup" añadida — ver JoinMatch.jsx.
const MatchSummaryTabs = ({
    matchSummary,
    showJoinButton = false,
    onRequestJoin,
    onRequestBackup,
    onLeave
}) => {




    const { Text, Title, Link } = Typography;
    const { user } = useAuth();
    const navigate = useNavigate();

    const isSuspended =
        user?.suspendedUntil &&
        new Date(user.suspendedUntil) > new Date();

    const {
        location,
        date,
        startTime,
        endTime,
        status,
        price,
        maxPlayers,
        players = [],
        backUps = [],
        _id
    } = matchSummary || {};

    /* --------------------------
       CALCULATE AVERAGE NTRP
    -------------------------- */

    const averageNTRP = useMemo(() => {
        if (!players.length) return 0;

        const total = players.reduce((sum, player) => {
            return sum + Number(player?.user?.ntrplvl || 0);
        }, 0);

        return total / players.length;
    }, [players]);

    /* --------------------------
      Less than 24h
   -------------------------- */

    const isLess24h = useMemo(() => {
        if (!date || !startTime) return false;

        const [hour, minute] = startTime.split(":");

        const matchDateTime = dayjs(date)
            .hour(Number(hour))
            .minute(Number(minute))
            .second(0)
            .millisecond(0);

        const now = dayjs();

        return matchDateTime.diff(now) < 24 * 60 * 60 * 1000;

    }, [date, startTime]);

    const pricePerPerson = Number(price / maxPlayers).toFixed(2);

    const userLevel = Number(user?.ntrplvl || 0);

    const showWarning =
        averageNTRP > 0 &&
        players.length >= 2 &&
        (averageNTRP - userLevel) >= 1;

    const progress = maxPlayers
        ? Math.round((players.length / maxPlayers) * 100)
        : 0;

    const isJoinedPlayer = players.some(
        p => String(p?.user?._id) === String(user?._id)
    );

    const isJoinedBackup = backUps.some(
        b => String(b?.user?._id) === String(user?._id)
    );

    const isJoined = isJoinedPlayer || isJoinedBackup;

    const disabledLeave = isJoinedPlayer && isLess24h;


    const leaveDeadline = dayjs(date)
        .hour(Number(startTime.split(":")[0]))
        .minute(Number(startTime.split(":")[1]))
        .subtract(24, "hour");

    if (!user?._id) return null;

    return (
        <Space orientation="vertical" size="middle" style={{ width: "100%" }}>
            <div>
                <Title level={5}>
                    {dayjs(date).format("dddd MMMM DD, YYYY")}
                </Title>
                <Text type="secondary">
                    <ClockCircleOutlined /> {startTime} - {endTime}
                </Text>

                <br />

                <Text type="danger" style={{ fontSize: 12 }}>
                    <small>Deadline: {leaveDeadline.format("ddd DD MMM, HH:mm")}</small>
                </Text>
            </div>

            <div>
                <Link href={location?.address} target="_blank">
                    <EnvironmentOutlined /> {location?.name}
                </Link>
            </div>

            <Flex justify="space-between">
                <Tag color="green">{status}</Tag>
                <Tag color="default">€{pricePerPerson} per player <small>(approx)</small></Tag>
            </Flex>

            <div>
                <Row justify="space-between">
                    <Text>
                        <TeamOutlined /> Player availability
                        <br />
                        <Button
                            size="small"
                            style={{
                                marginTop: 5,
                                background: colors.warning
                            }}
                            type="default"
                            onClick={() =>
                                navigate(`/match/details/${_id}`)
                            }
                        >
                            View players and match details
                        </Button>
                        <br />
                        <small>
                            Average NTRP level:{" "}
                            <strong>
                                {averageNTRP > 0
                                    ? averageNTRP.toFixed(2)
                                    : "-"}
                            </strong>
                        </small>
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
                            {showWarning ? (
                                <Popconfirm
                                    title="Skill level warning"
                                    description={`Your NTRP level ${userLevel} is lower than the match average (${averageNTRP.toFixed(
                                        2
                                    )}). Are you sure you want to join?`}
                                    onConfirm={() => onRequestJoin(matchSummary)}
                                    okText="Yes, join"
                                    cancelText="Cancel"
                                >
                                    <Button
                                        type="primary"
                                        block
                                        disabled={players.length >= maxPlayers || isSuspended}
                                        style={{ marginBottom: 10 }}

                                    >
                                        Join Match
                                    </Button>
                                </Popconfirm>
                            ) : (
                                <Tooltip
                                    color="volcano"
                                    title={
                                        isSuspended ? `Your account is suspended until ${dayjs(user.suspendedUntil).format("DD/MM/YYYY HH:mm")}` : null
                                    }
                                >
                                    <Button
                                        type="primary"
                                        block
                                        disabled={players.length >= maxPlayers || isSuspended}
                                        onClick={() => onRequestJoin(matchSummary)}
                                        style={{ marginBottom: 10 }}
                                    >
                                        Join Match
                                    </Button>
                                </Tooltip>
                            )}

                            {/*
                              🔵 CAMBIO: antes este botón era un Popconfirm que
                              llamaba a onJoin(_id, true) directamente (sin pasar
                              por el modal de pago, y sin comprobar si el match
                              estaba Full). Ahora:
                              - está disabled si status !== "Full" (backup solo
                                cuando el match está lleno), con tooltip explicando por qué
                              - al pulsar, abre el modal de pago vía onRequestBackup
                                (igual que "Join Match" hace con onRequestJoin)
                            */}
                            <Tooltip
                                color="volcano"
                                title={
                                    isSuspended
                                        ? `Your account is suspended until ${dayjs(user.suspendedUntil).format("DD/MM/YYYY HH:mm")}`
                                        : status !== "Full"
                                            ? "Backup spots are only available once the match is full"
                                            : null
                                }
                            >
                                <Button
                                    type="link" block
                                    disabled={isSuspended || status !== "Full"}
                                    onClick={() => onRequestBackup(matchSummary)}
                                >
                                    Join as backup
                                </Button>
                            </Tooltip>
                        </>
                    ) : (
                        <Popconfirm
                            title="Leave match"
                            description="Are you sure you want to leave this match?"
                            onConfirm={() => onLeave(_id)}
                        >
                            <Tooltip
                                color="red"
                                title={
                                    disabledLeave ? "You cannot leave a match 24 hours before it starts" : ""
                                }
                            >
                                <Button danger block disabled={disabledLeave}>
                                    Leave match
                                </Button>
                            </Tooltip>


                        </Popconfirm>
                    )}
                </div>
            )}
        </Space>
    );
};

export default MatchSummaryTabs;