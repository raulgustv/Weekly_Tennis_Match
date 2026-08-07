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
    TeamOutlined,
    EnvironmentOutlined,
    DollarOutlined,
    CheckCircleFilled,
    InfoCircleOutlined,
    ArrowRightOutlined,
    TrophyOutlined,
    UserOutlined,
    ThunderboltFilled,
    BookOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const HelpMatchDetail = ({ onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Match overview",
            shortTitle: "Overview",
            icon: <InfoCircleOutlined />,
        },
        {
            title: "Players",
            shortTitle: "Players",
            icon: <TeamOutlined />,
        },
        {
            title: "Courts & price",
            shortTitle: "Courts",
            icon: <EnvironmentOutlined />,
        },
        {
            title: "Ready to play",
            shortTitle: "Ready",
            icon: <TrophyOutlined />,
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
                            Everything you need before playing
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                                maxWidth: 530,
                                margin: "0 auto",
                            }}
                        >
                            The match details page gives you a quick overview
                            of the match, including when and where it takes
                            place, the available courts, prices, and the
                            players taking part.
                        </Paragraph>

                        <div
                            style={{
                                marginTop: 24,
                                padding: 18,
                                borderRadius: 17,
                                background:
                                    "linear-gradient(135deg, #f0f7ff, #f8fbff)",
                                border: "1px solid #d6e9ff",
                            }}
                        >
                            <Flex align="center" gap={14}>
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 13,
                                        background: "#fff",
                                        color: "#1677ff",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 20,
                                        flexShrink: 0,
                                        boxShadow:
                                            "0 3px 10px rgba(22,119,255,.08)",
                                    }}
                                >
                                    <BookOutlined />
                                </div>

                                <div>
                                    <Text strong>
                                        Check the details before joining
                                    </Text>

                                    <div style={{ marginTop: 3 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12.5 }}
                                        >
                                            Make sure the time, location and
                                            court information work for you.
                                        </Text>
                                    </div>
                                </div>
                            </Flex>
                        </div>

                        <div
                            style={{
                                marginTop: 18,
                                display: "grid",
                                gridTemplateColumns: "repeat(2, 1fr)",
                                gap: 10,
                            }}
                        >
                            {[
                                {
                                    icon: <EnvironmentOutlined />,
                                    title: "Location",
                                    text: "Where the match takes place.",
                                    color: "#1677ff",
                                    background: "#e6f4ff",
                                },
                                {
                                    icon: <ThunderboltFilled />,
                                    title: "Schedule",
                                    text: "Date and playing time.",
                                    color: "#722ed1",
                                    background: "#f9f0ff",
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    style={{
                                        padding: 14,
                                        borderRadius: 14,
                                        background: "#fafafa",
                                        border: "1px solid #f0f0f0",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 36,
                                            height: 36,
                                            borderRadius: 10,
                                            background: item.background,
                                            color: item.color,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 17,
                                            marginBottom: 9,
                                        }}
                                    >
                                        {item.icon}
                                    </div>

                                    <Text strong>{item.title}</Text>

                                    <div style={{ marginTop: 3 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 11.5 }}
                                        >
                                            {item.text}
                                        </Text>
                                    </div>
                                </div>
                            ))}
                        </div>
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
                            See who's playing
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Once you open a match, you can see the players who
                            have joined and get an idea of the level of the
                            group.
                        </Paragraph>

                        {/* FAKE PLAYERS */}
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
                                            Confirmed participants
                                        </Text>
                                    </div>
                                </div>

                                <Tag
                                    color="green"
                                    style={{
                                        borderRadius: 999,
                                        margin: 0,
                                    }}
                                >
                                    4 players
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
                                {
                                    name: "Maria L.",
                                    ntrp: "4.0",
                                },
                                {
                                    name: "You",
                                    ntrp: "3.8",
                                },
                            ].map((player, index) => (
                                <div
                                    key={player.name}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "11px 0",
                                        borderBottom:
                                            index !== 3
                                                ? "1px solid #f0f0f0"
                                                : "none",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: "50%",
                                            background:
                                                index === 3
                                                    ? "#e6f4ff"
                                                    : "#f6ffed",
                                            color:
                                                index === 3
                                                    ? "#1677ff"
                                                    : "#52c41a",
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
                                                Player
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
                                        NTRP {player.ntrp}
                                    </Tag>
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
                            icon={<InfoCircleOutlined />}
                            title="Player information"
                            description="NTRP levels are shown to help you understand the playing group and create balanced matches."
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
                                    background: "#fff7e6",
                                    color: "#fa8c16",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <DollarOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Courts, surface & price
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Each court can have its own price and surface.
                            The price displayed on the match is the price of
                            <strong> that court</strong>, not a fixed price
                            imposed on every player.
                        </Paragraph>

                        {/* FAKE COURTS */}
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
                                    number: 1,
                                    surface: "Hard court",
                                    price: "€10",
                                    color: "#1677ff",
                                    background: "#e6f4ff",
                                },
                                {
                                    number: 2,
                                    surface: "Clay court",
                                    price: "€12",
                                    color: "#fa8c16",
                                    background: "#fff7e6",
                                },
                            ].map((court) => (
                                <Card
                                    key={court.number}
                                    size="small"
                                    style={{
                                        borderRadius: 16,
                                        border: "1px solid #f0f0f0",
                                    }}
                                >
                                    <Flex
                                        align="center"
                                        justify="space-between"
                                        gap={12}
                                    >
                                        <Flex align="center" gap={12}>
                                            <div
                                                style={{
                                                    width: 42,
                                                    height: 42,
                                                    borderRadius: 12,
                                                    background:
                                                        court.background,
                                                    color: court.color,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent:
                                                        "center",
                                                    fontSize: 18,
                                                }}
                                            >
                                                <EnvironmentOutlined />
                                            </div>

                                            <div>
                                                <Text strong>
                                                    Court {court.number}
                                                </Text>

                                                <div>
                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            fontSize: 11.5,
                                                        }}
                                                    >
                                                        {court.surface}
                                                    </Text>
                                                </div>
                                            </div>
                                        </Flex>

                                        <div style={{ textAlign: "right" }}>
                                            <Text
                                                strong
                                                style={{
                                                    fontSize: 16,
                                                }}
                                            >
                                                {court.price}
                                            </Text>

                                            <div>
                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        fontSize: 10.5,
                                                    }}
                                                >
                                                    per court
                                                </Text>
                                            </div>
                                        </div>
                                    </Flex>
                                </Card>
                            ))}
                        </div>

                        <Alert
                            style={{
                                marginTop: 18,
                                borderRadius: 14,
                            }}
                            type="warning"
                            showIcon
                            icon={<DollarOutlined />}
                            title="Important: price depends on the court"
                            description="You are not required to play on a more expensive court. We try to organize players according to court availability and accommodate everyone as fairly as possible."
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
                            Your match is ready
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Once the match has been organized, you may also
                            see the generated pairings and the players
                            assigned to each match.
                        </Paragraph>

                        <Card
                            size="small"
                            style={{
                                marginTop: 24,
                                borderRadius: 18,
                                background:
                                    "linear-gradient(135deg, #faf5ff, #fff)",
                                border: "1px solid #e9d8ff",
                            }}
                        >
                            <Flex
                                align="center"
                                justify="space-between"
                                style={{ marginBottom: 18 }}
                            >
                                <Flex align="center" gap={12}>
                                    <div
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 13,
                                            background: "#f9f0ff",
                                            color: "#722ed1",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 20,
                                        }}
                                    >
                                        <TrophyOutlined />
                                    </div>

                                    <div>
                                        <Text strong>
                                            Match generated
                                        </Text>

                                        <div>
                                            <Text
                                                type="secondary"
                                                style={{ fontSize: 11.5 }}
                                            >
                                                Your playing group is ready
                                            </Text>
                                        </div>
                                    </div>
                                </Flex>

                                <Tag
                                    color="purple"
                                    style={{
                                        borderRadius: 999,
                                        margin: 0,
                                    }}
                                >
                                    Ready
                                </Tag>
                            </Flex>

                            <Divider style={{ margin: "12px 0" }} />

                            <div
                                style={{
                                    padding: 13,
                                    borderRadius: 13,
                                    background: "#fff",
                                    border: "1px solid #f0f0f0",
                                }}
                            >
                                <Flex align="center" gap={10}>
                                    <CheckCircleFilled
                                        style={{
                                            color: "#52c41a",
                                            fontSize: 18,
                                        }}
                                    />

                                    <Text style={{ fontSize: 12.5 }}>
                                        Check your assigned players and court
                                        before the match.
                                    </Text>
                                </Flex>
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
                            <Flex align="start" gap={12}>
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
                                    <InfoCircleOutlined />
                                </div>

                                <div>
                                    <Text strong>
                                        What should you check?
                                    </Text>

                                    <div
                                        style={{
                                            marginTop: 5,
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: 3,
                                        }}
                                    >
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            • Your assigned players
                                        </Text>

                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            • Your court
                                        </Text>

                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            • The match time
                                        </Text>

                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            • The court surface and price
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
                            type="success"
                            showIcon
                            icon={<CheckCircleFilled />}
                            title="You're all set!"
                            description="Everything you need for the match is available from the match details page."
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
                        background: "#f9f0ff",
                        color: "#722ed1",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: ".4px",
                        marginBottom: 12,
                    }}
                >
                    <BookOutlined />
                    MATCH GUIDE
                </div>

                <Title
                    level={3}
                    style={{
                        margin: 0,
                        fontSize: 25,
                        letterSpacing: "-.4px",
                    }}
                >
                    Understanding match details
                </Title>

                <Text
                    type="secondary"
                    style={{
                        display: "block",
                        marginTop: 7,
                        fontSize: 13.5,
                    }}
                >
                    Everything you can check before stepping onto the court.
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

export default HelpMatchDetail;