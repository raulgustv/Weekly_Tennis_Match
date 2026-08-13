import {
    CheckCircleOutlined,
    EuroOutlined,
    ExclamationCircleOutlined,
    WalletOutlined,
} from "@ant-design/icons";
import {
    Alert,
    Card,
    Divider,
    Flex,
    Space,
    Tag,
    Typography,
} from "antd";

const { Title, Text, Paragraph } = Typography;

const HelpArticleRefunds = () => {
    return (
        <article
            style={{
                maxWidth: 680,
                margin: "0 auto",
            }}
        >
            {/* INTRO */}
            <div style={{ marginBottom: 32 }}>
                <Text
                    type="secondary"
                    style={{
                        fontSize: 13,
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: ".5px",
                    }}
                >
                    Wallet & Payments
                </Text>

                <Title
                    level={3}
                    style={{
                        marginTop: 6,
                        marginBottom: 10,
                    }}
                >
                    Refunds
                </Title>

                <Paragraph
                    type="secondary"
                    style={{
                        fontSize: 15,
                        lineHeight: 1.7,
                        marginBottom: 0,
                    }}
                >
                    We want your balance and match payments to be as clear and
                    accurate as possible. If you are owed money, need a payment
                    adjusted, or want to recover your remaining Wallet balance,
                    an administrator can help you coordinate it.
                </Paragraph>
            </div>

            {/* WALLET BALANCE */}
            <Card
                style={{
                    borderRadius: 16,
                    marginBottom: 32,
                }}
                styles={{
                    body: {
                        padding: 18,
                    },
                }}
            >
                <Flex
                    align="center"
                    justify="space-between"
                    gap={16}
                >
                    <Flex align="center" gap={12}>
                        <div
                            style={{
                                width: 44,
                                height: 44,
                                borderRadius: 12,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#f0f7ff",
                                color: "#1677ff",
                                fontSize: 21,
                            }}
                        >
                            <WalletOutlined />
                        </div>

                        <div>
                            <Text
                                strong
                                style={{
                                    fontSize: 16,
                                }}
                            >
                                Your Wallet balance
                            </Text>

                            <div style={{ marginTop: 3 }}>
                                <Text type="secondary">
                                    Available credit for future matches
                                </Text>
                            </div>
                        </div>
                    </Flex>

                    <Text
                        strong
                        style={{
                            fontSize: 18,
                        }}
                    >
                        €20.00
                    </Text>
                </Flex>
            </Card>

            {/* REQUESTING MONEY BACK */}
            <section style={{ marginBottom: 32 }}>
                <Title level={4}>
                    Want your money back?
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If you would like to receive money back from your Wallet,
                    simply contact an administrator. We will coordinate the
                    refund with you and make sure the amount being returned is
                    correct.
                </Paragraph>

                <Alert
                    type="info"
                    showIcon
                    title="Contact an administrator"
                    description="Refunds are handled manually so we can verify the balance and coordinate the payment with you."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>

            {/* MATCH PRICE ADJUSTMENTS */}
            <section style={{ marginBottom: 32 }}>
                <Title level={4}>
                    Match price adjustments
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    Match prices can occasionally change depending on the
                    actual cost of the courts used. If you paid from your
                    Wallet and the final cost of the match is different from
                    the amount originally charged, an administrator will
                    adjust your balance accordingly.
                </Paragraph>

                <Card
                    size="small"
                    style={{
                        borderRadius: 14,
                        background: "#fafafa",
                    }}
                >
                    <Space
                        orientation="vertical"
                        size={14}
                        style={{
                            width: "100%",
                        }}
                    >
                        <Flex
                            justify="space-between"
                            align="center"
                        >
                            <Flex align="center" gap={10}>
                                <EuroOutlined />
                                <Text>
                                    Final cost is higher
                                </Text>
                            </Flex>

                            <Tag color="orange">
                                Adjustment
                            </Tag>
                        </Flex>

                        <Divider
                            style={{
                                margin: 0,
                            }}
                        />

                        <Flex
                            justify="space-between"
                            align="center"
                        >
                            <Flex align="center" gap={10}>
                                <EuroOutlined />
                                <Text>
                                    Final cost is lower
                                </Text>
                            </Flex>

                            <Tag color="green">
                                Refund
                            </Tag>
                        </Flex>
                    </Space>
                </Card>

                <Paragraph
                    type="secondary"
                    style={{
                        marginTop: 14,
                        fontSize: 14,
                        lineHeight: 1.7,
                    }}
                >
                    For example, if you were charged €10.00 but the final
                    amount for your participation is €9.00, the €1.00
                    difference will be returned to your Wallet. If the final
                    amount is higher, the corresponding adjustment will be
                    applied.
                </Paragraph>
            </section>

            {/* ACCOUNT CLOSURE */}
            <section style={{ marginBottom: 32 }}>
                <Title level={4}>
                    Closing your account
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If you decide to stop using Weekly Tennis and close your
                    account while you still have funds in your Wallet, contact
                    an administrator. Your remaining balance can be returned to
                    you by coordinating the payment directly with the admin.
                </Paragraph>

                <Card
                    size="small"
                    style={{
                        borderRadius: 14,
                    }}
                >
                    <Flex align="flex-start" gap={12}>
                        <CheckCircleOutlined
                            style={{
                                fontSize: 20,
                                color: "#52c41a",
                                marginTop: 2,
                            }}
                        />

                        <div>
                            <Text strong>
                                Your remaining balance matters
                            </Text>

                            <Paragraph
                                type="secondary"
                                style={{
                                    marginTop: 4,
                                    marginBottom: 0,
                                    lineHeight: 1.6,
                                }}
                            >
                                If you have credit remaining when leaving the
                                platform, let an administrator know so the
                                balance can be reviewed and returned.
                            </Paragraph>
                        </div>
                    </Flex>
                </Card>
            </section>

            {/* SOMETHING WRONG */}
            <section>
                <Title level={4}>
                    Something doesn't look right?
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If you notice that a payment, Wallet balance, adjustment,
                    or refund doesn't look correct, don't hesitate to contact
                    an administrator. We have a system for managing and
                    reviewing funds, and we will check the transaction and
                    correct any mistake when necessary.
                </Paragraph>

                <Alert
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleOutlined />}
                    title="Please report payment issues"
                    description="If something seems incorrect, let an administrator know rather than making assumptions about your balance. We can review the relevant transaction and clarify what happened."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>
        </article>
    );
};

export default HelpArticleRefunds;