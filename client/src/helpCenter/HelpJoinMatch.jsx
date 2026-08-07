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
    CalendarOutlined,
    SearchOutlined,
    LoginOutlined,
    ReloadOutlined,
    CheckCircleFilled,
    InfoCircleOutlined,
    ArrowRightOutlined,
    ThunderboltFilled,
    BookOutlined,
    UserDeleteOutlined,
    ClockCircleOutlined,
    SafetyCertificateOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const HelpJoinMatch = ({onClose}) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Wait for the matches",
            shortTitle: "When?",
            icon: <CalendarOutlined />,
        },
        {
            title: "Find your match",
            shortTitle: "Find it",
            icon: <SearchOutlined />,
        },
        {
            title: "Join the match",
            shortTitle: "Join",
            icon: <LoginOutlined />,
        },
        {
            title: "Can't see it?",
            shortTitle: "Refresh",
            icon: <ReloadOutlined />,
        },
        {
            title: "Leaving a match",
            shortTitle: "Leave",
            icon: <UserDeleteOutlined />,
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
                                <CalendarOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Matches are usually posted on Wednesdays
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                                maxWidth: 520,
                                margin: "0 auto",
                            }}
                        >
                            If you're looking for this week's matches,
                            <strong> Wednesday is the day to check.</strong>
                        </Paragraph>

                        <div
                            style={{
                                marginTop: 24,
                                padding: 18,
                                borderRadius: 16,
                                background:
                                    "linear-gradient(135deg, #f0f7ff, #f8fbff)",
                                border: "1px solid #d6e9ff",
                                textAlign: "center",
                            }}
                        >
                            <Tag
                                color="blue"
                                style={{
                                    borderRadius: 999,
                                    padding: "4px 14px",
                                    fontWeight: 600,
                                }}
                            >
                                <CalendarOutlined /> WEDNESDAY or SUNDAY
                            </Tag>

                            <div style={{ marginTop: 10 }}>
                                <Text type="secondary">
                                    That's when you should start checking
                                    for new matches. The group usually plays on Saturday morning or Tuesday morning
                                </Text>
                            </div>
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
                                <SearchOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Find an available match
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Browse the available matches and look for the one
                            you want to play.
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
                                    icon: <CalendarOutlined />,
                                    title: "Check the date & time",
                                    text: "Make sure the match works for you.",
                                },
                                {
                                    icon: <InfoCircleOutlined />,
                                    title: "Check the location",
                                    text: "See where the match will take place.",
                                },
                                {
                                    icon: <ThunderboltFilled />,
                                    title: "Check availability",
                                    text: "Make sure there is still a spot available.",
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
                                            color: "#1677ff",
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
                                <LoginOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Ready to play?
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                                marginBottom: 26,
                            }}
                        >
                            Open the match you're interested in and look for
                            the <strong>Join Match</strong> button.
                        </Paragraph>

                        {/* Fake match UI */}
                        <Card
                            size="small"
                            style={{
                                borderRadius: 18,
                                border: "1px solid #e8e8e8",
                                boxShadow:
                                    "0 8px 24px rgba(0,0,0,.05)",
                            }}
                        >
                            <Flex
                                justify="space-between"
                                align="center"
                                style={{ marginBottom: 16 }}
                            >
                                <div>
                                    <Text strong style={{ fontSize: 16 }}>
                                        Weekly Tennis Match
                                    </Text>

                                    <div style={{ marginTop: 4 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Saturday · 10:00 – 12:00
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
                                    Available
                                </Tag>
                            </Flex>

                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns:
                                        "repeat(2, 1fr)",
                                    gap: 10,
                                    marginBottom: 16,
                                }}
                            >
                                <div
                                    style={{
                                        padding: 10,
                                        borderRadius: 12,
                                        background: "#fafafa",
                                    }}
                                >
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 11 }}
                                    >
                                        Location
                                    </Text>

                                    <div>
                                        <Text strong style={{ fontSize: 13 }}>
                                            Tennis Club
                                        </Text>
                                    </div>
                                </div>

                                <div
                                    style={{
                                        padding: 10,
                                        borderRadius: 12,
                                        background: "#fafafa",
                                    }}
                                >
                                    <Text
                                        type="secondary"
                                        style={{ fontSize: 11 }}
                                    >
                                        Price
                                    </Text>

                                    <div>
                                        <Text strong style={{ fontSize: 13 }}>
                                            €10 / player
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="primary"
                                block
                                size="large"
                                icon={<LoginOutlined />}
                                style={{
                                    height: 44,
                                    borderRadius: 12,
                                    fontWeight: 600,
                                    boxShadow:
                                        "0 6px 16px rgba(22,119,255,.20)",
                                }}
                            >
                                Join Match
                            </Button>
                        </Card>

                        <div
                            style={{
                                marginTop: 16,
                                textAlign: "center",
                            }}
                        >
                            <Text
                                type="secondary"
                                style={{ fontSize: 12 }}
                            >
                                That's it! Once you join, your spot is
                                reserved according to the match availability.
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
                                    background: "#f9f0ff",
                                    color: "#722ed1",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <ReloadOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Can't see a match?
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            If you know a match has been posted but it isn't
                            showing up, try refreshing first.
                        </Paragraph>

                        <div
                            style={{
                                marginTop: 24,
                                padding: 20,
                                borderRadius: 18,
                                background: "#fafafa",
                                border: "1px solid #f0f0f0",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    marginBottom: 18,
                                }}
                            >
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 13,
                                        background: "#f0f5ff",
                                        color: "#2f54eb",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 20,
                                    }}
                                >
                                    <ReloadOutlined />
                                </div>

                                <div>
                                    <Text strong style={{ fontSize: 15 }}>
                                        Step 1 — Refresh the matches
                                    </Text>

                                    <div>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Give the list a moment to update.
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            <Divider style={{ margin: "14px 0" }} />

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                }}
                            >
                                <div
                                    style={{
                                        width: 44,
                                        height: 44,
                                        borderRadius: 13,
                                        background: "#fff1f0",
                                        color: "#f5222d",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 20,
                                    }}
                                >
                                    <ReloadOutlined />
                                </div>

                                <div>
                                    <Text strong style={{ fontSize: 15 }}>
                                        Step 2 — Refresh the page
                                    </Text>

                                    <div>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            If it still isn't there, reload
                                            the entire page.
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <Alert
                            style={{
                                marginTop: 18,
                                borderRadius: 14,
                            }}
                            type="info"
                            showIcon
                            icon={<InfoCircleOutlined />}
                            title="Still not showing?"
                            description="If the match still doesn't appear after refreshing the page, it may not be available yet. Check again later or contact an admin if you believe there is an issue."
                        />
                    </div>
                );

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
                                    background: "#fff1f0",
                                    color: "#f5222d",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <UserDeleteOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Need to leave a match?
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            We understand that sometimes plans change.
                            If you need to leave a match, please do so
                            as early as possible.
                        </Paragraph>

                        {/* MORE THAN 24 HOURS */}
                        <div
                            style={{
                                marginTop: 24,
                                padding: 20,
                                borderRadius: 18,
                                background:
                                    "linear-gradient(135deg, #f6ffed, #ffffff)",
                                border: "1px solid #d9f7be",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    marginBottom: 16,
                                }}
                            >
                                <div
                                    style={{
                                        width: 46,
                                        height: 46,
                                        borderRadius: 13,
                                        background: "#f6ffed",
                                        color: "#52c41a",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 21,
                                    }}
                                >
                                    <ClockCircleOutlined />
                                </div>

                                <div>
                                    <Text strong style={{ fontSize: 15 }}>
                                        More than 24 hours before the match
                                    </Text>

                                    <div style={{ marginTop: 3 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            You can leave the match normally.
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            <Text
                                type="secondary"
                                style={{
                                    fontSize: 12.5,
                                    lineHeight: 1.6,
                                }}
                            >
                                If the match is more than 24 hours away,
                                you can leave your spot so another player
                                can take it.
                            </Text>
                        </div>

                        {/* LESS THAN 24 HOURS */}
                        <div
                            style={{
                                marginTop: 14,
                                padding: 20,
                                borderRadius: 18,
                                background: "#fff7e6",
                                border: "1px solid #ffe7ba",
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 14,
                                    marginBottom: 16,
                                }}
                            >
                                <div
                                    style={{
                                        width: 46,
                                        height: 46,
                                        borderRadius: 13,
                                        background: "#fff7e6",
                                        color: "#fa8c16",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 21,
                                    }}
                                >
                                    <SafetyCertificateOutlined />
                                </div>

                                <div>
                                    <Text strong style={{ fontSize: 15 }}>
                                        Less than 24 hours before the match
                                    </Text>

                                    <div style={{ marginTop: 3 }}>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Contact an administrator.
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            <Text
                                type="secondary"
                                style={{
                                    fontSize: 12.5,
                                    lineHeight: 1.6,
                                }}
                            >
                                If you need to leave within 24 hours of
                                the match, please contact an admin and
                                explain why you need to withdraw.
                            </Text>
                        </div>

                        <Alert
                            style={{
                                marginTop: 18,
                                borderRadius: 14,
                            }}
                            type="warning"
                            showIcon
                            title="Last-minute cancellations"
                            description={
                                <>
                                    Administrators review these situations
                                    individually. Depending on the reason
                                    for leaving a match, a suspension may
                                    apply. Any suspension is at the discretion
                                    of the administrators.
                                </>
                            }
                        />

                        <div
                            style={{
                                marginTop: 18,
                                padding: 16,
                                borderRadius: 15,
                                background: "#fafafa",
                                border: "1px solid #f0f0f0",
                                textAlign: "center",
                            }}
                        >
                            <Text
                                type="secondary"
                                style={{
                                    fontSize: 12,
                                    lineHeight: 1.6,
                                }}
                            >
                                💙 Please let us know as early as possible.
                                Giving other players enough time to fill
                                your spot helps keep matches running smoothly.
                            </Text>
                        </div>
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
                        background: "#e6f4ff",
                        color: "#1677ff",
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
                    How to join a match
                </Title>

                <Text
                    type="secondary"
                    style={{
                        display: "block",
                        marginTop: 7,
                        fontSize: 13.5,
                    }}
                >
                    Follow these simple steps to find and join your next match.
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

export default HelpJoinMatch;