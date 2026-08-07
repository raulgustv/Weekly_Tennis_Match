import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Card,
    Typography,
    Space,
    Steps,
    Tag,
    Button,
    Alert,
    Divider,
    Flex,
    Popover,
    Timeline
} from "antd";
import {
    TrophyOutlined,
    UserOutlined,
    CheckCircleFilled,
    InfoCircleOutlined,
    ArrowRightOutlined,
    RiseOutlined,
    FallOutlined,
    MinusOutlined,
    ClockCircleOutlined,
    LineChartOutlined,
    SafetyCertificateOutlined,
    TeamOutlined,
    ArrowDownOutlined,
    ArrowUpOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;


const ntrpLevels = [
    {
        level: 1,
        title: "Beginner",
        description: "Just starting to learn and develop basic tennis skills.",
        color: "#36cfc9",
        background: "#e6fffb",
        border: "#87e8de",
        points: [
            "Learning the basic strokes",
            "Developing ball control",
            "Focuses on getting the ball into play",
        ],
    },
    {
        level: 2,
        title: "Developing",
        description: "Building consistency and learning how to play points.",
        color: "#13c2c2",
        background: "#e6fffb",
        border: "#87e8de",
        points: [
            "Basic strokes are developing",
            "Can sustain simple rallies",
            "Still learning positioning and court movement",
        ],
    },
    {
        level: 3,
        title: "Intermediate",
        description: "Can play consistently at a recreational level.",
        color: "#1677ff",
        background: "#e6f4ff",
        border: "#91caff",
        points: [
            "Can maintain medium-paced rallies",
            "Basic strokes are fairly consistent",
            "Still developing control of depth and direction",
        ],
    },
    {
        level: 4,
        title: "Advanced",
        description: "Has reliable strokes and a more complete game.",
        color: "#597ef7",
        background: "#f0f5ff",
        border: "#adc6ff",
        points: [
            "Good control of direction and depth",
            "Uses volleys, lobs and approach shots effectively",
            "Can construct points and cover the court well",
        ],
    },
    {
        level: 5,
        title: "Expert",
        description: "Has a highly developed and competitive tennis game.",
        color: "#722ed1",
        background: "#f9f0ff",
        border: "#d3adf7",
        points: [
            "Strong consistency, control and shot variety",
            "Uses pace, spin, depth and placement effectively",
            "Can construct and dictate points with confidence",
        ],
    },
];

const ntrpHistoryExample = [
    {
        date: "August 2, 2026",
        totalChange: 0.18,
    },
    {
        date: "July 26, 2026",
        totalChange: -0.06,
    },
    {
        date: "July 19, 2026",
        totalChange: 0.12,
    },
    {
        date: "July 12, 2026",
        totalChange: 0.04,
    },
];

const HelpNTRP = ({onClose}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedNtrp, setSelectedNtrp] = useState(null);

    const steps = [
        {
            title: "What is NTRP?",
            shortTitle: "NTRP",
            icon: <TrophyOutlined />,
        },
        {
            title: "Be honest",
            shortTitle: "Your level",
            icon: <SafetyCertificateOutlined />,
        },
        {
            title: "Automatic updates",
            shortTitle: "Updates",
            icon: <RiseOutlined />,
        },
        {
            title: "Match feedback",
            shortTitle: "Feedback",
            icon: <TeamOutlined />,
        },
    ];

    const renderStepContent = () => {
        switch (currentStep) {
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
                                    background: "#fff7e6",
                                    color: "#fa8c16",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <TrophyOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Your NTRP represents your playing level
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
                            NTRP is the rating we use to understand your
                            tennis level and help create competitive,
                            enjoyable matches.
                        </Paragraph>

                        {/* LEVEL SCALE */}
                        <div
                            style={{
                                marginTop: 28,
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(5, 1fr)",
                                gap: 7,
                            }}
                        >
                            {ntrpLevels.map((item) => {
                                const isSelected = selectedNtrp === item.level;

                                return (
                                    <Popover
                                        key={item.level}
                                        trigger="click"
                                        placement="top"
                                        onOpenChange={(open) => {
                                            setSelectedNtrp(open ? item.level : null);
                                        }}
                                        content={
                                            <div style={{ width: 250 }}>
                                                <div
                                                    style={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        gap: 10,
                                                        marginBottom: 8,
                                                    }}
                                                >
                                                    <div
                                                        style={{
                                                            width: 38,
                                                            height: 38,
                                                            borderRadius: 11,
                                                            background: item.background,
                                                            border: `1px solid ${item.border}`,
                                                            color: item.color,
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            fontSize: 17,
                                                            fontWeight: 700,
                                                        }}
                                                    >
                                                        {item.level}
                                                    </div>

                                                    <div>
                                                        <Text strong>
                                                            NTRP {item.level}.0
                                                        </Text>

                                                        <div>
                                                            <Text
                                                                type="secondary"
                                                                style={{
                                                                    fontSize: 11,
                                                                }}
                                                            >
                                                                {item.title}
                                                            </Text>
                                                        </div>
                                                    </div>
                                                </div>

                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        fontSize: 12.5,
                                                        lineHeight: 1.5,
                                                    }}
                                                >
                                                    {item.description}
                                                </Text>

                                                <Divider
                                                    style={{
                                                        margin: "12px 0 10px",
                                                    }}
                                                />

                                                <Space
                                                    orientation="vertical"
                                                    size={7}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                >
                                                    {item.points.map((point) => (
                                                        <div
                                                            key={point}
                                                            style={{
                                                                display: "flex",
                                                                alignItems: "flex-start",
                                                                gap: 8,
                                                            }}
                                                        >
                                                            <span
                                                                style={{
                                                                    color: item.color,
                                                                    fontWeight: 700,
                                                                }}
                                                            >
                                                                •
                                                            </span>

                                                            <Text
                                                                style={{
                                                                    fontSize: 12,
                                                                    lineHeight: 1.45,
                                                                }}
                                                            >
                                                                {point}
                                                            </Text>
                                                        </div>
                                                    ))}
                                                </Space>
                                            </div>
                                        }
                                    >
                                        <div
                                            style={{
                                                padding: "14px 5px",
                                                borderRadius: 14,
                                                textAlign: "center",

                                                background: isSelected
                                                    ? item.background
                                                    : "#f8fafc",

                                                border: isSelected
                                                    ? `1px solid ${item.border}`
                                                    : "1px solid #edf0f5",

                                                boxShadow: isSelected
                                                    ? `0 5px 16px ${item.color}25`
                                                    : "none",

                                                transform: isSelected
                                                    ? "translateY(-2px)"
                                                    : "translateY(0)",

                                                cursor: "pointer",
                                                transition: "all 0.2s ease",
                                            }}
                                        >
                                            <div
                                                style={{
                                                    fontSize: 20,
                                                    fontWeight: 700,

                                                    color: isSelected
                                                        ? item.color
                                                        : "#8c8c8c",

                                                    transition: "color 0.2s ease",
                                                }}
                                            >
                                                {item.level}
                                            </div>

                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 10,
                                                }}
                                            >
                                                NTRP
                                            </Text>
                                        </div>
                                    </Popover>
                                );
                            })}
                        </div>

                        <div
                            style={{
                                marginTop: 14,
                                textAlign: "center",
                            }}
                        >
                            <Tag
                                color="blue"
                                style={{
                                    borderRadius: 999,
                                    padding: "4px 12px",
                                    fontWeight: 600,
                                }}
                            >
                                1.0 — 5.0
                            </Tag>
                        </div>

                        <Alert
                            style={{
                                marginTop: 22,
                                borderRadius: 14,
                            }}
                            type="info"
                            showIcon
                            icon={<InfoCircleOutlined />}
                            title="Professional level"
                            description="Players above 5.0 are considered professional-level players."
                        />
                    </div>
                );

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
                                <SafetyCertificateOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Honest ratings make better matches
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Your NTRP helps us create balanced matches.
                            When creating your account choosing a level that genuinely reflects your
                            ability makes the experience better for everyone.
                        </Paragraph>

                        <div
                            style={{
                                marginTop: 24,
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                            }}
                        >
                            {[
                                {
                                    icon: <CheckCircleFilled />,
                                    title: "Choose your real level",
                                    text: "Be honest about your current playing ability.",
                                    color: "#52c41a",
                                    background: "#f6ffed",
                                },
                                {
                                    icon: <TeamOutlined />,
                                    title: "Help create balanced matches",
                                    text: "Accurate ratings help players compete with others at a similar level.",
                                    color: "#1677ff",
                                    background: "#e6f4ff",
                                },
                                {
                                    icon: <SafetyCertificateOutlined />,
                                    title: "Your rating can improve",
                                    text: "Your NTRP isn't necessarily permanent. It can change as you play.",
                                    color: "#722ed1",
                                    background: "#f9f0ff",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                        padding: "14px 15px",
                                        borderRadius: 14,
                                        background: "#fafafa",
                                        border: "1px solid #f0f0f0",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 42,
                                            height: 42,
                                            borderRadius: 12,
                                            background: item.background,
                                            color: item.color,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 18,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {item.icon}
                                    </div>

                                    <div>
                                        <Text strong>
                                            {item.title}
                                        </Text>

                                        <div>
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 12.5,
                                                }}
                                            >
                                                {item.text}
                                            </Text>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Alert
                            style={{
                                marginTop: 18,
                                borderRadius: 14,
                            }}
                            type="success"
                            showIcon
                            title="Made a mistake?"
                            description={
                                <>
                                    If you believe your NTRP is incorrect,
                                    an admin can review it and adjust your
                                    level when appropriate.
                                </>
                            }
                        />
                    </div>
                );

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
                                    background: "#e6f4ff",
                                    color: "#1677ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <LineChartOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Your NTRP evolves with your matches
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Your NTRP can automatically adjust based on the
                            feedback collected from your matches.
                        </Paragraph>

                        {/* FAKE TIMELINE */}
                        <Card
                            size="small"
                            style={{
                                marginTop: 24,
                                borderRadius: 18,
                                border: "1px solid #e6f4ff",
                                background: "linear-gradient(135deg, #f8fbff, #fff)",
                            }}
                        >
                            <Flex
                                justify="space-between"
                                align="center"
                                style={{
                                    marginBottom: 20,
                                }}
                            >
                                <Space size={12}>
                                    <div
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 13,
                                            background: "#e6f4ff",
                                            color: "#1677ff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 20,
                                        }}
                                    >
                                        <LineChartOutlined />
                                    </div>

                                    <div>
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 11,
                                            }}
                                        >
                                            NTRP timeline
                                        </Text>

                                        <div>
                                            <Text strong>
                                                Recent rating history
                                            </Text>
                                        </div>
                                    </div>
                                </Space>

                                <Tag
                                    color="blue"
                                    style={{
                                        borderRadius: 999,
                                        margin: 0,
                                    }}
                                >
                                    Example
                                </Tag>
                            </Flex>

                            <Divider
                                style={{
                                    margin: "0 0 20px",
                                }}
                            />

                            <Timeline
                                items={ntrpHistoryExample.map((item) => {
                                    const isUp = item.totalChange > 0;

                                    return {
                                        color: isUp ? "green" : "red",

                                        icon: isUp ? (
                                            <ArrowUpOutlined
                                                style={{
                                                    color: "#52c41a",
                                                    fontSize: 13,
                                                }}
                                            />
                                        ) : (
                                            <ArrowDownOutlined
                                                style={{
                                                    color: "#ff4d4f",
                                                    fontSize: 13,
                                                }}
                                            />
                                        ),

                                        content: (
                                            <div
                                                style={{
                                                    paddingBottom: 8,
                                                }}
                                            >
                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        fontSize: 11,
                                                    }}
                                                >
                                                    {item.date}
                                                </Text>

                                                <div
                                                    style={{
                                                        marginTop: 2,
                                                    }}
                                                >
                                                    <Text
                                                        strong
                                                        type={
                                                            isUp
                                                                ? "success"
                                                                : "danger"
                                                        }
                                                        style={{
                                                            fontSize: 15,
                                                        }}
                                                    >
                                                        {isUp ? "+" : ""}
                                                        {item.totalChange.toFixed(2)}
                                                    </Text>

                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            fontSize: 11,
                                                            marginLeft: 7,
                                                        }}
                                                    >
                                                        NTRP adjustment
                                                    </Text>
                                                </div>
                                            </div>
                                        ),
                                    };
                                })}
                            />

                            <div
                                style={{
                                    marginTop: 4,
                                    padding: "10px 12px",
                                    borderRadius: 10,
                                    background: "#fafafa",
                                    border: "1px solid #f0f0f0",
                                }}
                            >
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 11.5,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    Your profile timeline keeps a record of changes to
                                    your NTRP over time.
                                </Text>
                            </div>
                        </Card>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                marginTop: 18,
                                fontSize: 12.5,
                                lineHeight: 1.6,
                            }}
                        >
                            You can see your NTRP history and how your level
                            has changed over time in the{" "}
                            <Link to="/profile">
                                timeline in your profile
                            </Link>
                            .
                        </Paragraph>

                        <Alert
                            style={{
                                marginTop: 16,
                                borderRadius: 14,
                            }}
                            type="info"
                            showIcon
                            title="How is it calculated?"
                            description="Your NTRP is updated using an internal rating model that considers feedback collected from your matches and helps keep your level aligned with your recent playing experience."
                        />
                    </div>
                );

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
                                    background: "#f9f0ff",
                                    color: "#722ed1",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <TeamOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Feedback after every match
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            After a match, players can give feedback about
                            each other's playing level.
                        </Paragraph>

                        {/* VOTING OPTIONS */}
                        <div
                            style={{
                                marginTop: 24,
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(3, 1fr)",
                                gap: 9,
                            }}
                        >
                            {[
                                {
                                    label: "Lower",
                                    icon: <FallOutlined />,
                                    color: "#f5222d",
                                    background: "#fff1f0",
                                },
                                {
                                    label: "Correct",
                                    icon: <MinusOutlined />,
                                    color: "#1677ff",
                                    background: "#e6f4ff",
                                },
                                {
                                    label: "Higher",
                                    icon: <RiseOutlined />,
                                    color: "#52c41a",
                                    background: "#f6ffed",
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    style={{
                                        textAlign: "center",
                                        padding:
                                            "16px 6px",
                                        borderRadius: 15,
                                        background:
                                            item.background,
                                        border: "1px solid #f0f0f0",
                                    }}
                                >
                                    <div
                                        style={{
                                            color: item.color,
                                            fontSize: 22,
                                            marginBottom: 7,
                                        }}
                                    >
                                        {item.icon}
                                    </div>

                                    <Text
                                        strong
                                        style={{
                                            fontSize: 12,
                                        }}
                                    >
                                        {item.label}
                                    </Text>
                                </div>
                            ))}
                        </div>

                        <Alert
                            style={{
                                marginTop: 18,
                                borderRadius: 14,
                            }}
                            type="warning"
                            showIcon
                            icon={<ClockCircleOutlined />}
                            title="Feedback is available for 48 hours"
                            description="You can vote on a player's level only during the 48 hours after the match has ended."
                        />

                        <div
                            style={{
                                marginTop: 18,
                                padding: 17,
                                borderRadius: 16,
                                background: "#fafafa",
                                border: "1px solid #f0f0f0",
                            }}
                        >
                            <Space
                                align="start"
                                size={12}
                            >
                                <div
                                    style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 12,
                                        background:
                                            "#f9f0ff",
                                        color: "#722ed1",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent:
                                            "center",
                                        flexShrink: 0,
                                        fontSize: 18,
                                    }}
                                >
                                    <UserOutlined />
                                </div>

                                <div>
                                    <Text strong>
                                        Your feedback is anonymous
                                    </Text>

                                    <div
                                        style={{
                                            marginTop: 3,
                                        }}
                                    >
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 12.5,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            Feedback is anonymous and is
                                            used to improve the experience
                                            and help keep player levels
                                            accurate.
                                        </Text>
                                    </div>
                                </div>
                            </Space>
                        </div>

                        <Alert
                            style={{
                                marginTop: 18,
                                borderRadius: 14,
                            }}
                            type="success"
                            showIcon
                            title="Be fair and honest"
                            description="Only vote based on what you genuinely observed during the match. Accurate feedback helps the whole community."
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
                        background: "#fff7e6",
                        color: "#fa8c16",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: ".4px",
                        marginBottom: 12,
                    }}
                >
                    <TrophyOutlined />
                    NTRP GUIDE
                </div>

                <Title
                    level={3}
                    style={{
                        margin: 0,
                        fontSize: 25,
                        letterSpacing: "-.4px",
                    }}
                >
                    Understanding your NTRP
                </Title>

                <Text
                    type="secondary"
                    style={{
                        display: "block",
                        marginTop: 7,
                        fontSize: 13.5,
                    }}
                >
                    Learn how your level works and how it evolves over time.
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
                            setCurrentStep(
                                (prev) => prev - 1
                            )
                        }
                    >
                        Back
                    </Button>

                    {currentStep < steps.length - 1 ? (
                        <Button
                            type="primary"
                            onClick={() =>
                                setCurrentStep(
                                    (prev) => prev + 1
                                )
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
                            icon={<CheckCircleFilled />}
                            onClick={onClose}
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

export default HelpNTRP;