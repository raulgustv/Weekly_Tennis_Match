import {
    CheckCircleOutlined,
    SafetyOutlined,
    StarOutlined,
    TeamOutlined,
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

const HelpArticleNTRP = () => {
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
                    Ranking
                </Text>

                <Title
                    level={3}
                    style={{
                        marginTop: 6,
                        marginBottom: 10,
                    }}
                >
                    Understanding NTRP
                </Title>

                <Paragraph
                    type="secondary"
                    style={{
                        fontSize: 15,
                        lineHeight: 1.7,
                        marginBottom: 0,
                    }}
                >
                    Weekly Tennis uses NTRP to help create matches that are
                    balanced, competitive and enjoyable for everyone. Your
                    rating is not simply a number — it helps us understand the
                    level of players in the community and build better
                    matches.
                </Paragraph>
            </div>

            {/* NTRP PREVIEW */}
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
                    justify="space-between"
                    align="flex-start"
                    gap={16}
                >
                    <div>
                        <Text
                            type="secondary"
                            style={{
                                fontSize: 13,
                            }}
                        >
                            Your current NTRP
                        </Text>

                        <div
                            style={{
                                marginTop: 4,
                            }}
                        >
                            <Text
                                strong
                                style={{
                                    fontSize: 30,
                                }}
                            >
                                3.50
                            </Text>
                        </div>
                    </div>

                    <Tag
                        color="blue"
                        icon={<StarOutlined />}
                    >
                        Player level
                    </Tag>
                </Flex>

                <Divider
                    style={{
                        margin: "18px 0",
                    }}
                />

                <Flex
                    justify="space-between"
                    align="center"
                    style={{
                        marginBottom: 8,
                    }}
                >
                    <Text type="secondary">
                        Rating range
                    </Text>

                    <Text strong>
                        1.0 — 5.0+
                    </Text>
                </Flex>

                <Progress
                    percent={62.5}
                    showInfo={false}
                    size="small"
                />

                <Paragraph
                    type="secondary"
                    style={{
                        marginTop: 12,
                        marginBottom: 0,
                        fontSize: 13,
                        lineHeight: 1.6,
                    }}
                >
                    Your NTRP may change over time as the system receives more
                    information about your level.
                </Paragraph>
            </Card>

            {/* WHAT IS NTRP */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    What is NTRP?
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    NTRP stands for <Text strong>National Tennis Rating
                    Program</Text>. It is a system used to describe a
                    player's tennis ability and experience.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 0,
                    }}
                >
                    Weekly Tennis uses NTRP as one of the tools for creating
                    balanced matches. The goal is not to determine who is
                    better than someone else, but to help put players of
                    compatible levels on the same court.
                </Paragraph>
            </section>

            {/* WHY IT MATTERS */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Why does NTRP matter?
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    Tennis is usually more enjoyable when the players on court
                    have reasonably compatible levels. A significant
                    difference in ability can make a match frustrating for
                    everyone involved.
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
                        <Flex align="center" gap={12}>
                            <TeamOutlined
                                style={{
                                    color: "#1677ff",
                                    fontSize: 20,
                                }}
                            />

                            <div>
                                <Text strong>
                                    Better matchmaking
                                </Text>

                                <div>
                                    <Text type="secondary">
                                        Helps create more balanced matches.
                                    </Text>
                                </div>
                            </div>
                        </Flex>

                        <Divider
                            style={{
                                margin: 0,
                            }}
                        />

                        <Flex align="center" gap={12}>
                            <CheckCircleOutlined
                                style={{
                                    color: "#52c41a",
                                    fontSize: 20,
                                }}
                            />

                            <div>
                                <Text strong>
                                    Better experience
                                </Text>

                                <div>
                                    <Text type="secondary">
                                        More competitive and enjoyable games
                                        for everyone.
                                    </Text>
                                </div>
                            </div>
                        </Flex>
                    </Space>
                </Card>
            </section>

            {/* LEVELING SYSTEM */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Your NTRP can be adjusted
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    Weekly Tennis has a level-adjustment system designed to
                    help keep player ratings as accurate as possible over
                    time.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 0,
                    }}
                >
                    One of the ways the system gathers information is through
                    player voting after a match. Players can choose to
                    participate and provide their perception of the level they
                    experienced on court.
                </Paragraph>
            </section>

            {/* VOTING */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Anonymous player voting
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    After a match, players may be given the opportunity to
                    vote about the level of the players they played with.
                    These votes are <Text strong>completely anonymous</Text>.
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
                                color: "#1677ff",
                                fontSize: 21,
                                marginTop: 2,
                            }}
                        />

                        <div>
                            <Text strong>
                                Anonymous means anonymous
                            </Text>

                            <Paragraph
                                type="secondary"
                                style={{
                                    marginTop: 4,
                                    marginBottom: 0,
                                    lineHeight: 1.6,
                                }}
                            >
                                Your individual vote is not shown to the
                                player you are evaluating. The purpose is to
                                allow honest feedback without creating
                                unnecessary pressure between players.
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
                        marginBottom: 0,
                    }}
                >
                    If you choose to vote, please try to be fair and
                    competitive. The system works best when players provide
                    honest feedback based on what they actually experienced on
                    court.
                </Paragraph>
            </section>

            {/* FEEDBACK */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Match feedback
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    You may also receive a feedback survey after a match.
                    Completing it is optional, but your feedback can help us
                    understand how the matches are working and where the
                    experience can be improved.
                </Paragraph>

                <Alert
                    type="info"
                    showIcon
                    title="Feedback is optional"
                    description="You can choose whether or not to complete the post-match feedback survey."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>

            {/* FAIRNESS */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Keep ratings fair
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    The rating system depends on the community. When voting,
                    think about the player's actual tennis level rather than
                    whether you personally won or lost the match.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 0,
                    }}
                >
                    The purpose is to improve matchmaking, not to reward or
                    punish players. Honest and consistent ratings help
                    everyone get better matches.
                </Paragraph>
            </section>

            {/* WRONG NTRP */}
            <section
                style={{
                    marginBottom: 32,
                }}
            >
                <Title level={4}>
                    Think your NTRP is wrong?
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If you believe your NTRP does not accurately represent
                    your current level, or if you made a mistake when setting
                    your initial rating, speak with an administrator.
                </Paragraph>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                        marginBottom: 0,
                    }}
                >
                    An admin can review your situation and help determine
                    whether your rating should be adjusted.
                </Paragraph>
            </section>

            {/* HELP */}
            <section>
                <Title level={4}>
                    New to NTRP?
                </Title>

                <Paragraph
                    style={{
                        fontSize: 15,
                        lineHeight: 1.75,
                    }}
                >
                    If you are not familiar with NTRP, don't worry. You can
                    find more information in the Weekly Tennis Help Center or
                    use reliable tennis resources online to learn more about
                    the rating system.
                </Paragraph>

                <Alert
                    type="success"
                    showIcon
                    title="It's all about the community"
                    description="NTRP is one of the tools we use to make matches fairer and more enjoyable. The goal is continuous improvement and a better experience for everyone playing Weekly Tennis."
                    style={{
                        borderRadius: 12,
                    }}
                />
            </section>
        </article>
    );
};

export default HelpArticleNTRP;