import React, { useState } from "react";
import {
    Card,
    Typography,
    Steps,
    Button,
    Tag,
    Space,
    Alert,
    Divider,
} from "antd";
import {
    RocketOutlined,
    LockOutlined,
    CreditCardOutlined,
    EditOutlined,
    TrophyOutlined,
    GoogleOutlined,
    MailOutlined,
    ArrowRightOutlined,
    CheckCircleFilled,
    ClockCircleOutlined,
    GlobalOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const upcomingFeatures = [
    {
        number: 1,
        title: "Change password",
        shortTitle: "Password",
        icon: <LockOutlined />,
        color: "#1677ff",
        background: "#e6f4ff",
        description:
            "We're working on a secure password change and recovery system.",
        detail:
            "We are currently waiting to get our own domain so we can properly set up the email infrastructure required for password recovery and related security features.",
    },
    {
        number: 2,
        title: "More payment methods",
        shortTitle: "Payments",
        icon: <CreditCardOutlined />,
        color: "#13c2c2",
        background: "#e6fffb",
        description:
            "More ways to pay for your Weekly Tennis matches.",
        detail:
            "A payment gateway is currently under discussion. For now, we prefer to keep supporting traditional payment methods while we decide on the best option for the community.",
    },
    {
        number: 3,
        title: "More profile options",
        shortTitle: "Profile",
        icon: <EditOutlined />,
        color: "#722ed1",
        background: "#f9f0ff",
        description:
            "Your profile will become more flexible and customizable.",
        detail:
            "We're planning to add more editable information and profile options so you can better represent yourself as a player.",
    },
    {
        number: 4,
        title: "Ranking & tournaments",
        shortTitle: "Tournaments",
        icon: <TrophyOutlined />,
        color: "#fa8c16",
        background: "#fff7e6",
        description:
            "Use Weekly Tennis to create rankings and tournaments.",
        detail:
            "We're exploring ways to turn the app into more than just weekly matches, including internal rankings, tournaments and new ways for players to compete.",
    },
    {
        number: 5,
        title: "Google login",
        shortTitle: "Google",
        icon: <GoogleOutlined />,
        color: "#52c41a",
        background: "#f6ffed",
        description:
            "A faster way to access your Weekly Tennis account.",
        detail:
            "Federated login with Google is planned to make signing in simpler and more convenient.",
    },
    {
        number: 6,
        title: "Internal mailbox",
        shortTitle: "Mailbox",
        icon: <MailOutlined />,
        color: "#eb2f96",
        background: "#fff0f6",
        description:
            "A notification center built directly into Weekly Tennis.",
        detail:
            "We're planning an internal mailbox where you can receive and review important messages and notifications without relying only on browser or email notifications.",
    },
];

const HelpComingSoon = ({onClose}) => {
    const [currentStep, setCurrentStep] = useState(0);

    const currentFeature = upcomingFeatures[currentStep];

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
                    <RocketOutlined />
                    COMING SOON
                </div>

                <Title
                    level={3}
                    style={{
                        margin: 0,
                        fontSize: 25,
                        letterSpacing: "-.4px",
                    }}
                >
                    What's coming to Weekly Tennis
                </Title>

                <Text
                    type="secondary"
                    style={{
                        display: "block",
                        marginTop: 7,
                        fontSize: 13.5,
                        lineHeight: 1.6,
                    }}
                >
                    We're constantly working to make Weekly Tennis
                    better for our tennis community.
                </Text>
            </div>

            {/* ROADMAP */}
            <Steps
                current={currentStep}
                responsive
                size="small"
                onChange={setCurrentStep}
                items={upcomingFeatures.map((item) => ({
                    title: item.shortTitle,
                    icon: item.icon,
                }))}
                style={{
                    marginBottom: 28,
                }}
            />

            {/* FEATURE CARD */}
            <Card
                variant="borderless"
                style={{
                    borderRadius: 24,
                    background: "#fff",
                    boxShadow:
                        "0 10px 35px rgba(0, 0, 0, 0.055)",
                    border: "1px solid #f0f0f0",
                    overflow: "hidden",
                }}
                styles={{
                    body: {
                        padding: 0,
                    },
                }}
            >
                {/* FEATURE HEADER */}
                <div
                    style={{
                        padding: "28px 24px 24px",
                        background: `linear-gradient(135deg, ${currentFeature.background}, #fff)`,
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 15,
                        }}
                    >
                        <div
                            style={{
                                width: 58,
                                height: 58,
                                borderRadius: 17,
                                background:
                                    currentFeature.background,
                                color: currentFeature.color,
                                border: `1px solid ${currentFeature.color}25`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 25,
                                flexShrink: 0,
                            }}
                        >
                            {currentFeature.icon}
                        </div>

                        <div style={{ flex: 1 }}>
                            <Space
                                size={7}
                                align="center"
                            >
                                <Tag
                                    color={currentFeature.color}
                                    style={{
                                        borderRadius: 999,
                                        margin: 0,
                                        fontSize: 10,
                                        fontWeight: 600,
                                    }}
                                >
                                    #{currentFeature.number}
                                </Tag>

                                <Tag
                                    style={{
                                        borderRadius: 999,
                                        margin: 0,
                                        fontSize: 10,
                                    }}
                                >
                                    Coming soon
                                </Tag>
                            </Space>

                            <Title
                                level={3}
                                style={{
                                    margin:
                                        "7px 0 0",
                                    fontSize: 21,
                                }}
                            >
                                {currentFeature.title}
                            </Title>
                        </div>
                    </div>
                </div>

                {/* FEATURE CONTENT */}
                <div
                    style={{
                        padding:
                            "24px 24px 26px",
                    }}
                >
                    <Paragraph
                        style={{
                            fontSize: 15,
                            lineHeight: 1.7,
                            marginBottom: 10,
                        }}
                    >
                        {currentFeature.description}
                    </Paragraph>

                    <Text
                        type="secondary"
                        style={{
                            fontSize: 13,
                            lineHeight: 1.7,
                        }}
                    >
                        {currentFeature.detail}
                    </Text>

                    <Divider
                        style={{
                            margin: "22px 0 18px",
                        }}
                    />

                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 12,
                            padding: 14,
                            borderRadius: 14,
                            background: "#fafafa",
                            border:
                                "1px solid #f0f0f0",
                        }}
                    >
                        <div
                            style={{
                                width: 38,
                                height: 38,
                                borderRadius: 11,
                                background: `${currentFeature.color}12`,
                                color:
                                    currentFeature.color,
                                display: "flex",
                                alignItems:
                                    "center",
                                justifyContent:
                                    "center",
                                flexShrink: 0,
                            }}
                        >
                            <ClockCircleOutlined />
                        </div>

                        <div>
                            <Text
                                strong
                                style={{
                                    fontSize: 12.5,
                                }}
                            >
                                In development
                            </Text>

                            <div>
                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 11.5,
                                    }}
                                >
                                    This feature is part of
                                    our future roadmap.
                                </Text>
                            </div>
                        </div>
                    </div>
                </div>

                {/* NAVIGATION */}
                <div
                    style={{
                        display: "flex",
                        justifyContent:
                            "space-between",
                        alignItems: "center",
                        padding:
                            "16px 24px 20px",
                        borderTop:
                            "1px solid #f0f0f0",
                    }}
                >
                    <Button
                        type="text"
                        disabled={currentStep === 0}
                        onClick={() =>
                            setCurrentStep(
                                (prev) =>
                                    prev - 1
                            )
                        }
                    >
                        Back
                    </Button>

                    {currentStep <
                    upcomingFeatures.length - 1 ? (
                        <Button
                            type="primary"
                            onClick={() =>
                                setCurrentStep(
                                    (prev) =>
                                        prev + 1
                                )
                            }
                            icon={
                                <ArrowRightOutlined />
                            }
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
                            icon={
                                <CheckCircleFilled />
                            }
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

            {/* FOOTER MESSAGE */}
            <Alert
                style={{
                    marginTop: 18,
                    borderRadius: 15,
                }}
                type="info"
                showIcon
                icon={<GlobalOutlined />}
                title="Built for the community"
                description="Weekly Tennis is growing step by step. Our goal is to build a better tennis experience together with the players who use it."
            />

            {/* PROGRESS */}
            <div
                style={{
                    textAlign: "center",
                    marginTop: 15,
                }}
            >
                <Text
                    type="secondary"
                    style={{
                        fontSize: 11,
                    }}
                >
                    Feature {currentStep + 1} of{" "}
                    {upcomingFeatures.length}
                </Text>
            </div>
        </div>
    );
};

export default HelpComingSoon;