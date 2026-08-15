import { useState } from "react";
import {
    Card,
    Typography,
    Steps,
    Tag,
    Button,
    Alert,
    Divider,
    Flex,
} from "antd";
import {
    LikeOutlined,
    InfoCircleOutlined,
    LockOutlined,
    BarChartOutlined,
    CheckCircleOutlined,
    ArrowUpOutlined,
    ArrowDownOutlined,
    MinusOutlined,
    UserOutlined,
    ArrowRightOutlined,
    BookOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const HelpMatchVoting = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "What is voting?",
            shortTitle: "Overview",
            icon: <LikeOutlined />,
        },
        {
            title: "Anonymous & optional",
            shortTitle: "Voting",
            icon: <LockOutlined />,
        },
        {
            title: "How it works",
            shortTitle: "Algorithm",
            icon: <BarChartOutlined />,
        },
        {
            title: "How to vote",
            shortTitle: "Vote",
            icon: <CheckCircleOutlined />,
        },
        {
            title: "An example",
            shortTitle: "Example",
            icon: <UserOutlined />,
        },
    ];

    const renderStepContent = () => {
        switch (currentStep) {
            // =====================================================
            // STEP 1 — OVERVIEW
            // =====================================================
            case 0:
                return (
                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: 24,
                            }}
                        >
                            <div
                                style={{
                                    width: 76,
                                    height: 76,
                                    borderRadius: 22,
                                    background: "#f0f5ff",
                                    color: "#2f54eb",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <LikeOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Match Voting
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                                maxWidth: 540,
                                margin: "0 auto",
                            }}
                        >
                            After a match has been played, you can give
                            feedback about the skill level of the players you
                            shared the court with.
                        </Paragraph>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                                maxWidth: 540,
                                margin: "12px auto 0",
                            }}
                        >
                            Your feedback helps the system understand whether
                            a player's current NTRP reflects what is actually
                            happening on court.
                        </Paragraph>

                        <div
                            style={{
                                marginTop: 24,
                                padding: 18,
                                borderRadius: 17,
                                background:
                                    "linear-gradient(135deg, #f0f5ff, #f8fbff)",
                                border: "1px solid #d6e4ff",
                            }}
                        >
                            <Flex align="center" gap={14}>
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 13,
                                        background: "#fff",
                                        color: "#2f54eb",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 20,
                                        flexShrink: 0,
                                    }}
                                >
                                    <BookOutlined />
                                </div>

                                <div>
                                    <Text strong>
                                        Help keep matches balanced
                                    </Text>

                                    <div style={{ marginTop: 3 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12.5 }}
                                        >
                                            Real match experience gives the
                                            system another useful signal about
                                            player levels.
                                        </Text>
                                    </div>
                                </div>
                            </Flex>
                        </div>

                        <Alert
                            style={{
                                marginTop: 18,
                                borderRadius: 14,
                            }}
                            type="info"
                            showIcon
                            icon={<InfoCircleOutlined />}
                            title="Feedback is about the playing level"
                            description="You're not rating someone's personality or judging whether they had a good or bad day. You're simply indicating how their playing level compared with their current NTRP."
                        />
                    </div>
                );

            // =====================================================
            // STEP 2 — ANONYMOUS & OPTIONAL
            // =====================================================
            case 1:
                return (
                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: 24,
                            }}
                        >
                            <div
                                style={{
                                    width: 76,
                                    height: 76,
                                    borderRadius: 22,
                                    background: "#f6ffed",
                                    color: "#52c41a",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <LockOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Anonymous and optional
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Voting is completely optional. If you don't feel
                            you have enough information to evaluate someone's
                            level, you can simply skip it.
                        </Paragraph>

                        <Card
                            size="small"
                            style={{
                                marginTop: 24,
                                borderRadius: 18,
                                background: "#f7f9ff",
                                borderColor: "#d6e4ff",
                            }}
                        >
                            <Flex align="flex-start" gap={14}>
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 13,
                                        background: "#fff",
                                        color: "#2f54eb",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        flexShrink: 0,
                                        fontSize: 20,
                                    }}
                                >
                                    <LockOutlined />
                                </div>

                                <div>
                                    <Text strong>
                                        Your votes are anonymous
                                    </Text>

                                    <div style={{ marginTop: 5 }}>
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 12,
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            Players cannot see who voted for
                                            them. Your feedback is used by the
                                            system to improve player-level
                                            accuracy, not to create public
                                            ratings.
                                        </Text>
                                    </div>
                                </div>
                            </Flex>
                        </Card>

                        <Card
                            size="small"
                            style={{
                                marginTop: 16,
                                borderRadius: 18,
                                background: "#fffdf7",
                                borderColor: "#ffe58f",
                            }}
                        >
                            <Title
                                level={5}
                                style={{
                                    marginTop: 0,
                                    marginBottom: 8,
                                }}
                            >
                                Keep it about tennis 🎾
                            </Title>

                            <Paragraph
                                type="secondary"
                                style={{
                                    lineHeight: 1.7,
                                    marginBottom: 8,
                                }}
                            >
                                A vote isn't a judgment of someone as a person,
                                and it doesn't mean they had a bad match.
                            </Paragraph>

                            <Paragraph
                                type="secondary"
                                style={{
                                    lineHeight: 1.7,
                                    marginBottom: 0,
                                }}
                            >
                                Be honest, be respectful, and focus on the
                                level you actually experienced during the
                                match.
                            </Paragraph>
                        </Card>

                        <Alert
                            style={{
                                marginTop: 18,
                                borderRadius: 14,
                            }}
                            type="success"
                            showIcon
                            icon={<CheckCircleOutlined />}
                            title="Your feedback is valuable"
                            description="Every honest vote gives the system more information and can help improve the balance of future matches."
                        />
                    </div>
                );

            // =====================================================
            // STEP 3 — ALGORITHM
            // =====================================================
            case 2:
                return (
                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: 24,
                            }}
                        >
                            <div
                                style={{
                                    width: 76,
                                    height: 76,
                                    borderRadius: 22,
                                    background: "#f9f0ff",
                                    color: "#722ed1",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <BarChartOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            How the system uses your feedback
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Your vote is one piece of information in a larger
                            system. We don't simply change someone's NTRP
                            based on one person's opinion.
                        </Paragraph>

                        <Flex
                            vertical
                            gap={12}
                            style={{ marginTop: 24 }}
                        >
                            <div
                                style={{
                                    padding: 15,
                                    borderRadius: 14,
                                    background: "#fafafa",
                                    border: "1px solid #f0f0f0",
                                }}
                            >
                                <Text strong>
                                    Multiple votes create a clearer picture
                                </Text>

                                <div style={{ marginTop: 4 }}>
                                    <Text
                                        type="secondary"
                                        style={{
                                            fontSize: 12,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        Feedback from several players helps
                                        the system identify patterns instead of
                                        relying on a single opinion.
                                    </Text>
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: 15,
                                    borderRadius: 14,
                                    background: "#fafafa",
                                    border: "1px solid #f0f0f0",
                                }}
                            >
                                <Text strong>
                                    The voter's level provides context
                                </Text>

                                <div style={{ marginTop: 4 }}>
                                    <Text
                                        type="secondary"
                                        style={{
                                            fontSize: 12,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        The system considers the NTRP level of
                                        the person giving the feedback when
                                        evaluating the signal.
                                    </Text>
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: 15,
                                    borderRadius: 14,
                                    background: "#fafafa",
                                    border: "1px solid #f0f0f0",
                                }}
                            >
                                <Text strong>Changes happen gradually</Text>

                                <div style={{ marginTop: 4 }}>
                                    <Text
                                        type="secondary"
                                        style={{
                                            fontSize: 12,
                                            lineHeight: 1.6,
                                        }}
                                    >
                                        Player levels are adjusted
                                        progressively, with safeguards to
                                        prevent a single match from causing an
                                        excessive change.
                                    </Text>
                                </div>
                            </div>

                            <div
                                style={{
                                    padding: 15,
                                    borderRadius: 14,
                                    background: "#f6ffed",
                                    border: "1px solid #d9f7be",
                                }}
                            >
                                <Flex align="flex-start" gap={9}>
                                    <CheckCircleOutlined
                                        style={{
                                            color: "#52c41a",
                                            marginTop: 2,
                                        }}
                                    />

                                    <div>
                                        <Text strong>
                                            The goal is better-balanced
                                            matches
                                        </Text>

                                        <div style={{ marginTop: 4 }}>
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 12,
                                                    lineHeight: 1.6,
                                                }}
                                            >
                                                The system tries to keep NTRP
                                                levels reasonably close to
                                                players' actual experience on
                                                court.
                                            </Text>
                                        </div>
                                    </div>
                                </Flex>
                            </div>
                        </Flex>

                        <Alert
                            type="info"
                            showIcon
                            style={{
                                marginTop: 18,
                                borderRadius: 14,
                            }}
                            title="The algorithm doesn't overreact"
                            description="A single vote or match should not suddenly redefine a player's level. Adjustments are controlled so ratings evolve gradually as more information becomes available."
                        />

                        <Card
                            size="small"
                            style={{
                                marginTop: 18,
                                borderRadius: 16,
                                background:
                                    "linear-gradient(135deg, #faf5ff, #fff)",
                                border: "1px solid #e9d8ff",
                            }}
                        >
                            <Flex align="center" gap={12}>
                                <div
                                    style={{
                                        width: 42,
                                        height: 42,
                                        borderRadius: 12,
                                        background: "#f9f0ff",
                                        color: "#722ed1",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 18,
                                    }}
                                >
                                    <BarChartOutlined />
                                </div>

                                <div>
                                    <Text strong>
                                        More feedback → better calibration
                                    </Text>

                                    <div style={{ marginTop: 3 }}>
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 11.5,
                                            }}
                                        >
                                            The system learns from repeated
                                            match experiences rather than
                                            reacting strongly to one isolated
                                            vote.
                                        </Text>
                                    </div>
                                </div>
                            </Flex>
                        </Card>
                    </div>
                );

            // =====================================================
            // STEP 4 — HOW TO VOTE
            // =====================================================
            case 3:
                return (
                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: 24,
                            }}
                        >
                            <div
                                style={{
                                    width: 76,
                                    height: 76,
                                    borderRadius: 22,
                                    background: "#e6f4ff",
                                    color: "#1677ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <LikeOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            How to vote
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            For each player, simply choose the option that
                            best matches the level you experienced during the
                            match.
                        </Paragraph>

                        <Divider />

                        <Flex vertical gap={12}>
                            <Flex
                                align="center"
                                gap={14}
                                style={{
                                    padding: 14,
                                    borderRadius: 12,
                                    background: "#fff1f0",
                                }}
                            >
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 11,
                                        background: "#fff",
                                        color: "#ff4d4f",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ArrowDownOutlined />
                                </div>

                                <div>
                                    <Text strong>Lower</Text>

                                    <div>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Their playing level seemed lower
                                            than their current NTRP.
                                        </Text>
                                    </div>
                                </div>
                            </Flex>

                            <Flex
                                align="center"
                                gap={14}
                                style={{
                                    padding: 14,
                                    borderRadius: 12,
                                    background: "#f6ffed",
                                }}
                            >
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 11,
                                        background: "#fff",
                                        color: "#52c41a",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <MinusOutlined />
                                </div>

                                <div>
                                    <Text strong>Correct</Text>

                                    <div>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Their playing level seemed to
                                            match their current NTRP.
                                        </Text>
                                    </div>
                                </div>
                            </Flex>

                            <Flex
                                align="center"
                                gap={14}
                                style={{
                                    padding: 14,
                                    borderRadius: 12,
                                    background: "#e6f4ff",
                                }}
                            >
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 11,
                                        background: "#fff",
                                        color: "#1677ff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                    }}
                                >
                                    <ArrowUpOutlined />
                                </div>

                                <div>
                                    <Text strong>Higher</Text>

                                    <div>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Their playing level seemed higher
                                            than their current NTRP.
                                        </Text>
                                    </div>
                                </div>
                            </Flex>
                        </Flex>

                        <Card
                            size="small"
                            style={{
                                marginTop: 24,
                                borderRadius: 18,
                                border: "1px solid #e8e8e8",
                                boxShadow:
                                    "0 8px 24px rgba(0,0,0,.045)",
                            }}
                        >
                            <Flex
                                align="center"
                                justify="space-between"
                                style={{ marginBottom: 16 }}
                            >
                                <div>
                                    <Text strong style={{ fontSize: 16 }}>
                                        Players
                                    </Text>

                                    <div style={{ marginTop: 3 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 11.5 }}
                                        >
                                            Players from your match
                                        </Text>
                                    </div>
                                </div>

                                <Tag
                                    color="blue"
                                    style={{
                                        borderRadius: 999,
                                        margin: 0,
                                    }}
                                >
                                    Vote
                                </Tag>
                            </Flex>

                            {[
                                {
                                    name: "Alex M.",
                                    ntrp: "4.0",
                                },
                                {
                                    name: "Daniel R.",
                                    ntrp: "3.5",
                                },
                            ].map((player) => (
                                <div
                                    key={player.name}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "11px 0",
                                        borderBottom:
                                            "1px solid #f0f0f0",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: "50%",
                                            background: "#e6f4ff",
                                            color: "#1677ff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 17,
                                        }}
                                    >
                                        <UserOutlined />
                                    </div>

                                    <div style={{ flex: 1 }}>
                                        <Text strong style={{ fontSize: 13 }}>
                                            {player.name}
                                        </Text>

                                        <div>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: 11 }}
                                            >
                                                NTRP {player.ntrp}
                                            </Text>
                                        </div>
                                    </div>

                                    <Button
                                        size="small"
                                        shape="round"
                                        icon={<LikeOutlined />}
                                        style={{
                                            background: "#2f54eb",
                                            borderColor: "#2f54eb",
                                            color: "#fff",
                                        }}
                                    >
                                        Vote
                                    </Button>
                                </div>
                            ))}
                        </Card>

                        <Alert
                            style={{
                                marginTop: 18,
                                borderRadius: 14,
                            }}
                            type="info"
                            showIcon
                            title="No written feedback is required"
                            description="You simply choose Lower, Correct, or Higher. The important part is to base your choice on the level you experienced during the match."
                        />
                    </div>
                );

            // =====================================================
            // STEP 5 — EXAMPLE
            // =====================================================
            case 4:
                return (
                    <div>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: 24,
                            }}
                        >
                            <div
                                style={{
                                    width: 76,
                                    height: 76,
                                    borderRadius: 22,
                                    background: "#fff7e6",
                                    color: "#fa8c16",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <InfoCircleOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            A simple example
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Imagine you have just played a match with a player
                            whose profile shows an NTRP of 4.0.
                        </Paragraph>

                        <Card
                            size="small"
                            style={{
                                marginTop: 24,
                                borderRadius: 18,
                                background:
                                    "linear-gradient(135deg, #fffaf0, #fff)",
                                border: "1px solid #ffe7ba",
                            }}
                        >
                            <Flex
                                align="center"
                                gap={12}
                                style={{ marginBottom: 16 }}
                            >
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 13,
                                        background: "#fff7e6",
                                        color: "#fa8c16",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 20,
                                    }}
                                >
                                    <UserOutlined />
                                </div>

                                <div>
                                    <Text strong>
                                        Player — NTRP 4.0
                                    </Text>

                                    <div style={{ marginTop: 3 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 11.5 }}
                                        >
                                            Player from your recent match
                                        </Text>
                                    </div>
                                </div>
                            </Flex>

                            <Divider style={{ margin: "12px 0" }} />

                            <Paragraph
                                type="secondary"
                                style={{
                                    lineHeight: 1.7,
                                    marginBottom: 10,
                                }}
                            >
                                During the match, you get a sense of how their
                                level compares with the NTRP shown on their
                                profile.
                            </Paragraph>

                            <Paragraph
                                type="secondary"
                                style={{
                                    lineHeight: 1.7,
                                    marginBottom: 0,
                                }}
                            >
                                Based on that experience, you simply choose the
                                option that feels most accurate.
                            </Paragraph>
                        </Card>

                        {/* VOTE OPTIONS */}
                        <Card
                            size="small"
                            style={{
                                marginTop: 18,
                                borderRadius: 18,
                            }}
                        >
                            <Text strong>
                                What would you choose?
                            </Text>

                            <div
                                style={{
                                    marginTop: 14,
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(3, 1fr)",
                                    gap: 8,
                                }}
                            >
                                <div
                                    style={{
                                        padding: "13px 8px",
                                        borderRadius: 12,
                                        background: "#fff1f0",
                                        border: "1px solid #ffccc7",
                                        textAlign: "center",
                                    }}
                                >
                                    <ArrowDownOutlined
                                        style={{
                                            color: "#ff4d4f",
                                            fontSize: 18,
                                        }}
                                    />

                                    <div style={{ marginTop: 6 }}>
                                        <Text strong>Lower</Text>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        padding: "13px 8px",
                                        borderRadius: 12,
                                        background: "#f6ffed",
                                        border: "1px solid #b7eb8f",
                                        textAlign: "center",
                                    }}
                                >
                                    <MinusOutlined
                                        style={{
                                            color: "#52c41a",
                                            fontSize: 18,
                                        }}
                                    />

                                    <div style={{ marginTop: 6 }}>
                                        <Text strong>Correct</Text>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        padding: "13px 8px",
                                        borderRadius: 12,
                                        background: "#e6f4ff",
                                        border: "1px solid #91caff",
                                        textAlign: "center",
                                    }}
                                >
                                    <ArrowUpOutlined
                                        style={{
                                            color: "#1677ff",
                                            fontSize: 18,
                                        }}
                                    />

                                    <div style={{ marginTop: 6 }}>
                                        <Text strong>Higher</Text>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div
                            style={{
                                marginTop: 18,
                                padding: 17,
                                borderRadius: 16,
                                background: "#fafafa",
                                border: "1px solid #f0f0f0",
                            }}
                        >
                            <Flex align="flex-start" gap={12}>
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 12,
                                        background: "#e6f4ff",
                                        color: "#1677ff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 18,
                                        flexShrink: 0,
                                    }}
                                >
                                    <LikeOutlined />
                                </div>

                                <div>
                                    <Text strong>
                                        That's all there is to it
                                    </Text>

                                    <div style={{ marginTop: 5 }}>
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 12,
                                                lineHeight: 1.6,
                                            }}
                                        >
                                            There is no written review or
                                            detailed evaluation. Your vote is
                                            simply one of these three options,
                                            based on what you experienced on
                                            court.
                                        </Text>
                                    </div>
                                </div>
                            </Flex>
                        </div>

                        <Alert
                            style={{
                                marginTop: 18,
                                borderRadius: 14,
                            }}
                            type="warning"
                            showIcon
                            title="Focus on the level, not the result"
                            description="Winning or losing doesn't automatically determine a player's level. Think about the level of play you experienced and choose the option that best represents it."
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div
            style={{
                width: "100%",
                maxWidth: 650,
                margin: "0 auto",
                padding: "4px 2px 12px",
            }}
        >
            {/* HEADER */}
            <div
                style={{
                    textAlign: "center",
                    marginBottom: 28,
                }}
            >
                <div
                    style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 7,
                        padding: "5px 11px",
                        borderRadius: 999,
                        background: "#f0f5ff",
                        color: "#2f54eb",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: ".4px",
                        marginBottom: 12,
                    }}
                >
                    <LikeOutlined />
                    MATCH VOTING
                </div>

                <Title
                    level={3}
                    style={{
                        margin: 0,
                        fontSize: 25,
                        letterSpacing: "-.4px",
                    }}
                >
                    Understanding match voting
                </Title>

                <Text
                    type="secondary"
                    style={{
                        display: "block",
                        marginTop: 7,
                        fontSize: 13.5,
                    }}
                >
                    How your feedback helps keep player levels accurate.
                </Text>
            </div>

            {/* STEPS */}
            <Steps
                current={currentStep}
                responsive
                size="small"
                items={steps.map((step) => ({
                    title: step.shortTitle,
                    icon: step.icon,
                }))}
                onChange={setCurrentStep}
                style={{
                    marginBottom: 28,
                }}
            />

            {/* CONTENT */}
            <Card
                variant="borderless"
                style={{
                    borderRadius: 24,
                    background: "#fff",
                    boxShadow:
                        "0 10px 35px rgba(0, 0, 0, 0.055)",
                    border: "1px solid #f0f0f0",
                }}
                styles={{
                    body: {
                        padding: "28px 24px 24px",
                    },
                }}
            >
                {renderStepContent()}

                {/* NAVIGATION */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 30,
                        paddingTop: 18,
                        borderTop: "1px solid #f0f0f0",
                    }}
                >
                    <Button
                        type="text"
                        disabled={currentStep === 0}
                        onClick={() =>
                            setCurrentStep((prev) => prev - 1)
                        }
                    >
                        Back
                    </Button>

                    {currentStep < steps.length - 1 ? (
                        <Button
                            type="primary"
                            onClick={() =>
                                setCurrentStep((prev) => prev + 1)
                            }
                            icon={<ArrowRightOutlined />}
                            iconPlacement="end"
                            style={{
                                borderRadius: 10,
                                fontWeight: 600,
                            }}
                        >
                            Next
                        </Button>
                    ) : (
                        <Button
                            type="primary"
                            icon={<CheckCircleOutlined />}
                            onClick={onClose || (() => setCurrentStep(0))}
                            style={{
                                borderRadius: 10,
                                fontWeight: 600,
                            }}
                        >
                            Got it!
                        </Button>
                    )}
                </div>
            </Card>

            {/* PROGRESS */}
            <div
                style={{
                    textAlign: "center",
                    marginTop: 16,
                }}
            >
                <Text
                    type="secondary"
                    style={{
                        fontSize: 11,
                    }}
                >
                    Step {currentStep + 1} of {steps.length}
                </Text>
            </div>
        </div>
    );
};

export default HelpMatchVoting;