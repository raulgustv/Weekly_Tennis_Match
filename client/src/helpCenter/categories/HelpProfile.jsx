import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
    Card,
    Typography,
    Space,
    Steps,
    Button,
    Alert,
    Divider,
    Flex,
} from "antd";
import {
    UserOutlined,
    CameraOutlined,
    GlobalOutlined,
    LockOutlined,
    ArrowRightOutlined,
    CheckCircleFilled,
    InfoCircleOutlined,
    TeamOutlined,
    EditOutlined,
} from "@ant-design/icons";

const { Title, Text, Paragraph } = Typography;

const HelpProfile = ({onClose}) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Your profile",
            shortTitle: "Profile",
            icon: <UserOutlined />,
        },
        {
            title: "Profile picture",
            shortTitle: "Photo",
            icon: <CameraOutlined />,
        },
        {
            title: "Registration info",
            shortTitle: "Information",
            icon: <GlobalOutlined />,
        },
        {
            title: "What's coming",
            shortTitle: "Coming soon",
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
                                    background: "#f9f0ff",
                                    color: "#722ed1",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <UserOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Your profile, all in one place
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
                            <Link to='/profile'>Your profile</Link> is where you can see the information
                            associated with your Weekly Tennis account and
                            learn more about your player profile.
                        </Paragraph>

                        <div
                            style={{
                                marginTop: 26,
                                display: "grid",
                                gridTemplateColumns:
                                    "repeat(2, 1fr)",
                                gap: 10,
                            }}
                        >
                            {[
                                {
                                    icon: <UserOutlined />,
                                    title: "Personal information",
                                    text: "The information associated with your account.",
                                    color: "#722ed1",
                                    background: "#f9f0ff",
                                },
                                {
                                    icon: <GlobalOutlined />,
                                    title: "Country",
                                    text: "Your country of origin helps us understand our community.",
                                    color: "#1677ff",
                                    background: "#e6f4ff",
                                },
                                {
                                    icon: <TeamOutlined />,
                                    title: "Player information",
                                    text: "Information that helps us understand our tennis community.",
                                    color: "#13c2c2",
                                    background: "#e6fffb",
                                },
                                {
                                    icon: <CameraOutlined />,
                                    title: "Profile picture",
                                    text: "Add a photo to personalize your profile.",
                                    color: "#eb2f96",
                                    background: "#fff0f6",
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    style={{
                                        padding: 14,
                                        borderRadius: 15,
                                        background: "#fafafa",
                                        border: "1px solid #f0f0f0",
                                    }}
                                >
                                    <Space
                                        align="start"
                                        size={10}
                                    >
                                        <div
                                            style={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: 10,
                                                background:
                                                    item.background,
                                                color: item.color,
                                                display: "flex",
                                                alignItems:
                                                    "center",
                                                justifyContent:
                                                    "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            {item.icon}
                                        </div>

                                        <div>
                                            <Text strong>
                                                {item.title}
                                            </Text>

                                            <div
                                                style={{
                                                    marginTop: 2,
                                                }}
                                            >
                                                <Text
                                                    type="secondary"
                                                    style={{
                                                        fontSize: 11.5,
                                                        lineHeight: 1.4,
                                                    }}
                                                >
                                                    {item.text}
                                                </Text>
                                            </div>
                                        </div>
                                    </Space>
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
                            icon={<InfoCircleOutlined />}
                            title="Your profile reflects your account information"
                            description="Some information is currently read-only. We are working on giving you more control over your profile."
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
                                    background: "#fff0f6",
                                    color: "#eb2f96",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <CameraOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Add your profile picture
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            A profile picture is completely optional, but it
                            can make it easier for other players to recognize
                            you in the Weekly Tennis community.
                        </Paragraph>

                        <Card
                            size="small"
                            style={{
                                marginTop: 24,
                                borderRadius: 18,
                                background:
                                    "linear-gradient(135deg, #fff7fb, #ffffff)",
                                border: "1px solid #ffd6e7",
                            }}
                        >
                            <Flex
                                align="center"
                                gap={15}
                            >
                                <div
                                    style={{
                                        width: 62,
                                        height: 62,
                                        borderRadius: "50%",
                                        background: "#fff0f6",
                                        border: "2px dashed #ffadd2",
                                        color: "#eb2f96",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        fontSize: 25,
                                        flexShrink: 0,
                                    }}
                                >
                                    <CameraOutlined />
                                </div>

                                <div>
                                    <Text strong>
                                        Upload a photo from your Profile
                                    </Text>

                                    <div
                                        style={{
                                            marginTop: 3,
                                        }}
                                    >
                                        <Text
                                            type="secondary"
                                            style={{
                                                fontSize: 12,
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            Open your Profile and use the
                                            profile picture area to select and
                                            upload your image.
                                        </Text>
                                    </div>
                                </div>
                            </Flex>
                        </Card>

                        <div
                            style={{
                                marginTop: 18,
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                            }}
                        >
                            {[
                                {
                                    title: "It's optional",
                                    text: "You can use Weekly Tennis without uploading a profile picture.",
                                    icon: <CheckCircleFilled />,
                                    color: "#52c41a",
                                    background: "#f6ffed",
                                },
                                {
                                    title: "Make your profile yours",
                                    text: "Adding a picture helps put a face to the players you meet on court.",
                                    icon: <UserOutlined />,
                                    color: "#eb2f96",
                                    background: "#fff0f6",
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 12,
                                        padding: "13px 14px",
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
                                            background:
                                                item.background,
                                            color: item.color,
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
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
                                                    fontSize: 12,
                                                }}
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
                                    background: "#e6f4ff",
                                    color: "#1677ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <GlobalOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Your registration information
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            The information you provide when registering is
                            saved as part of your account and helps us build a
                            better picture of the Weekly Tennis community.
                        </Paragraph>

                        <Card
                            size="small"
                            style={{
                                marginTop: 24,
                                borderRadius: 18,
                                border: "1px solid #e6f4ff",
                                background:
                                    "linear-gradient(135deg, #f8fbff, #ffffff)",
                            }}
                        >
                            <Space
                                orientation="vertical"
                                size={16}
                                style={{
                                    width: "100%",
                                }}
                            >
                                <Flex
                                    align="center"
                                    gap={13}
                                >
                                    <div
                                        style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 13,
                                            background:
                                                "#e6f4ff",
                                            color: "#1677ff",
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            fontSize: 20,
                                        }}
                                    >
                                        <GlobalOutlined />
                                    </div>

                                    <div>
                                        <Text strong>
                                            Always select your country
                                        </Text>

                                        <div>
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 12,
                                                }}
                                            >
                                                Your country of origin is an
                                                important part of your
                                                registration.
                                            </Text>
                                        </div>
                                    </div>
                                </Flex>

                                <Divider
                                    style={{
                                        margin: 0,
                                    }}
                                />

                                <Text
                                    type="secondary"
                                    style={{
                                        fontSize: 12.5,
                                        lineHeight: 1.6,
                                    }}
                                >
                                    Knowing where our players come from helps
                                    us understand our registrations, learn
                                    more about the people who make up the
                                    community, and see how diverse our tennis
                                    group is.
                                </Text>
                            </Space>
                        </Card>

                        <div
                            style={{
                                marginTop: 18,
                                padding: 17,
                                borderRadius: 16,
                                background: "#f6ffed",
                                border: "1px solid #d9f7be",
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
                                        background: "#52c41a",
                                        color: "#fff",
                                        display: "flex",
                                        alignItems:
                                            "center",
                                        justifyContent:
                                            "center",
                                        flexShrink: 0,
                                        fontSize: 18,
                                    }}
                                >
                                    <TeamOutlined />
                                </div>

                                <div>
                                    <Text strong>
                                        We're more than just matches
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
                                            Weekly Tennis is a social tennis
                                            group. Your information helps us
                                            understand the players who are
                                            part of our community.
                                        </Text>
                                    </div>
                                </div>
                            </Space>
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
                                    background: "#fff7e6",
                                    color: "#fa8c16",
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
                            More profile controls are coming
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            We're continuing to improve the Profile section
                            and will gradually make more of your information
                            editable.
                        </Paragraph>

                        <Alert
                            style={{
                                marginTop: 24,
                                borderRadius: 14,
                            }}
                            type="warning"
                            showIcon
                            icon={<LockOutlined />}
                            title="Password changes are not available yet"
                            description="For now, you cannot change your password directly from your Profile. We're working on this feature and hope to make it available soon."
                        />

                        <div
                            style={{
                                marginTop: 18,
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                            }}
                        >
                            <div
                                style={{
                                    padding: 16,
                                    borderRadius: 15,
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
                                            borderRadius: 11,
                                            background:
                                                "#fff7e6",
                                            color: "#fa8c16",
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <LockOutlined />
                                    </div>

                                    <div>
                                        <Text strong>
                                            Password management
                                        </Text>

                                        <div
                                            style={{
                                                marginTop: 3,
                                            }}
                                        >
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 12,
                                                }}
                                            >
                                                This option is currently
                                                unavailable, but it is on our
                                                list of improvements.
                                            </Text>
                                        </div>
                                    </div>
                                </Space>
                            </div>

                            <div
                                style={{
                                    padding: 16,
                                    borderRadius: 15,
                                    background: "#f9f0ff",
                                    border: "1px solid #efdbff",
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
                                            borderRadius: 11,
                                            background:
                                                "#722ed1",
                                            color: "#fff",
                                            display: "flex",
                                            alignItems:
                                                "center",
                                            justifyContent:
                                                "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <EditOutlined />
                                    </div>

                                    <div>
                                        <Text strong>
                                            A more editable profile
                                        </Text>

                                        <div
                                            style={{
                                                marginTop: 3,
                                            }}
                                        >
                                            <Text
                                                type="secondary"
                                                style={{
                                                    fontSize: 12,
                                                    lineHeight: 1.5,
                                                }}
                                            >
                                                We're working toward making
                                                this section more flexible,
                                                so you'll eventually have more
                                                control over your information.
                                            </Text>
                                        </div>
                                    </div>
                                </Space>
                            </div>
                        </div>

                        <Alert
                            style={{
                                marginTop: 18,
                                borderRadius: 14,
                            }}
                            type="info"
                            showIcon
                            title="We're building it with you"
                            description="Weekly Tennis is growing together with its players. More profile and personalization features will be added over time."
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
                    <UserOutlined />
                    PROFILE GUIDE
                </div>

                <Title
                    level={3}
                    style={{
                        margin: 0,
                        fontSize: 25,
                        letterSpacing: "-.4px",
                    }}
                >
                    Understanding your profile
                </Title>

                <Text
                    type="secondary"
                    style={{
                        display: "block",
                        marginTop: 7,
                        fontSize: 13.5,
                    }}
                >
                    Learn what your profile contains and what's coming next.
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

export default HelpProfile;