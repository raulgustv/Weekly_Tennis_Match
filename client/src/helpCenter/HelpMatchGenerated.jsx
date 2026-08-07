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
    ThunderboltOutlined,
    TrophyOutlined,
    TeamOutlined,
    EditOutlined,
    CheckCircleFilled,
    InfoCircleOutlined,
    ArrowRightOutlined,
    BookOutlined,
    UserOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const HelpMatchGenerated = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Generation",
            shortTitle: "Generate",
            icon: <ThunderboltOutlined />,
        },
        {
            title: "NTRP balance",
            shortTitle: "Balance",
            icon: <TrophyOutlined />,
        },
        {
            title: "Your matches",
            shortTitle: "Matches",
            icon: <TeamOutlined />,
        },
        {
            title: "Admin changes",
            shortTitle: "Changes",
            icon: <EditOutlined />,
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
                                    background: "#e6f4ff",
                                    color: "#1677ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <ThunderboltOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Matches are generated automatically
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
                            Once registration is complete, the system can
                            generate the matches for the players who signed
                            up.
                        </Paragraph>

                        <div
                            style={{
                                marginTop: 24,
                                padding: 20,
                                borderRadius: 18,
                                background:
                                    "linear-gradient(135deg, #f0f7ff, #f8fbff)",
                                border: "1px solid #d6e9ff",
                            }}
                        >
                            <Flex
                                align="center"
                                gap={14}
                            >
                                <div
                                    style={{
                                        width: 46,
                                        height: 46,
                                        borderRadius: 13,
                                        background: "#fff",
                                        color: "#1677ff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 21,
                                        flexShrink: 0,
                                        boxShadow:
                                            "0 2px 8px rgba(0,0,0,.05)",
                                    }}
                                >
                                    <TeamOutlined />
                                </div>

                                <div>
                                    <Text strong style={{ fontSize: 15 }}>
                                        2 vs 2 matches
                                    </Text>

                                    <div style={{ marginTop: 3 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12.5 }}
                                        >
                                            The current automatic generation
                                            is designed for doubles tennis.
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
                            title="Singles are not included yet"
                            description="If players register for Singles, they will not be included in the automatic match generation. Singles support is planned for a future version."
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
                                    background: "#fff7e6",
                                    color: "#d46b08",
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
                            Players are balanced by NTRP
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            The system uses an internal algorithm to create
                            balanced teams based on the NTRP level of the
                            players.
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
                                    icon: <UserOutlined />,
                                    title: "Player NTRP",
                                    text: "Each player's NTRP level is taken into account.",
                                },
                                {
                                    icon: <TeamOutlined />,
                                    title: "Team balance",
                                    text: "The algorithm tries to create competitive and balanced teams.",
                                },
                                {
                                    icon: <TrophyOutlined />,
                                    title: "Match balance",
                                    text: "Teams are compared to keep the match as balanced as possible.",
                                },
                            ].map((item, index) => (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                        padding: "13px 15px",
                                        borderRadius: 14,
                                        background: "#fafafa",
                                        border: "1px solid #f0f0f0",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: 11,
                                            background: "#fff",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            color: "#d46b08",
                                            fontSize: 17,
                                            flexShrink: 0,
                                            boxShadow:
                                                "0 2px 8px rgba(0,0,0,.04)",
                                        }}
                                    >
                                        {item.icon}
                                    </div>

                                    <div>
                                        <Text strong>{item.title}</Text>

                                        <div>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: 12.5 }}
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
                            type="warning"
                            showIcon
                            icon={<InfoCircleOutlined />}
                            title="The algorithm does the initial work"
                            description="The exact way teams are generated is handled internally by the application. You don't need to manually create the teams."
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
                                    background: "#f6ffed",
                                    color: "#389e0d",
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
                            See who you are playing with
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Once the matches have been generated, you can see
                            the teams assigned to each court and round.
                        </Paragraph>

                        <Card
                            size="small"
                            style={{
                                marginTop: 24,
                                borderRadius: 18,
                                background: "#fafafa",
                                border: "1px solid #f0f0f0",
                            }}
                        >
                            <Flex
                                justify="space-between"
                                align="center"
                                style={{ marginBottom: 16 }}
                            >
                                <Text
                                    strong
                                    style={{
                                        fontSize: 15,
                                    }}
                                >
                                    Court 1 · Round 1
                                </Text>

                                <Tag
                                    color="green"
                                    style={{
                                        borderRadius: 999,
                                        margin: 0,
                                    }}
                                >
                                    Generated
                                </Tag>
                            </Flex>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "1fr auto 1fr",
                                    gap: 10,
                                    alignItems: "center",
                                }}
                            >
                                <div
                                    style={{
                                        padding: 12,
                                        borderRadius: 13,
                                        background: "#fff",
                                        borderLeft:
                                            "3px solid #1677ff",
                                    }}
                                >
                                    <Text strong style={{ fontSize: 13 }}>
                                        Team A
                                    </Text>

                                    <div style={{ marginTop: 5 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Player · Player
                                        </Text>
                                    </div>

                                    <div style={{ marginTop: 6 }}>
                                        <Tag
                                            color="blue"
                                            style={{
                                                borderRadius: 999,
                                                fontSize: 11,
                                            }}
                                        >
                                            Avg NTRP 3.5
                                        </Tag>
                                    </div>
                                </div>

                                <Text
                                    strong
                                    type="secondary"
                                    style={{ fontSize: 11 }}
                                >
                                    VS
                                </Text>

                                <div
                                    style={{
                                        padding: 12,
                                        borderRadius: 13,
                                        background: "#fff",
                                        borderLeft:
                                            "3px solid #389e0d",
                                    }}
                                >
                                    <Text strong style={{ fontSize: 13 }}>
                                        Team B
                                    </Text>

                                    <div style={{ marginTop: 5 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Player · Player
                                        </Text>
                                    </div>

                                    <div style={{ marginTop: 6 }}>
                                        <Tag
                                            color="green"
                                            style={{
                                                borderRadius: 999,
                                                fontSize: 11,
                                            }}
                                        >
                                            Avg NTRP 3.5
                                        </Tag>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div
                            style={{
                                marginTop: 18,
                                padding: 16,
                                borderRadius: 14,
                                background: "#f6ffed",
                                border: "1px solid #d9f7be",
                                textAlign: "center",
                            }}
                        >
                            <Text strong style={{ color: "#389e0d" }}>
                                Balanced teams, ready to play 🎾
                            </Text>
                        </div>
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
                                    background: "#fff2e8",
                                    color: "#d4380d",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <EditOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            The admin can adjust the matches
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            The generated matches are not necessarily final.
                            An administrator can review and make changes when
                            needed.
                        </Paragraph>

                        <div
                            style={{
                                marginTop: 24,
                                padding: 20,
                                borderRadius: 18,
                                background: "#fffaf5",
                                border: "1px solid #ffe7ba",
                            }}
                        >
                            <Flex
                                align="center"
                                gap={14}
                            >
                                <div
                                    style={{
                                        width: 46,
                                        height: 46,
                                        borderRadius: 13,
                                        background: "#fff",
                                        color: "#d4380d",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 21,
                                        flexShrink: 0,
                                        boxShadow:
                                            "0 2px 8px rgba(0,0,0,.05)",
                                    }}
                                >
                                    <EditOutlined />
                                </div>

                                <div>
                                    <Text strong style={{ fontSize: 15 }}>
                                        Human review
                                    </Text>

                                    <div style={{ marginTop: 3 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12.5 }}
                                        >
                                            Admins can modify the generated
                                            pairs to improve the final balance.
                                        </Text>
                                    </div>
                                </div>
                            </Flex>
                        </div>

                        <Divider style={{ margin: "22px 0" }} />

                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <CheckCircleFilled
                                    style={{
                                        color: "#52c41a",
                                        fontSize: 18,
                                    }}
                                />

                                <Text>
                                    The algorithm creates the initial
                                    distribution.
                                </Text>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <CheckCircleFilled
                                    style={{
                                        color: "#52c41a",
                                        fontSize: 18,
                                    }}
                                />

                                <Text>
                                    The admin reviews the generated matches.
                                </Text>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <CheckCircleFilled
                                    style={{
                                        color: "#52c41a",
                                        fontSize: 18,
                                    }}
                                />

                                <Text>
                                    Changes can be made when a better balance
                                    is possible.
                                </Text>
                            </div>
                        </div>

                        <Alert
                            style={{
                                marginTop: 20,
                                borderRadius: 14,
                            }}
                            type="info"
                            showIcon
                            icon={<InfoCircleOutlined />}
                            title="Why can an admin change it?"
                            description="NTRP is an important part of the balancing process, but there can be other practical considerations. Admins have the final say when adjusting the generated matches."
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
                        background: "#f6ffed",
                        color: "#389e0d",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: ".4px",
                        marginBottom: 12,
                    }}
                >
                    <BookOutlined />
                    QUICK GUIDE
                </div>

                <Title
                    level={3}
                    style={{
                        margin: 0,
                        fontSize: 25,
                        letterSpacing: "-.4px",
                    }}
                >
                    How generated matches work
                </Title>

                <Text
                    type="secondary"
                    style={{
                        display: "block",
                        marginTop: 7,
                        fontSize: 13.5,
                    }}
                >
                    Understand how players are grouped and how matches are
                    balanced.
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
                            icon={<CheckCircleFilled />}
                            onClick={() => {
                                if (onClose) {
                                    onClose();
                                } else {
                                    setCurrentStep(0);
                                }
                            }}
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

export default HelpMatchGenerated;