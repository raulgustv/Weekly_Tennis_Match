import {
    BellOutlined,
    CheckCircleFilled,
    ClockCircleOutlined,
    MailOutlined,
    TeamOutlined,
    UserDeleteOutlined,
    WalletOutlined,
    WarningOutlined,
} from "@ant-design/icons";
import {
    Alert,
    Card,
    Divider,
    Flex,
    Progress,
    Tag,
    Typography,
} from "antd";

const { Title, Text, Paragraph } = Typography;

const HelpArticleBackup = () => {
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
                    Backup players
                </Title>

                <Paragraph
                    type="secondary"
                    style={{
                        fontSize: 15,
                        lineHeight: 1.7,
                        marginBottom: 0,
                    }}
                >
                    When a match is already full, you can still join the
                    backup list in case a player leaves. Backup players are
                    next in line to take an available spot.
                </Paragraph>
            </div>

            {/* BACKUP PREVIEW */}
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
                            Match availability
                        </span>

                        <Tag color="orange">
                            Backup available
                        </Tag>
                    </Flex>
                }
            >
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

                    <Tag color="red">
                        <TeamOutlined /> Full
                    </Tag>
                </Flex>

                {/* PLAYER AVAILABILITY */}
                <Flex
                    justify="space-between"
                    align="center"
                    style={{
                        marginBottom: 8,
                    }}
                >
                    <Text type="secondary">
                        Players
                    </Text>

                    <Text strong>
                        4 / 4
                    </Text>
                </Flex>

                <Progress
                    percent={100}
                    showInfo={false}
                    size="small"
                />

                <Divider
                    style={{
                        margin: "18px 0",
                    }}
                />

                {/* BACKUP SPOTS */}
                <Flex
                    justify="space-between"
                    align="center"
                    style={{
                        marginBottom: 8,
                    }}
                >
                    <Flex align="center" gap={8}>
                        <ClockCircleOutlined
                            style={{
                                color: "#1677ff",
                            }}
                        />

                        <Text>
                            Backup spots
                        </Text>
                    </Flex>

                    <Text strong>
                        2 / 4
                    </Text>
                </Flex>

                <Progress
                    percent={50}
                    showInfo={false}
                    size="small"
                />

                <div
                    style={{
                        marginTop: 18,
                        padding: "12px 14px",
                        borderRadius: 10,
                        background: "#fff7e6",
                        border: "1px solid #ffe7ba",
                    }}
                >
                    <Flex align="center" gap={10}>
                        <BellOutlined
                            style={{
                                color: "#fa8c16",
                                fontSize: 18,
                            }}
                        />

                        <Text>
                            You can join as a backup
                        </Text>
                    </Flex>
                </div>
            </Card>

            {/* WHAT IS A BACKUP */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    What does being a backup mean?
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    A backup player is someone who is ready to play if a
                    regular player leaves the match. The backup list only
                    becomes available once all regular player spots have
                    been filled.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 0,
                    }}
                >
                    There are only <Text strong>four backup spots</Text> for
                    each match, so the backup list is limited.
                </Paragraph>
            </section>

            {/* PAYMENT */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Payment is required
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    When joining as a backup, you must select a payment
                    method just like a regular player.
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
                        <WalletOutlined
                            style={{
                                fontSize: 20,
                                color: "#1677ff",
                                marginTop: 2,
                            }}
                        />

                        <div>
                            <Text strong>
                                Paying with your wallet
                            </Text>

                            <Paragraph
                                type="secondary"
                                style={{
                                    marginTop: 4,
                                    marginBottom: 0,
                                    lineHeight: 1.6,
                                }}
                            >
                                If you choose your wallet, the match amount
                                will be held from your balance while you are
                                a backup. If you are not promoted to a
                                regular player, the amount will be fully
                                refunded to your wallet.
                            </Paragraph>
                        </div>
                    </Flex>
                </Card>
            </section>

            {/* AVAILABILITY */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Being a backup means being available
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    When you join the backup list, you are responsible for
                    being available to play if a spot opens up. Joining as a
                    backup means you should be prepared to play the match if
                    you are promoted.
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
                        <CheckCircleFilled
                            style={{
                                fontSize: 20,
                                color: "#52c41a",
                                marginTop: 2,
                            }}
                        />

                        <div>
                            <Text strong>
                                Keep your availability up to date
                            </Text>

                            <Paragraph
                                type="secondary"
                                style={{
                                    marginTop: 4,
                                    marginBottom: 0,
                                    lineHeight: 1.6,
                                }}
                            >
                                If you already know that you can no longer
                                play, please leave the backup list as soon
                                as possible. This gives another player the
                                opportunity to be available instead.
                            </Paragraph>
                        </div>
                    </Flex>
                </Card>
            </section>

            {/* PROMOTION */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    When you are promoted to a player
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If a regular player leaves the match, the next eligible
                    backup player will be automatically promoted to a regular
                    player.
                </Paragraph>

                <Alert
                    type="info"
                    showIcon
                    icon={<BellOutlined />}
                    title="Stay alert"
                    description="You will receive a notification when you are promoted. You will also receive a confirmation email letting you know that you have been promoted to a regular player."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>

            {/* NOTIFICATIONS */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Keep an eye on your notifications
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    Backup players should regularly check their
                    notifications and email. A spot can become available when
                    another player leaves, and the next backup player may be
                    promoted automatically.
                </Paragraph>

                <Alert
                    type="info"
                    showIcon
                    icon={<MailOutlined />}
                    title="You will receive an email"
                    description="When you are promoted to a regular player, we will send you a confirmation email so you know that your place in the match is confirmed."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>

            {/* LEAVE BACKUP */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Can't be a backup anymore?
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If your plans change and you are no longer available to
                    play, please remove yourself from the backup list as soon
                    as possible.
                </Paragraph>

                <Card
                    size="small"
                    style={{
                        borderRadius: 14,
                        background: "#fff2f0",
                        border: "1px solid #ffccc7",
                    }}
                >
                    <Flex
                        align="flex-start"
                        gap={12}
                    >
                        <UserDeleteOutlined
                            style={{
                                fontSize: 20,
                                color: "#ff4d4f",
                                marginTop: 2,
                            }}
                        />

                        <div>
                            <Text strong>
                                Please remove yourself
                            </Text>

                            <Paragraph
                                type="secondary"
                                style={{
                                    marginTop: 4,
                                    marginBottom: 0,
                                    lineHeight: 1.6,
                                }}
                            >
                                Being a backup comes with the responsibility
                                of staying available. If you know you cannot
                                play anymore, leave the backup list yourself
                                so another player can take your place in the
                                queue.
                            </Paragraph>
                        </div>
                    </Flex>
                </Card>
            </section>

            {/* NO GUARANTEE */}
            <section>
                <Title level={4}>
                    Being a backup does not guarantee a match
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    Joining the backup list means that you are available if a
                    place opens up, but it does not guarantee that you will
                    get to play. If nobody leaves the match, the regular
                    players keep their places.
                </Paragraph>

                <Alert
                    type="warning"
                    showIcon
                    icon={<WarningOutlined />}
                    title="Backup = availability, not a guaranteed spot"
                    description="If you are not promoted to a regular player, you will not be charged for the match. Any amount held from your wallet will be fully refunded."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>
        </article>
    );
};

HelpArticleBackup.articleText = `
When a match is already full, you can still join the backup list in case
a player leaves. Backup players are next in line to take an available spot.

A backup player is someone who is ready to play if a regular player leaves
the match. The backup list only becomes available once all regular player
spots have been filled.

There are only four backup spots for each match, so the backup list is limited.

When joining as a backup, you must select a payment method just like a
regular player.

If you choose your wallet, the match amount will be held from your balance
while you are a backup. If you are not promoted to a regular player, the
amount will be fully refunded to your wallet.

When you join the backup list, you are responsible for being available to
play if a spot opens up. Joining as a backup means you should be prepared
to play the match if you are promoted.

If you already know that you can no longer play, please leave the backup
list as soon as possible. This gives another player the opportunity to be
available instead.

If a regular player leaves the match, the next eligible backup player will
be automatically promoted to a regular player.

You will receive a notification when you are promoted. You will also receive
a confirmation email letting you know that you have been promoted to a
regular player.

Backup players should regularly check their notifications and email. A spot
can become available when another player leaves, and the next backup player
may be promoted automatically.

If your plans change and you are no longer available to play, please remove
yourself from the backup list as soon as possible.

Being a backup comes with the responsibility of staying available. If you
know you cannot play anymore, leave the backup list yourself so another
player can take your place in the queue.

Joining the backup list means that you are available if a place opens up,
but it does not guarantee that you will get to play.

If nobody leaves the match, the regular players keep their places.

If you are not promoted to a regular player, you will not be charged for
the match. Any amount held from your wallet will be fully refunded.
`;

export default HelpArticleBackup;