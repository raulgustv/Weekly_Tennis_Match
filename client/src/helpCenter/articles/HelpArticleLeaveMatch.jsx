import {
    CalendarOutlined,
    CheckCircleFilled,
    ClockCircleOutlined,
    ExclamationCircleFilled,
    EnvironmentOutlined,
    TeamOutlined,
    UserDeleteOutlined,
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


const HelpArticleLeaveMatch = () => {
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
                    Leaving a match
                </Title>

                <Paragraph
                    type="secondary"
                    style={{
                        fontSize: 15,
                        lineHeight: 1.7,
                        marginBottom: 0,
                    }}
                >
                    We understand that plans can change. If you need to leave
                    a match, please do it as early as possible so another
                    player has the opportunity to take your place.
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
                            Your match
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
                        <CheckCircleFilled /> Registered
                    </Tag>
                </Flex>

                {/* MATCH INFORMATION */}
                <Flex
                    vertical
                    gap={10}
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
                            Casa de Campo
                        </Text>
                    </Flex>

                    <Flex align="center" gap={10}>
                        <TeamOutlined
                            style={{
                                color: "#1677ff",
                            }}
                        />

                        <Text>
                            4 / 4 players
                        </Text>
                    </Flex>
                </Flex>

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
                        Match availability
                    </Text>

                    <Text strong>
                        Full
                    </Text>
                </Flex>

                <Progress
                    percent={100}
                    showInfo={false}
                    size="small"
                />

                {/* LEAVE BUTTON */}
                <div
                    style={{
                        marginTop: 18,
                        padding: "12px 16px",
                        borderRadius: 8,
                        background: "#fff1f0",
                        border: "1px solid #ffccc7",
                        color: "#ff4d4f",
                        textAlign: "center",
                        fontWeight: 600,
                    }}
                >
                    <UserDeleteOutlined
                        style={{
                            marginRight: 8,
                        }}
                    />

                    Leave Match
                </div>
            </Card>

            {/* LEAVING EARLY */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Leaving a match
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If you know that you cannot attend a match, please leave
                    your place as soon as possible. This gives another player
                    the opportunity to join and helps keep the match full.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 0,
                    }}
                >
                    You can leave the match directly using the{" "}
                    <Text strong>Leave Match</Text> button while the match is
                    still more than 24 hours away.
                </Paragraph>
            </section>

            {/* 24 HOURS */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    The 24-hour deadline
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    The <Text strong>Leave Match</Text> button is disabled once
                    there are less than 24 hours before the match starts.
                    At that point, players can no longer cancel their
                    registration themselves.
                </Paragraph>

                <Card
                    size="small"
                    style={{
                        borderRadius: 14,
                        background: "#fff7e6",
                        border: "1px solid #ffe7ba",
                    }}
                >
                    <Flex
                        align="flex-start"
                        gap={12}
                    >
                        <ClockCircleOutlined
                            style={{
                                fontSize: 20,
                                color: "#fa8c16",
                                marginTop: 2,
                            }}
                        />

                        <div>
                            <Text strong>
                                Less than 24 hours
                            </Text>

                            <Paragraph
                                type="secondary"
                                style={{
                                    marginTop: 4,
                                    marginBottom: 0,
                                    lineHeight: 1.6,
                                }}
                            >
                                The self-service cancellation option is no
                                longer available. If you have a valid reason
                                for leaving, you must contact an administrator.
                            </Paragraph>
                        </div>
                    </Flex>
                </Card>
            </section>

            {/* ADMIN CANCELLATION */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    What if you need to leave within 24 hours?
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If something unexpected happens and you can no longer
                    attend a match with less than 24 hours remaining, please
                    contact an administrator as soon as possible.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 16,
                    }}
                >
                    Only an administrator can manually remove you from the
                    match during this period. There must be a valid reason for
                    the late cancellation.
                </Paragraph>

                <Alert
                    type="warning"
                    showIcon
                    icon={<ExclamationCircleFilled />}
                    title="Late cancellations are taken seriously"
                    description="Repeated late cancellations or inappropriate use of the system may result in penalties or suspension."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>

            {/* PENALTIES */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Please be responsible
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    A late cancellation can affect the other players who have
                    planned their day around the match. For that reason,
                    repeated or unjustified cancellations may lead to
                    disciplinary action.
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
                        <ExclamationCircleFilled
                            style={{
                                fontSize: 20,
                                color: "#ff4d4f",
                                marginTop: 2,
                            }}
                        />

                        <div>
                            <Text strong>
                                Suspensions may apply
                            </Text>

                            <Paragraph
                                type="secondary"
                                style={{
                                    marginTop: 4,
                                    marginBottom: 0,
                                    lineHeight: 1.6,
                                }}
                            >
                                Administrators decide the appropriate
                                suspension period depending on the
                                circumstances and the player's history.
                            </Paragraph>
                        </div>
                    </Flex>
                </Card>
            </section>

            {/* ACCOUNT CONSEQUENCES */}
            <section>
                <Title level={4}>
                    Repeated offenses
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    Weekly Tennis is built around trust and respect between
                    players. Repeated offenses, serious misconduct or a
                    continued failure to respect the rules can result in
                    longer suspensions.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    In serious or repeated cases, your account may be closed
                    and you may no longer be able to participate in Weekly
                    Tennis matches.
                </Paragraph>

                <Alert
                    type="info"
                    showIcon
                    title="Plan ahead and communicate"
                    description="If you know you cannot play, leave the match as early as possible. If you are already within the 24-hour window, contact an administrator and explain the situation."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>
        </article>
    );
};

HelpArticleLeaveMatch.articleText = `
We understand that plans can change. If you need to leave a match,
please do it as early as possible so another player has the opportunity
to take your place.

If you know that you cannot attend a match, please leave your place
as soon as possible. This gives another player the opportunity to join
and helps keep the match full.

You can leave the match directly using the Leave Match button while
the match is still more than 24 hours away.

The Leave Match button is disabled once there are less than 24 hours
before the match starts. At that point, players can no longer cancel
their registration themselves.

If something unexpected happens and you can no longer attend a match
with less than 24 hours remaining, please contact an administrator
as soon as possible.

Only an administrator can manually remove you from the match during
this period. There must be a valid reason for the late cancellation.

A late cancellation can affect the other players who have planned
their day around the match. Repeated or unjustified cancellations
may lead to disciplinary action.

Administrators decide the appropriate suspension period depending
on the circumstances and the player's history.

Weekly Tennis is built around trust and respect between players.
Repeated offenses, serious misconduct or a continued failure to
respect the rules can result in longer suspensions.

In serious or repeated cases, your account may be closed and you may
no longer be able to participate in Weekly Tennis matches.

If you know you cannot play, leave the match as early as possible.
If you are already within the 24-hour window, contact an administrator
and explain the situation.
`;

export default HelpArticleLeaveMatch;