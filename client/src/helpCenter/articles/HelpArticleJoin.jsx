import {
    CalendarOutlined,
    CheckCircleFilled,
    EnvironmentOutlined,
    EuroOutlined,
    TeamOutlined,
    BellOutlined,
    UserAddOutlined,
} from "@ant-design/icons";
import {
    Alert,
    Card,
    Divider,
    Flex,
    Progress,
    Space,
    Tag,
    Typography,
} from "antd";

const { Title, Text, Paragraph } = Typography;

const HelpArticleJoin = () => {
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
                    Matches
                </Text>

                <Title
                    level={3}
                    style={{
                        marginTop: 6,
                        marginBottom: 10,
                    }}
                >
                    How to join a match
                </Title>

                <Paragraph
                    type="secondary"
                    style={{
                        fontSize: 15,
                        lineHeight: 1.7,
                        marginBottom: 0,
                    }}
                >
                    Browse the available matches and choose the one that
                    works best for you. Each match shows the information you
                    need before deciding to join.
                </Paragraph>
            </div>

            {/* MATCH CARD */}
            <Card
                style={{
                    borderRadius: 16,
                    marginBottom: 32,
                }}
                styles={{
                    body: {
                        padding: 16,
                    },
                }}
                title={
                    <Flex
                        justify="space-between"
                        align="center"
                        gap={12}
                    >
                        <span
                            style={{
                                fontWeight: 500,
                            }}
                        >
                            Upcoming match
                        </span>

                        <Text
                            style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: "#1677ff",
                                whiteSpace: "nowrap",
                            }}
                        >
                            2d 4h 32m
                        </Text>
                    </Flex>
                }
            >
                {/* MATCH HEADER */}
                <Flex
                    justify="space-between"
                    align="flex-start"
                    gap={12}
                    style={{
                        marginBottom: 18,
                    }}
                >
                    <div>
                        <Text
                            strong
                            style={{
                                fontSize: 17,
                            }}
                        >
                            Saturday Tennis
                        </Text>

                        <div
                            style={{
                                marginTop: 4,
                            }}
                        >
                            <Text type="secondary">
                                Doubles · 2 hours
                            </Text>
                        </div>
                    </div>

                    <Tag color="green">
                        <CheckCircleFilled />
                        {" "}Open
                    </Tag>
                </Flex>

                {/* MATCH INFORMATION */}
                <Space
                    orientation="vertical"
                    size={10}
                    style={{
                        width: "100%",
                    }}
                >
                    <Flex align="center" gap={10}>
                        <CalendarOutlined
                            style={{
                                color: "#1677ff",
                            }}
                        />

                        <Text>
                            Saturday · 10:00 – 12:00
                        </Text>
                    </Flex>

                    <Flex align="center" gap={10}>
                        <EnvironmentOutlined
                            style={{
                                color: "#1677ff",
                            }}
                        />

                        <Text>
                            Casa de campo
                        </Text>
                    </Flex>

                    <Flex align="center" gap={10}>
                        <TeamOutlined
                            style={{
                                color: "#1677ff",
                            }}
                        />

                        <Text>
                            3 / 4 players
                        </Text>
                    </Flex>

                    <Flex align="center" gap={10}>
                        <EuroOutlined
                            style={{
                                color: "#1677ff",
                            }}
                        />

                        <Text>
                            €10.00 / player
                        </Text>
                    </Flex>
                </Space>

                <Divider
                    style={{
                        margin: "18px 0",
                    }}
                />

                {/* AVAILABILITY */}
                <Flex
                    justify="space-between"
                    align="center"
                    style={{
                        marginBottom: 8,
                    }}
                >
                    <Text type="secondary">
                        Availability
                    </Text>

                    <Text strong>
                        1 spot remaining
                    </Text>
                </Flex>

                <Progress
                    percent={75}
                    showInfo={false}
                    size="small"
                />

                {/* NTRP */}
                <Flex
                    justify="space-between"
                    align="center"
                    style={{
                        marginTop: 18,
                        padding: "11px 14px",
                        borderRadius: 10,
                        background: "#f6faff",
                        border: "1px solid #dbeafe",
                    }}
                >
                    <Text type="secondary">
                        Average NTRP
                    </Text>

                    <Text strong>
                        3.50
                    </Text>
                </Flex>

                {/* JOIN BUTTON */}
                <div
                    style={{
                        marginTop: 18,
                        padding: "12px 16px",
                        borderRadius: 8,
                        background: "#1677ff",
                        color: "#fff",
                        textAlign: "center",
                        fontWeight: 600,
                    }}
                >
                    <UserAddOutlined
                        style={{
                            marginRight: 8,
                        }}
                    />

                    Join Match
                </div>
            </Card>

            {/* ARTICLE CONTENT */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Find the right match
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    Before joining, check the match details shown on the
                    card. You can see when the match starts, where it will
                    take place, the approximate price, how many players have
                    already joined and the average NTRP.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 0,
                    }}
                >
                    This gives you everything you need to decide whether the
                    match is a good fit for your schedule and playing level.
                </Paragraph>
            </section>

            {/* JOIN */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Join the match
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    When you find a match you want to play, click{" "}
                    <Text strong>Join Match</Text>. You will then be asked to
                    select an available payment method before your place is
                    confirmed.
                </Paragraph>
            </section>

            {/* PAYMENT */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Payment
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    The price shown on the match represents the approximate
                    cost of your place. Your Wallet is always available when
                    you have enough balance.
                </Paragraph>

                <Card
                    size="small"
                    style={{
                        borderRadius: 14,
                        background: "#fafafa",
                    }}
                >
                    <Flex
                        justify="space-between"
                        align="center"
                    >
                        <Text>
                            Approximate match price
                        </Text>

                        <Text strong>
                            €10.00
                        </Text>
                    </Flex>

                    <Divider
                        style={{
                            margin: "12px 0",
                        }}
                    />

                    <Flex
                        justify="space-between"
                        align="center"
                    >
                        <Text>
                            Wallet
                        </Text>

                        <Tag color="green">
                            Available
                        </Tag>
                    </Flex>
                </Card>

                <Alert
                    type="info"
                    showIcon
                    title="Payment methods may vary"
                    description="The payment methods available to you depend on how the match has been configured."
                    style={{
                        marginTop: 16,
                        borderRadius: 12,
                    }}
                />
            </section>

            {/* COURT SURFACES & PRICING */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Court surfaces and pricing
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    We try to keep the price as consistent as possible for
                    everyone playing in the same match. However, some matches
                    may use courts with different prices or surfaces, which
                    means the final cost may not be exactly the same for
                    every player.
                </Paragraph>

                <Card
                    size="small"
                    style={{
                        borderRadius: 14,
                        marginTop: 16,
                        marginBottom: 16,
                    }}
                >
                    <Text strong>
                        For example
                    </Text>

                    <Paragraph
                        type="secondary"
                        style={{
                            marginTop: 6,
                            marginBottom: 0,
                            lineHeight: 1.7,
                        }}
                    >
                        Juan plays the first hour on a clay court and the
                        second hour on a covered hard court. If those courts
                        have different prices, his first hour may cost less
                        than his second hour.
                    </Paragraph>
                </Card>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    When this happens, we will try to distribute the costs
                    and organize the courts as fairly as possible. Depending
                    on the courts used, some players may occasionally pay
                    slightly more or less than others.
                </Paragraph>

                <Alert
                    type="info"
                    showIcon
                    title="Don't want to play on a specific surface?"
                    description="The available court surfaces are shown in Match Details. If you do not want to play on a specific type of court, please let an administrator know before the match so we can take your preference into account whenever possible."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>

            {/* BACKUP */}
            <section>
                <Title level={4}>
                    What if the match is full?
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If all four regular player spots are already taken, you
                    can join the match as a{" "}
                    <Text strong>backup player</Text>.
                </Paragraph>

                <Card
                    size="small"
                    style={{
                        borderRadius: 14,
                        marginTop: 16,
                        marginBottom: 16,
                    }}
                >
                    <Flex
                        align="flex-start"
                        gap={12}
                    >
                        <BellOutlined
                            style={{
                                fontSize: 20,
                                color: "#1677ff",
                                marginTop: 2,
                            }}
                        />

                        <div>
                            <Text strong>
                                Only 4 backup spots
                            </Text>

                            <Paragraph
                                type="secondary"
                                style={{
                                    marginTop: 4,
                                    marginBottom: 0,
                                    lineHeight: 1.6,
                                }}
                            >
                                The backup list has a maximum of four
                                players.
                            </Paragraph>
                        </div>
                    </Flex>
                </Card>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If another player leaves the match, you will be notified
                    when a spot becomes available. Backup players are handled
                    in order, so joining the list early gives you a better
                    position in the queue.
                </Paragraph>

                <Alert
                    type="success"
                    showIcon
                    title="You'll know when a spot becomes available"
                    description="If you are next in the backup queue and a player leaves, Weekly Tennis will notify you so you can take the available spot."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>
        </article>
    );
};

export default HelpArticleJoin;