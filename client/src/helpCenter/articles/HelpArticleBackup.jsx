import {
    BellOutlined,
    CheckCircleFilled,
    ClockCircleOutlined,
    MailOutlined,
    TeamOutlined,
    UserDeleteOutlined,
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
                    Sometimes a match is already full, but you may still want
                    to be available in case a player cannot make it. That's
                    what the backup list is for.
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
                    Being a backup means that you are available to play if a
                    regular player leaves the match. You can choose to join
                    the backup list from the beginning, even while there are
                    still regular places available.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 0,
                    }}
                >
                    There are only <Text strong>four backup spots</Text> for
                    each match, so the list is limited.
                </Paragraph>
            </section>

            {/* AVAILABILITY */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Backup means being available
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    When you join the backup list, we assume that you are
                    genuinely available to play if a place opens up.
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
                                Make plans accordingly
                            </Text>

                            <Paragraph
                                type="secondary"
                                style={{
                                    marginTop: 4,
                                    marginBottom: 0,
                                    lineHeight: 1.6,
                                }}
                            >
                                We understand that players may make plans
                                around being a regular player or a backup.
                                That's why keeping your availability
                                up to date is important.
                            </Paragraph>
                        </div>
                    </Flex>
                </Card>
            </section>

            {/* NOTIFICATION */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    When a place becomes available
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If a regular player leaves the match, the next eligible
                    backup player will receive an invitation by email to join
                    the match.
                </Paragraph>

                <Alert
                    type="info"
                    showIcon
                    icon={<MailOutlined />}
                    title="Watch your email"
                    description="If you are next in the backup queue and a place becomes available, you will receive an email invitation to join the match."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>

            {/* ACCEPT / REJECT */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    If you no longer want the spot
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If you receive an invitation and do not take the available
                    spot or reject the invitation, you will automatically be
                    removed from the backup list for that match.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 0,
                    }}
                >
                    This allows the opportunity to move to the next available
                    backup player.
                </Paragraph>
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
                                Admins will not remove players from the
                                backup list. If you know you cannot play,
                                please leave the list yourself so another
                                player can have the opportunity.
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
                    description="You are always welcome to join the drinks and other after-game activities, even if you don't get a place on the court. However, we cannot guarantee that a backup player will be able to play."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>
        </article>
    );
};

HelpArticleBackup.articleText = `
Being a backup means that you are available to play if a regular player
leaves the match. You can choose to join the backup list from the beginning,
even while there are still regular places available.

There are only four backup spots for each match, so the list is limited.

When you join the backup list, we assume that you are genuinely available
to play if a place opens up.

We understand that players may make plans around being a regular player
or a backup. That's why keeping your availability up to date is important.

If a regular player leaves the match, the next eligible backup player
will receive an invitation by email to join the match.

If you receive an invitation and do not take the available spot or reject
the invitation, you will automatically be removed from the backup list
for that match.

If your plans change and you are no longer available to play, please
remove yourself from the backup list as soon as possible.

Admins will not remove players from the backup list. If you know you
cannot play, please leave the list yourself so another player can have
the opportunity.

Joining the backup list means that you are available if a place opens up,
but it does not guarantee that you will get to play.

You are always welcome to join the drinks and other after-game activities,
even if you don't get a place on the court. However, we cannot guarantee
that a backup player will be able to play.
`;

export default HelpArticleBackup;