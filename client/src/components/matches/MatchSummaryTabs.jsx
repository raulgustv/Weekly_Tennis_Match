import {
    Typography,
    Space,
    Tag,
    Row,
    Progress,
    Button,
    Popconfirm,
    Flex
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
import { useMemo, useState } from "react";
import { toast } from "react-toastify";

const MatchSummaryTabs = ({
    matchSummary,
    showJoinButton = false,
    onJoin,
    onLeave
}) => {
    const { Text, Title, Link } = Typography;
    const { user } = useAuth();
    const navigate = useNavigate();

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
        paymentMethods = [],
        _id
    } = matchSummary || {};

    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState(null);


    /* --------------------------
       🔢 CALCULATE AVERAGE NTRP
       (HOOKS ALWAYS ON TOP)
    -------------------------- */


    const averageNTRP = useMemo(() => {
        if (!players.length) return 0;

        const total = players.reduce((sum, player) => {
            return sum + Number(player?.user?.ntrplvl || 0);
        }, 0);

        return total / players.length;
    }, [players]);

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

    if (!user?._id) return null;

    /* ================================
     PAYMENT MODAL HANDLERS
  ================================= */

  const handlePaymentModal = () =>{
    if(!paymentMethods.length){
        toast.error("No payment methods available");
        return;
    }
        setOpenPaymentModal(true)
  }

  const handleConfirmPayment = () =>{
    if(!selectedPayment){
        toast.error("Please select a payment method")
        return;
    }
    setOpenPaymentModal(false)
    onJoin(_id, false, selectedPayment)
  }


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
                <Link href={location?.address} target="_blank">
                    <EnvironmentOutlined /> {location?.name}
                </Link>
            </div>

            <Flex justify="space-between">
                <Tag color="green">{status}</Tag>
                <Tag color="default">€{pricePerPerson} per player</Tag>
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
                                    onConfirm={() => onJoin(_id, false)}
                                    okText="Yes, join"
                                    cancelText="Cancel"
                                >
                                    <Button
                                        type="primary"
                                        block
                                        disabled={players.length >= maxPlayers}
                                        style={{ marginBottom: 10 }}
                                    >
                                        Join Match
                                    </Button>
                                </Popconfirm>
                            ) : (
                                <Button
                                    type="primary"
                                    block
                                    disabled={players.length >= maxPlayers}
                                    onClick={() => onJoin(_id, false)}
                                    style={{ marginBottom: 10 }}
                                >
                                    Join Match
                                </Button>
                            )}

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
