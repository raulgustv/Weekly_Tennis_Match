import React, { useState } from "react";
import {
    Card,
    Typography,
    Space,
    Steps,
    Button,
    Alert,
    Flex,
    Tabs,
} from "antd";
import {
    BellOutlined,
    MobileOutlined,
    AppleOutlined,
    AndroidOutlined,
    TrophyOutlined,
    UserAddOutlined,
    ArrowRightOutlined,
    CheckCircleFilled,
    ShareAltOutlined,
    HomeOutlined,
    SafetyCertificateOutlined,
    SettingOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const HelpNotifications = ({onClose}) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [device, setDevice] = useState("iphone");

    const steps = [
        {
            title: "Notifications",
            shortTitle: "Overview",
            icon: <BellOutlined />,
        },
        {
            title: "Choose device",
            shortTitle: "Device",
            icon: <MobileOutlined />,
        },
        {
            title: "Enable notifications",
            shortTitle: "Enable",
            icon: <SafetyCertificateOutlined />,
        },
        {
            title: "What you'll receive",
            shortTitle: "Alerts",
            icon: <BellOutlined />,
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
                                <BellOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Stay up to date
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
                            Weekly Tennis can notify you about important
                            activity so you don't have to keep checking the
                            app.
                        </Paragraph>

                        <div
                            style={{
                                marginTop: 26,
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                            }}
                        >
                            {[
                                {
                                    icon: <TrophyOutlined />,
                                    title: "New match available",
                                    text: "Get notified when a new Weekly Tennis match is posted.",
                                    color: "#1677ff",
                                    background: "#e6f4ff",
                                },
                                {
                                    icon: <UserAddOutlined />,
                                    title: "A player joined your match",
                                    text: "Know when another player joins a match you're playing.",
                                    color: "#722ed1",
                                    background: "#f9f0ff",
                                },
                                {
                                    icon: <BellOutlined />,
                                    title: "More notifications coming",
                                    text: "We're working on additional match activity alerts.",
                                    color: "#fa8c16",
                                    background: "#fff7e6",
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                        padding: "14px 15px",
                                        borderRadius: 15,
                                        background: "#fafafa",
                                        border: "1px solid #f0f0f0",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 12,
                                            background: item.background,
                                            color: item.color,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 19,
                                            flexShrink: 0,
                                        }}
                                    >
                                        {item.icon}
                                    </div>

                                    <div>
                                        <Text strong>
                                            {item.title}
                                        </Text>

                                        <div style={{ marginTop: 2 }}>
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
                                marginTop: 20,
                                borderRadius: 14,
                            }}
                            type="info"
                            showIcon
                            title="Notifications are optional"
                            description="You can use Weekly Tennis without enabling browser notifications."
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
                                <MobileOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Choose your device
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            The setup is different on iPhone and Android, so
                            choose the device you're using.
                        </Paragraph>

                        <Tabs
                            activeKey={device}
                            onChange={setDevice}
                            centered
                            style={{
                                marginTop: 22,
                            }}
                            items={[
                                {
                                    key: "iphone",
                                    label: (
                                        <span>
                                            <AppleOutlined />
                                            {" "}iPhone
                                        </span>
                                    ),
                                    children: (
                                        <div
                                            style={{
                                                paddingTop: 8,
                                            }}
                                        >
                                            <Alert
                                                type="info"
                                                showIcon
                                                style={{
                                                    borderRadius: 14,
                                                }}
                                                title="iPhone setup is a little different"
                                                description="Weekly Tennis needs to be added to your Home Screen before notifications can be enabled."
                                            />

                                            <div
                                                style={{
                                                    marginTop: 18,
                                                    display: "flex",
                                                    flexDirection:
                                                        "column",
                                                    gap: 10,
                                                }}
                                            >
                                                {[
                                                    {
                                                        number: 1,
                                                        icon: (
                                                            <MobileOutlined />
                                                        ),
                                                        title:
                                                            "Open Weekly Tennis in Safari",
                                                        text:
                                                            "Make sure you're using Safari on your iPhone.",
                                                    },
                                                    {
                                                        number: 2,
                                                        icon: (
                                                            <ShareAltOutlined />
                                                        ),
                                                        title:
                                                            "Tap Share",
                                                        text:
                                                            "Use the Share button at the bottom of Safari.",
                                                    },
                                                    {
                                                        number: 3,
                                                        icon: (
                                                            <HomeOutlined />
                                                        ),
                                                        title:
                                                            "Add to Home Screen",
                                                        text:
                                                            "Choose “Add to Home Screen” from the Share menu.",
                                                    },
                                                    {
                                                        number: 4,
                                                        icon: (
                                                            <BellOutlined />
                                                        ),
                                                        title:
                                                            "Allow notifications",
                                                        text:
                                                            "Open Weekly Tennis from your Home Screen and allow notifications when prompted.",
                                                    },
                                                ].map((item) => (
                                                    <div
                                                        key={item.number}
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 13,
                                                            padding:
                                                                "13px 14px",
                                                            borderRadius: 14,
                                                            background:
                                                                "#fafafa",
                                                            border:
                                                                "1px solid #f0f0f0",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: 38,
                                                                height: 38,
                                                                borderRadius:
                                                                    11,
                                                                background:
                                                                    "#e6f4ff",
                                                                color:
                                                                    "#1677ff",
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                flexShrink: 0,
                                                                position:
                                                                    "relative",
                                                            }}
                                                        >
                                                            {
                                                                item.icon
                                                            }

                                                            <span
                                                                style={{
                                                                    position:
                                                                        "absolute",
                                                                    top:
                                                                        -6,
                                                                    right:
                                                                        -6,
                                                                    width: 18,
                                                                    height: 18,
                                                                    borderRadius:
                                                                        "50%",
                                                                    background:
                                                                        "#1677ff",
                                                                    color:
                                                                        "#fff",
                                                                    fontSize:
                                                                        9,
                                                                    fontWeight:
                                                                        700,
                                                                    display:
                                                                        "flex",
                                                                    alignItems:
                                                                        "center",
                                                                    justifyContent:
                                                                        "center",
                                                                }}
                                                            >
                                                                {
                                                                    item.number
                                                                }
                                                            </span>
                                                        </div>

                                                        <div>
                                                            <Text strong>
                                                                {
                                                                    item.title
                                                                }
                                                            </Text>

                                                            <div>
                                                                <Text
                                                                    type="secondary"
                                                                    style={{
                                                                        fontSize:
                                                                            11.5,
                                                                        lineHeight:
                                                                            1.4,
                                                                    }}
                                                                >
                                                                    {
                                                                        item.text
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                },
                                {
                                    key: "android",
                                    label: (
                                        <span>
                                            <AndroidOutlined />
                                            {" "}Android
                                        </span>
                                    ),
                                    children: (
                                        <div
                                            style={{
                                                paddingTop: 8,
                                            }}
                                        >
                                            <Alert
                                                type="success"
                                                showIcon
                                                style={{
                                                    borderRadius: 14,
                                                }}
                                                title="Android is simpler"
                                                description="Open Weekly Tennis in Chrome and allow notifications when your browser asks."
                                            />

                                            <div
                                                style={{
                                                    marginTop: 18,
                                                    display: "flex",
                                                    flexDirection:
                                                        "column",
                                                    gap: 10,
                                                }}
                                            >
                                                {[
                                                    {
                                                        number: 1,
                                                        icon: (
                                                            <MobileOutlined />
                                                        ),
                                                        title:
                                                            "Open Weekly Tennis in Chrome",
                                                        text:
                                                            "Use Google Chrome on your Android device.",
                                                    },
                                                    {
                                                        number: 2,
                                                        icon: (
                                                            <BellOutlined />
                                                        ),
                                                        title:
                                                            "Allow notifications",
                                                        text:
                                                            "Tap “Allow” when Chrome asks whether Weekly Tennis can send notifications.",
                                                    },
                                                ].map((item) => (
                                                    <div
                                                        key={item.number}
                                                        style={{
                                                            display: "flex",
                                                            alignItems:
                                                                "center",
                                                            gap: 13,
                                                            padding:
                                                                "14px",
                                                            borderRadius: 14,
                                                            background:
                                                                "#fafafa",
                                                            border:
                                                                "1px solid #f0f0f0",
                                                        }}
                                                    >
                                                        <div
                                                            style={{
                                                                width: 40,
                                                                height: 40,
                                                                borderRadius:
                                                                    12,
                                                                background:
                                                                    "#f6ffed",
                                                                color:
                                                                    "#52c41a",
                                                                display:
                                                                    "flex",
                                                                alignItems:
                                                                    "center",
                                                                justifyContent:
                                                                    "center",
                                                                fontSize: 18,
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            {
                                                                item.icon
                                                            }
                                                        </div>

                                                        <div>
                                                            <Text strong>
                                                                {
                                                                    item.title
                                                                }
                                                            </Text>

                                                            <div>
                                                                <Text
                                                                    type="secondary"
                                                                    style={{
                                                                        fontSize:
                                                                            12,
                                                                    }}
                                                                >
                                                                    {
                                                                        item.text
                                                                    }
                                                                </Text>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ),
                                },
                            ]}
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
                                    background: "#f9f0ff",
                                    color: "#722ed1",
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
                            Enable your notifications
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Follow the steps for your device to allow Weekly
                            Tennis to notify you.
                        </Paragraph>

                        <Tabs
                            activeKey={device}
                            onChange={setDevice}
                            centered
                            style={{
                                marginTop: 22,
                            }}
                            items={[
                                {
                                    key: "iphone",
                                    label: (
                                        <span>
                                            <AppleOutlined />
                                            {" "}iPhone
                                        </span>
                                    ),
                                    children: (
                                        <div>
                                            <div
                                                style={{
                                                    padding: 16,
                                                    borderRadius: 16,
                                                    background:
                                                        "#f8fbff",
                                                    border:
                                                        "1px solid #e6f4ff",
                                                }}
                                            >
                                                <Space
                                                    orientation="vertical"
                                                    size={14}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                >
                                                    {[
                                                        {
                                                            number: 1,
                                                            title:
                                                                "Open Safari",
                                                            text:
                                                                "Visit Weekly Tennis using Safari.",
                                                        },
                                                        {
                                                            number: 2,
                                                            title:
                                                                "Add Weekly Tennis to your Home Screen",
                                                            text:
                                                                "Tap Share → Add to Home Screen.",
                                                        },
                                                        {
                                                            number: 3,
                                                            title:
                                                                "Open the Home Screen app",
                                                            text:
                                                                "Launch Weekly Tennis using the new icon on your Home Screen.",
                                                        },
                                                        {
                                                            number: 4,
                                                            title:
                                                                "Allow notifications",
                                                            text:
                                                                "When the notification permission appears, tap Allow.",
                                                        },
                                                    ].map(
                                                        (item) => (
                                                            <Flex
                                                                key={
                                                                    item.number
                                                                }
                                                                gap={
                                                                    12
                                                                }
                                                                align="start"
                                                            >
                                                                <div
                                                                    style={{
                                                                        width: 30,
                                                                        height: 30,
                                                                        borderRadius:
                                                                            "50%",
                                                                        background:
                                                                            "#1677ff",
                                                                        color:
                                                                            "#fff",
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        justifyContent:
                                                                            "center",
                                                                        fontSize:
                                                                            12,
                                                                        fontWeight:
                                                                            700,
                                                                        flexShrink: 0,
                                                                    }}
                                                                >
                                                                    {
                                                                        item.number
                                                                    }
                                                                </div>

                                                                <div>
                                                                    <Text
                                                                        strong
                                                                    >
                                                                        {
                                                                            item.title
                                                                        }
                                                                    </Text>

                                                                    <div>
                                                                        <Text
                                                                            type="secondary"
                                                                            style={{
                                                                                fontSize:
                                                                                    12,
                                                                            }}
                                                                        >
                                                                            {
                                                                                item.text
                                                                            }
                                                                        </Text>
                                                                    </div>
                                                                </div>
                                                            </Flex>
                                                        )
                                                    )}
                                                </Space>
                                            </div>

                                            {/* IMAGE PLACEHOLDER */}
                                            <div
                                                style={{
                                                    marginTop: 18,
                                                    minHeight: 180,
                                                    borderRadius: 18,
                                                    border:
                                                        "1px dashed #adc6ff",
                                                    background:
                                                        "#f8fbff",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    textAlign:
                                                        "center",
                                                    padding: 20,
                                                }}
                                            >
                                                <div>
                                                    <MobileOutlined
                                                        style={{
                                                            fontSize: 32,
                                                            color:
                                                                "#1677ff",
                                                        }}
                                                    />

                                                    <div
                                                        style={{
                                                            marginTop: 8,
                                                        }}
                                                    >
                                                        <Text strong>
                                                            iPhone visual
                                                            guide
                                                        </Text>
                                                    </div>

                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            fontSize: 11,
                                                        }}
                                                    >
                                                        Safari → Share →
                                                        Add to Home Screen
                                                        → Allow
                                                    </Text>
                                                </div>
                                            </div>

                                            <Alert
                                                style={{
                                                    marginTop: 16,
                                                    borderRadius: 14,
                                                }}
                                                type="info"
                                                showIcon
                                                title="Important"
                                                description="On iPhone, notifications require Weekly Tennis to be launched from your Home Screen."
                                            />
                                        </div>
                                    ),
                                },
                                {
                                    key: "android",
                                    label: (
                                        <span>
                                            <AndroidOutlined />
                                            {" "}Android
                                        </span>
                                    ),
                                    children: (
                                        <div>
                                            <div
                                                style={{
                                                    padding: 16,
                                                    borderRadius: 16,
                                                    background:
                                                        "#f6ffed",
                                                    border:
                                                        "1px solid #d9f7be",
                                                }}
                                            >
                                                <Space
                                                    direction="vertical"
                                                    size={14}
                                                    style={{
                                                        width: "100%",
                                                    }}
                                                >
                                                    {[
                                                        {
                                                            number: 1,
                                                            title:
                                                                "Open Weekly Tennis in Chrome",
                                                            text:
                                                                "Visit Weekly Tennis using Google Chrome.",
                                                        },
                                                        {
                                                            number: 2,
                                                            title:
                                                                "Tap Allow",
                                                            text:
                                                                "When Chrome asks to show notifications, tap Allow.",
                                                        },
                                                    ].map(
                                                        (item) => (
                                                            <Flex
                                                                key={
                                                                    item.number
                                                                }
                                                                gap={
                                                                    12
                                                                }
                                                                align="start"
                                                            >
                                                                <div
                                                                    style={{
                                                                        width: 30,
                                                                        height: 30,
                                                                        borderRadius:
                                                                            "50%",
                                                                        background:
                                                                            "#52c41a",
                                                                        color:
                                                                            "#fff",
                                                                        display:
                                                                            "flex",
                                                                        alignItems:
                                                                            "center",
                                                                        justifyContent:
                                                                            "center",
                                                                        fontSize:
                                                                            12,
                                                                        fontWeight:
                                                                            700,
                                                                        flexShrink: 0,
                                                                    }}
                                                                >
                                                                    {
                                                                        item.number
                                                                    }
                                                                </div>

                                                                <div>
                                                                    <Text
                                                                        strong
                                                                    >
                                                                        {
                                                                            item.title
                                                                        }
                                                                    </Text>

                                                                    <div>
                                                                        <Text
                                                                            type="secondary"
                                                                            style={{
                                                                                fontSize:
                                                                                    12,
                                                                            }}
                                                                        >
                                                                            {
                                                                                item.text
                                                                            }
                                                                        </Text>
                                                                    </div>
                                                                </div>
                                                            </Flex>
                                                        )
                                                    )}
                                                </Space>
                                            </div>

                                            <div
                                                style={{
                                                    marginTop: 18,
                                                    minHeight: 180,
                                                    borderRadius: 18,
                                                    border:
                                                        "1px dashed #b7eb8f",
                                                    background:
                                                        "#fafff7",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "center",
                                                    textAlign:
                                                        "center",
                                                    padding: 20,
                                                }}
                                            >
                                                <div>
                                                    <AndroidOutlined
                                                        style={{
                                                            fontSize: 32,
                                                            color:
                                                                "#52c41a",
                                                        }}
                                                    />

                                                    <div
                                                        style={{
                                                            marginTop: 8,
                                                        }}
                                                    >
                                                        <Text strong>
                                                            Android visual
                                                            guide
                                                        </Text>
                                                    </div>

                                                    <Text
                                                        type="secondary"
                                                        style={{
                                                            fontSize: 11,
                                                        }}
                                                    >
                                                        Chrome → Allow
                                                        notifications
                                                    </Text>
                                                </div>
                                            </div>
                                        </div>
                                    ),
                                },
                            ]}
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
                                <BellOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            You're all set!
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Once notifications are enabled, Weekly Tennis can
                            keep you informed about important match activity.
                        </Paragraph>

                        <div
                            style={{
                                marginTop: 25,
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, 1fr)",
                                gap: 10,
                            }}
                        >
                            {[
                                {
                                    icon: <TrophyOutlined />,
                                    title: "New match",
                                    text:
                                        "A new match is available.",
                                    color: "#1677ff",
                                    background: "#e6f4ff",
                                },
                                {
                                    icon: <UserAddOutlined />,
                                    title: "Player joined",
                                    text:
                                        "Someone joined your match.",
                                    color: "#722ed1",
                                    background: "#f9f0ff",
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    style={{
                                        padding: 16,
                                        borderRadius: 16,
                                        background: "#fafafa",
                                        border:
                                            "1px solid #f0f0f0",
                                        textAlign: "center",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 46,
                                            height: 46,
                                            borderRadius: 13,
                                            background:
                                                item.background,
                                            color: item.color,
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            fontSize: 20,
                                            margin:
                                                "0 auto 10px",
                                        }}
                                    >
                                        {item.icon}
                                    </div>

                                    <Text strong>
                                        {item.title}
                                    </Text>

                                    <div
                                        style={{
                                            marginTop: 3,
                                        }}
                                    >
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 11.5,
                                            }}
                                        >
                                            {item.text}
                                        </Text>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <Alert
                            style={{
                                marginTop: 20,
                                borderRadius: 14,
                            }}
                            type="success"
                            showIcon
                            icon={<CheckCircleFilled />}
                            title="Notifications help you stay in the game"
                            description="You won't need to constantly refresh the app to know when something important happens."
                        />

                        <div
                            style={{
                                marginTop: 16,
                                padding: 15,
                                borderRadius: 14,
                                background: "#fafafa",
                                border: "1px solid #f0f0f0",
                            }}
                        >
                            <Space align="start" size={11}>
                                <SettingOutlined
                                    style={{
                                        color: "#8c8c8c",
                                        marginTop: 3,
                                    }}
                                />

                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 11.5,
                                        lineHeight: 1.5,
                                    }}
                                >
                                    You can manage notification permissions
                                    from your device settings if you ever
                                    want to change them.
                                </Text>
                            </Space>
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
                    <BellOutlined />
                    NOTIFICATION GUIDE
                </div>

                <Title
                    level={3}
                    style={{
                        margin: 0,
                        fontSize: 25,
                        letterSpacing: "-.4px",
                    }}
                >
                    Stay connected
                </Title>

                <Text
                    type="secondary"
                    style={{
                        display: "block",
                        marginTop: 7,
                        fontSize: 13.5,
                    }}
                >
                    Learn how to enable notifications on your device.
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

export default HelpNotifications;