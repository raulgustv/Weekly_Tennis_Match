import {
    CheckCircleOutlined,
    CreditCardOutlined,
    EuroOutlined,
    MailOutlined,
    SafetyOutlined,
    WalletOutlined,
} from "@ant-design/icons";
import {
    Alert,
    Card,
    Divider,
    Flex,
    Tag,
    Typography,
} from "antd";

const { Title, Text, Paragraph } = Typography;

const HelpArticleWallet = () => {
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
                    Wallet & Payments
                </Title>

                <Paragraph
                    type="secondary"
                    style={{
                        fontSize: 15,
                        lineHeight: 1.7,
                        marginBottom: 0,
                    }}
                >
                    Your Weekly Tennis Wallet allows you to keep credit in
                    your account and use it to pay for matches. You can add
                    funds in advance so your balance is ready whenever you
                    want to join a match.
                </Paragraph>
            </div>

            {/* WALLET PREVIEW */}
            <Card
                style={{
                    borderRadius: 16,
                    marginBottom: 32,
                }}
                styles={{
                    body: {
                        padding: 20,
                    },
                }}
            >
                <Flex
                    justify="space-between"
                    align="flex-start"
                    gap={16}
                >
                    <Flex align="center" gap={12}>
                        <div
                            style={{
                                width: 46,
                                height: 46,
                                borderRadius: 12,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#f0f7ff",
                                color: "#1677ff",
                                fontSize: 22,
                            }}
                        >
                            <WalletOutlined />
                        </div>

                        <div>
                            <Text
                                type="secondary"
                                style={{
                                    fontSize: 13,
                                }}
                            >
                                Available balance
                            </Text>

                            <div
                                style={{
                                    marginTop: 2,
                                }}
                            >
                                <Text
                                    strong
                                    style={{
                                        fontSize: 25,
                                    }}
                                >
                                    €20.00
                                </Text>
                            </div>
                        </div>
                    </Flex>

                    <Tag color="green">
                        <CheckCircleOutlined /> Available
                    </Tag>
                </Flex>

                <Divider
                    style={{
                        margin: "20px 0",
                    }}
                />

                <Flex
                    justify="space-between"
                    align="center"
                >
                    <Text type="secondary">
                        Example match payment
                    </Text>

                    <Text strong>
                        - €4.00
                    </Text>
                </Flex>

                <Flex
                    justify="space-between"
                    align="center"
                    style={{
                        marginTop: 10,
                    }}
                >
                    <Text type="secondary">
                        Balance after payment
                    </Text>

                    <Text strong>
                        €16.00
                    </Text>
                </Flex>
            </Card>

            {/* USING THE WALLET */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Using your Wallet
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    Your wallet balance can be used as credit to pay for
                    matches. When you join a paid match using your Wallet,
                    the corresponding amount is deducted from your available
                    balance.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 0,
                    }}
                >
                    For public courts, the agreed price is currently{" "}
                    <Text strong>€4 per player</Text>. The actual court cost
                    is €3.45, but the group has agreed to round it up to €4
                    to keep payments simple.
                </Paragraph>
            </section>

            {/* ADDING FUNDS */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Adding funds
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    You can request additional credit directly from your
                    Wallet. You can access it from{" "}
                    <Text strong>View Wallet</Text> in the left-hand menu.
                </Paragraph>

                <Card
                    size="small"
                    style={{
                        borderRadius: 14,
                    }}
                >
                    <Flex
                        align="flex-start"
                        gap={12}
                    >
                        <CreditCardOutlined
                            style={{
                                fontSize: 20,
                                color: "#1677ff",
                                marginTop: 2,
                            }}
                        />

                        <div>
                            <Text strong>
                                Add Funds
                            </Text>

                            <Paragraph
                                type="secondary"
                                style={{
                                    marginTop: 4,
                                    marginBottom: 0,
                                    lineHeight: 1.6,
                                }}
                            >
                                Enter the amount you would like to add and
                                select the payment method you intend to use.
                            </Paragraph>
                        </div>
                    </Flex>
                </Card>

                <Paragraph
                    type="secondary"
                    style={{
                        marginTop: 14,
                        fontSize: 14,
                        lineHeight: 1.7,
                    }}
                >
                    You can also access your Wallet directly here:
                </Paragraph>

                <Card
                    size="small"
                    style={{
                        borderRadius: 12,
                        background: "#fafafa",
                    }}
                >
                    <Flex
                        align="center"
                        gap={10}
                    >
                        <WalletOutlined
                            style={{
                                color: "#1677ff",
                            }}
                        />

                        <Text>
                            weekly-tennis-match.vercel.app/wallet
                        </Text>
                    </Flex>
                </Card>
            </section>

            {/* CURRENT PAYMENT METHOD */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Payment methods
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    We are working to support as many payment methods as
                    possible, including services such as Bizum, Revolut and
                    PayPal.
                </Paragraph>

                <Card
                    size="small"
                    style={{
                        borderRadius: 14,
                        marginBottom: 16,
                    }}
                >
                    <Flex
                        align="center"
                        justify="space-between"
                        gap={12}
                    >
                        <Flex align="center" gap={10}>
                            <EuroOutlined
                                style={{
                                    color: "#1677ff",
                                    fontSize: 20,
                                }}
                            />

                            <Text strong>
                                Cash
                            </Text>
                        </Flex>

                        <Tag color="green">
                            Currently available
                        </Tag>
                    </Flex>
                </Card>

                <Alert
                    type="info"
                    showIcon
                    title="For now, payments are handled with cash"
                    description="Please coordinate with an administrator to provide the cash and have the corresponding amount added to your Wallet."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>

            {/* REQUEST REVIEW */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Your fund request is reviewed
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    When you submit a request to add funds, an administrator
                    is notified by email. The request will then be reviewed
                    and either approved or denied.
                </Paragraph>

                <Card
                    size="small"
                    style={{
                        borderRadius: 14,
                    }}
                >
                    <Flex
                        vertical
                        gap={14}
                    >
                        <Flex
                            align="center"
                            justify="space-between"
                        >
                            <Flex align="center" gap={10}>
                                <MailOutlined
                                    style={{
                                        color: "#1677ff",
                                    }}
                                />

                                <Text>
                                    Fund request
                                </Text>
                            </Flex>

                            <Tag color="processing">
                                Under review
                            </Tag>
                        </Flex>

                        <Divider
                            style={{
                                margin: 0,
                            }}
                        />

                        <Flex
                            align="center"
                            justify="space-between"
                        >
                            <Text type="secondary">
                                Requested
                            </Text>

                            <Text strong>
                                €20.00
                            </Text>
                        </Flex>

                        <Flex
                            align="center"
                            justify="space-between"
                        >
                            <Text type="secondary">
                                Status
                            </Text>

                            <Text>
                                Waiting for admin review
                            </Text>
                        </Flex>
                    </Flex>
                </Card>

                <Paragraph
                    type="secondary"
                    style={{
                        marginTop: 14,
                        fontSize: 14,
                        lineHeight: 1.7,
                        marginBottom: 0,
                    }}
                >
                    Normally you may not see a note attached to the decision.
                    If additional information is necessary, an administrator
                    will communicate the reason for the approval or denial.
                </Paragraph>
            </section>

            {/* CASH COORDINATION */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Coordinate cash with an admin
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    Since cash is currently the only available payment
                    method, the easiest option is to contact an administrator
                    and coordinate when and where you can provide the money.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 0,
                    }}
                >
                    Once the payment has been reviewed, the corresponding
                    credit can be added to your Wallet and used for future
                    matches.
                </Paragraph>
            </section>

            {/* BALANCE PROBLEMS */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Something doesn't look right?
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If you believe your Wallet balance or a transaction is
                    incorrect, please contact an administrator and explain
                    the problem.
                </Paragraph>

                <Card
                    size="small"
                    style={{
                        borderRadius: 14,
                    }}
                >
                    <Flex
                        align="flex-start"
                        gap={12}
                    >
                        <SafetyOutlined
                            style={{
                                fontSize: 20,
                                color: "#1677ff",
                                marginTop: 2,
                            }}
                        />

                        <div>
                            <Text strong>
                                Your funds are tracked
                            </Text>

                            <Paragraph
                                type="secondary"
                                style={{
                                    marginTop: 4,
                                    marginBottom: 0,
                                    lineHeight: 1.6,
                                }}
                            >
                                Weekly Tennis has a system for managing and
                                reviewing wallet funds. If something appears
                                incorrect, let an administrator know so it
                                can be checked.
                            </Paragraph>
                        </div>
                    </Flex>
                </Card>
            </section>

            {/* FUTURE METHODS */}
            <Alert
                type="success"
                showIcon
                title="More payment options are coming"
                description="We are working to bring back alternative payment methods such as Bizum, Revolut and PayPal. For now, please coordinate cash payments with an administrator."
                style={{
                    borderRadius: 12,
                }}
            />
        </article>
    );
};

export default HelpArticleWallet;