import {
    CalendarOutlined,
    ClockCircleOutlined,
    EnvironmentOutlined,
    MessageOutlined,
    WarningOutlined,
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

const HelpArticleTardiness = () => {
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
                    Being on time matters
                </Title>

                <Paragraph
                    type="secondary"
                    style={{
                        fontSize: 15,
                        lineHeight: 1.7,
                        marginBottom: 0,
                    }}
                >
                    Weekly Tennis is built around playing together, and
                    punctuality is an important part of making sure everyone
                    gets the most out of their match.
                </Paragraph>
            </div>

            {/* MATCH INFORMATION */}
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
            >
                <Flex
                    justify="space-between"
                    align="center"
                    style={{
                        marginBottom: 18,
                    }}
                >
                    <Text strong style={{ fontSize: 17 }}>
                        Saturday Tennis
                    </Text>

                    <Tag color="blue">
                        <ClockCircleOutlined /> 10:00
                    </Tag>
                </Flex>

                <Flex
                    vertical
                    gap={12}
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
                        <ClockCircleOutlined
                            style={{
                                color: "#1677ff",
                            }}
                        />

                        <Text>
                            Match starts at 10:00
                        </Text>
                    </Flex>
                </Flex>

                <Divider
                    style={{
                        margin: "18px 0",
                    }}
                />

                <Flex
                    align="flex-start"
                    gap={12}
                >
                    <MessageOutlined
                        style={{
                            fontSize: 20,
                            color: "#1677ff",
                            marginTop: 2,
                        }}
                    />

                    <div>
                        <Text strong>
                            Running late?
                        </Text>

                        <Paragraph
                            type="secondary"
                            style={{
                                marginTop: 4,
                                marginBottom: 0,
                                lineHeight: 1.6,
                            }}
                        >
                            Let the group know as soon as possible.
                        </Paragraph>
                    </div>
                </Flex>
            </Card>

            {/* WHY PUNCTUALITY MATTERS */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Why punctuality matters
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    When a player arrives late, the rest of the group may
                    have to wait, change the way they start the match, or lose
                    valuable playing time.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 0,
                    }}
                >
                    We understand that things happen. Public transport,
                    traffic, unexpected delays and other events can sometimes
                    make it difficult to arrive on time.
                </Paragraph>
            </section>

            {/* COMMUNICATION */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    If you're going to be late
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If something is going to delay you, please let everyone
                    know through the match's WhatsApp group as soon as you
                    can. This gives the other players the opportunity to
                    understand the situation and plan accordingly.
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
                        <MessageOutlined
                            style={{
                                fontSize: 20,
                                color: "#1677ff",
                                marginTop: 2,
                            }}
                        />

                        <div>
                            <Text strong>
                                Communication helps everyone
                            </Text>

                            <Paragraph
                                type="secondary"
                                style={{
                                    marginTop: 4,
                                    marginBottom: 0,
                                    lineHeight: 1.6,
                                }}
                            >
                                Even if you cannot control the delay, letting
                                the group know is an important part of being
                                respectful of everyone's time.
                            </Paragraph>
                        </div>
                    </Flex>
                </Card>
            </section>

            {/* REPEATED TARDINESS */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Repeated tardiness
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    Occasional delays are understandable. However, repeated
                    late arrivals can become a problem for the other players
                    and for the organization of matches.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 16,
                    }}
                >
                    When tardiness becomes a recurring pattern,
                    administrators may keep a record of it for a player.
                    Repeated tardiness may eventually result in a
                    suspension.
                </Paragraph>

                <Alert
                    type="warning"
                    showIcon
                    icon={<WarningOutlined />}
                    title="Repeated tardiness may have consequences"
                    description="Administrators may review repeated late arrivals and take appropriate action when the behavior becomes recurring."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>

            {/* PLAN AHEAD */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Plan ahead
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    Before heading to a match, make sure you have enough time
                    to get to the location. Weekly Tennis provides important
                    match information such as the date, starting time and
                    location so you can plan your journey in advance.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 0,
                    }}
                >
                    If there is any information you feel is missing that
                    would help you arrive earlier or find the location more
                    easily, please let an administrator know. We are always
                    happy to improve the information provided for each match.
                </Paragraph>
            </section>

            {/* FINAL */}
            <Alert
                type="info"
                showIcon
                title="A little communication goes a long way"
                description="We understand that delays happen. Being punctual when possible and communicating when they happen helps keep the experience fair and enjoyable for everyone."
                style={{
                    borderRadius: 12,
                }}
            />
        </article>
    );
};

export default HelpArticleTardiness;