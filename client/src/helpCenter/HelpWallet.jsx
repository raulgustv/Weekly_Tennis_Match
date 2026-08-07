import { useState } from "react";
import {
    Card,
    Typography,
    Space,
    Steps,
    Tag,
    Button,
    Alert,
    Flex,
} from "antd";
import {
    WalletOutlined,
    DollarOutlined,
    CreditCardOutlined,
    ClockCircleOutlined,
    CheckCircleFilled,
    ArrowRightOutlined,
    HistoryOutlined,
    UserOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

const { Title, Text, Paragraph} = Typography;

const HelpWallet = ({onClose}) => {
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        {
            title: "Add funds",
            shortTitle: "Add funds",
            icon: <DollarOutlined />,
        },
        {
            title: "Choose payment",
            shortTitle: "Payment",
            icon: <CreditCardOutlined />,
        },
        {
            title: "Wait for approval",
            shortTitle: "Pending",
            icon: <ClockCircleOutlined />,
        },
        {
            title: "Use your balance",
            shortTitle: "Balance",
            icon: <WalletOutlined />,
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
                                    background: "#f6ffed",
                                    color: "#52c41a",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <WalletOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Add money to your wallet
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
                            Your wallet is used to pay for your Weekly Tennis
                            matches. <Link to='/wallet'>Add funds</Link> before joining a match if you
                            need to top up your balance.
                        </Paragraph>

                        <Card
                            size="small"
                            style={{
                                marginTop: 24,
                                borderRadius: 18,
                                background:
                                    "linear-gradient(135deg, #f6ffed, #fbfff8)",
                                border: "1px solid #d9f7be",
                            }}
                        >
                            <Flex
                                justify="space-between"
                                align="center"
                            >
                                <Space size={14}>
                                    <div
                                        style={{
                                            width: 46,
                                            height: 46,
                                            borderRadius: 14,
                                            background: "#fff",
                                            color: "#52c41a",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 21,
                                            boxShadow:
                                                "0 3px 10px rgba(0,0,0,.04)",
                                        }}
                                    >
                                        <WalletOutlined />
                                    </div>

                                    <div>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Wallet balance
                                        </Text>

                                        <div>
                                            <Text
                                                strong
                                                style={{
                                                    fontSize: 22,
                                                }}
                                            >
                                                €25.00
                                            </Text>
                                        </div>
                                    </div>
                                </Space>

                                <Button
                                    type="primary"
                                    icon={<DollarOutlined />}
                                    style={{
                                        borderRadius: 10,
                                        fontWeight: 600,
                                    }}
                                >
                                    Add funds
                                </Button>
                            </Flex>
                        </Card>

                        <div
                            style={{
                                marginTop: 18,
                                textAlign: "center",
                            }}
                        >
                            <Text
                                type="secondary"
                                style={{ fontSize: 12.5 }}
                            >
                                You can check your current balance at any
                                time from the Wallet section.
                            </Text>
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
                                    background: "#e6f4ff",
                                    color: "#1677ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <CreditCardOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Choose a payment method
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Select one of the payment methods available to
                            you and enter the amount you want to add.
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
                                    icon: <CreditCardOutlined />,
                                    title: "Card",
                                    text: "Pay using the available card payment option.",
                                    color: "#1677ff",
                                    background: "#e6f4ff",
                                },
                                {
                                    icon: <DollarOutlined />,
                                    title: "Cash",
                                    text: "Use cash when this option is available.",
                                    color: "#52c41a",
                                    background: "#f6ffed",
                                },
                                {
                                    icon: <UserOutlined />,
                                    title: "Other payment methods",
                                    text: "Follow the instructions shown for the selected method.",
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
                                        <Text strong>{item.title}</Text>

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
                            type="info"
                            showIcon
                            title="Follow the payment instructions"
                            description="After selecting your payment method, complete the required information before submitting your deposit."
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
                                <ClockCircleOutlined />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            Your deposit may be pending
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Some wallet deposits require admin approval
                            before the money becomes available in your
                            balance.
                        </Paragraph>

                        {/* Pending transaction */}
                        <Card
                            size="small"
                            style={{
                                marginTop: 24,
                                borderRadius: 18,
                                border: "1px solid #ffe7ba",
                                background:
                                    "linear-gradient(135deg, #fffaf0, #fff)",
                            }}
                        >
                            <Flex
                                justify="space-between"
                                align="center"
                            >
                                <Space size={13}>
                                    <div
                                        style={{
                                            width: 46,
                                            height: 46,
                                            borderRadius: 14,
                                            background: "#fff7e6",
                                            color: "#fa8c16",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: 21,
                                        }}
                                    >
                                        <ClockCircleOutlined />
                                    </div>

                                    <div>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Deposit
                                        </Text>

                                        <div>
                                            <Text
                                                strong
                                                style={{
                                                    fontSize: 18,
                                                }}
                                            >
                                                +€20.00
                                            </Text>
                                        </div>
                                    </div>
                                </Space>

                                <Tag
                                    color="orange"
                                    style={{
                                        borderRadius: 999,
                                        margin: 0,
                                        padding: "4px 10px",
                                    }}
                                >
                                    Pending
                                </Tag>
                            </Flex>
                        </Card>

                        <div
                            style={{
                                marginTop: 20,
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
                                        fontSize: 17,
                                    }}
                                />

                                <Text>
                                    Your deposit request has been submitted.
                                </Text>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <ClockCircleOutlined
                                    style={{
                                        color: "#fa8c16",
                                        fontSize: 17,
                                    }}
                                />

                                <Text>
                                    Wait for the deposit to be reviewed.
                                </Text>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                }}
                            >
                                <WalletOutlined
                                    style={{
                                        color: "#1677ff",
                                        fontSize: 17,
                                    }}
                                />

                                <Text>
                                    Once approved, the funds are added to your
                                    available balance.
                                </Text>
                            </div>
                        </div>

                        <Alert
                            style={{
                                marginTop: 20,
                                borderRadius: 14,
                            }}
                            type="warning"
                            showIcon
                            title="Don't submit the same deposit repeatedly"
                            description="If your deposit is already pending, give it some time to be reviewed instead of creating another request."
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
                                    background: "#f6ffed",
                                    color: "#52c41a",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontSize: 34,
                                }}
                            >
                                <CheckCircleFilled />
                            </div>
                        </div>

                        <Title
                            level={3}
                            style={{
                                textAlign: "center",
                                marginBottom: 8,
                            }}
                        >
                            You're ready to play
                        </Title>

                        <Paragraph
                            type="secondary"
                            style={{
                                textAlign: "center",
                                fontSize: 15,
                                lineHeight: 1.7,
                            }}
                        >
                            Once your funds are available, you can use your
                            wallet balance when paying for matches.
                        </Paragraph>

                        {/* Balance */}
                        <Card
                            size="small"
                            style={{
                                marginTop: 24,
                                borderRadius: 18,
                                background:
                                    "linear-gradient(135deg, #f6ffed, #ffffff)",
                                border: "1px solid #d9f7be",
                            }}
                        >
                            <div
                                style={{
                                    textAlign: "center",
                                }}
                            >
                                <Text
                                    type="secondary"
                                    style={{ fontSize: 12 }}
                                >
                                    Available balance
                                </Text>

                                <div
                                    style={{
                                        fontSize: 32,
                                        fontWeight: 700,
                                        marginTop: 4,
                                        color: "#389e0d",
                                    }}
                                >
                                    €45.00
                                </div>

                                <Tag
                                    color="green"
                                    icon={<CheckCircleFilled />}
                                    style={{
                                        marginTop: 7,
                                        borderRadius: 999,
                                    }}
                                >
                                    Available
                                </Tag>
                            </div>
                        </Card>

                        <div
                            style={{
                                marginTop: 20,
                                display: "flex",
                                flexDirection: "column",
                                gap: 10,
                            }}
                        >
                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 13,
                                    padding: "12px 14px",
                                    borderRadius: 13,
                                    background: "#fafafa",
                                }}
                            >
                                <WalletOutlined
                                    style={{
                                        color: "#52c41a",
                                        fontSize: 18,
                                    }}
                                />

                                <div>
                                    <Text strong>
                                        Use your wallet for matches
                                    </Text>

                                    <div>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Your available balance can be
                                            used when joining eligible
                                            matches.
                                        </Text>
                                    </div>
                                </div>
                            </div>

                            <div
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 13,
                                    padding: "12px 14px",
                                    borderRadius: 13,
                                    background: "#fafafa",
                                }}
                            >
                                <HistoryOutlined
                                    style={{
                                        color: "#1677ff",
                                        fontSize: 18,
                                    }}
                                />

                                <div>
                                    <Text strong>
                                        Keep track of your transactions
                                    </Text>

                                    <div>
                                        <Text
                                            type="secondary"
                                            style={{ fontSize: 12 }}
                                        >
                                            Review your deposits and wallet
                                            activity from your transactions.
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
                            type="success"
                            showIcon
                            title="Your wallet is ready"
                            description="Keep enough balance available before joining matches you want to play."
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
                        color: "#52c41a",
                        fontSize: 11,
                        fontWeight: 700,
                        letterSpacing: ".4px",
                        marginBottom: 12,
                    }}
                >
                    <WalletOutlined />
                    WALLET GUIDE
                </div>

                <Title
                    level={3}
                    style={{
                        margin: 0,
                        fontSize: 25,
                        letterSpacing: "-.4px",
                    }}
                >
                    How your wallet works
                </Title>

                <Text
                    type="secondary"
                    style={{
                        display: "block",
                        marginTop: 7,
                        fontSize: 13.5,
                    }}
                >
                    Add funds, track your deposits, and use your balance to
                    play.
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

export default HelpWallet;