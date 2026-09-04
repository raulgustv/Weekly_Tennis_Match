import { useMemo, useState } from "react";
import {
    BookOutlined,
    QuestionCircleOutlined,
    RightOutlined,
    SearchOutlined,
    ArrowLeftOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Card,
    Col,
    Drawer,
    Empty,
    Image,
    Input,
    Modal,
    Row,
    Space,
    Typography,
} from "antd";
import { categories } from "../../helpers/helpCategories";
import { articles } from "../../helpers/helpArticles";

const { Title, Paragraph, Text } = Typography;

const Help = () => {
    const [query, setQuery] = useState("");
    const [activeArticle, setActiveArticle] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);
    const navigate = useNavigate();

    const normalizedQuery = query.trim().toLowerCase();

    const filteredCategories = useMemo(() => {
        if (!normalizedQuery) return categories;

        return categories.filter(
            (category) =>
                category.title.toLowerCase().includes(normalizedQuery) ||
                category.description.toLowerCase().includes(normalizedQuery)
        );
    }, [normalizedQuery]);

    const filteredArticles = useMemo(() => {
        if (!normalizedQuery) return articles;

        return articles.filter((article) => {
            const text = (article.sections ?? [])
                .map(
                    (section) =>
                        `${section.title ?? ""} ${section.text ?? ""}`
                )
                .join(" ")
                .toLowerCase();

            return (
                (article.title ?? "")
                    .toLowerCase()
                    .includes(normalizedQuery) ||
                text.includes(normalizedQuery)
            );
        });
    }, [normalizedQuery]);


    const hasResults =
        filteredCategories.length > 0 || filteredArticles.length > 0;


    return (
        <div
            style={{
                width: "100%",
                maxWidth: 1500,
                margin: "0 auto",
                padding: "40px 32px",
            }}
        >
            <Button
                type="text"
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate(-1)}
                style={{
                    marginBottom: 16,
                    padding: 0,
                    fontWeight: 600,
                    fontSize: 16,
                }}
            >
                Back
            </Button>

            <Space
                orientation="vertical"
                align="center"
                style={{
                    width: "100%",
                    marginBottom: 48,
                }}
            >
                <QuestionCircleOutlined
                    style={{
                        fontSize: 64,
                        color: "#1677ff",
                    }}
                />

                <Title level={2} style={{ marginBottom: 0 }}>
                    Help center
                </Title>

                <Paragraph
                    type="secondary"
                    style={{
                        textAlign: "center",
                        fontSize: 16,
                        maxWidth: 600,
                    }}
                >
                    Learn how to use the Weekly Tennis app and find answers to
                    most common questions
                </Paragraph>

                <Input
                    size="large"
                    allowClear
                    prefix={<SearchOutlined />}
                    placeholder="Search articles..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    style={{
                        maxWidth: 600,
                    }}
                />
            </Space>

            {!hasResults && (
                <Empty
                    description={`No results found for "${query}"`}
                    style={{ margin: "60px 0" }}
                />
            )}

            {filteredCategories.length > 0 && (
                <>
                    <Title level={4}>Easy access</Title>

                    <Row gutter={[20, 20]}>
                        {filteredCategories.map((category) => (
                            <Col xs={24} sm={12} lg={8} key={category.key}>
                                <Card
                                    hoverable
                                    variant={false}
                                    onClick={() => setActiveCategory(category)}
                                    style={{
                                        borderRadius: 18,
                                        height: "100%",
                                        cursor: "pointer",
                                    }}
                                >
                                    <Space align="start" size={16}>
                                        <div
                                            style={{
                                                width: 58,
                                                height: 58,
                                                borderRadius: 14,
                                                display: "flex",
                                                justifyContent: "center",
                                                alignItems: "center",
                                                background: `${category.color}15`,
                                                color: category.color,
                                                fontSize: 28,
                                            }}
                                        >
                                            {category.icon}
                                        </div>

                                        <div>
                                            <Text
                                                strong
                                                style={{
                                                    fontSize: 17,
                                                }}
                                            >
                                                {category.title}
                                            </Text>

                                            <Paragraph
                                                type="secondary"
                                                style={{
                                                    marginTop: 6,
                                                    marginBottom: 0,
                                                }}
                                            >
                                                {category.description}
                                            </Paragraph>
                                        </div>
                                    </Space>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </>
            )}

            {filteredArticles.length > 0 && (
                <>
                    <Title
                        level={4}
                        style={{
                            marginTop: 50,
                        }}
                    >
                        Popular articles
                    </Title>

                    <Card
                        variant={false}
                        style={{
                            borderRadius: 18,
                        }}
                    >
                        {filteredArticles.map((item, index) => (
                            <div
                                key={item.id}
                                onClick={() => setActiveArticle(item)}
                                style={{
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "16px 0",
                                    borderBottom:
                                        index !== filteredArticles.length - 1
                                            ? "1px solid #f0f0f0"
                                            : "none",
                                }}
                            >
                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        minWidth: 0,
                                    }}
                                >
                                    <BookOutlined
                                        style={{
                                            color: "#1677ff",
                                            fontSize: 18,
                                            marginRight: 16,
                                            flexShrink: 0,
                                        }}
                                    />

                                    <div style={{ minWidth: 0 }}>
                                        <div
                                            style={{
                                                fontSize: 14,
                                                fontWeight: 500,
                                                marginBottom: 4,
                                            }}
                                        >
                                            {item.title}
                                        </div>

                                        <Text type="secondary">
                                            {item.readTime}
                                        </Text>
                                    </div>
                                </div>

                                <RightOutlined
                                    style={{
                                        color: "#bfbfbf",
                                        marginLeft: 16,
                                    }}
                                />
                            </div>
                        ))}
                    </Card>
                </>
            )}

            <Card
                variant={false}
                style={{
                    marginTop: 40,
                    borderRadius: 18,
                    textAlign: "center",
                }}
            >
                <Title level={4}>Still need help?</Title>

                <Paragraph type="secondary">
                    Missing an answer? Send us an email to <b>madridtenniscommunity@gmail.com</b>
                </Paragraph>
            </Card>

            {/* Category drawer: lists the articles that belong to a category */}
            <Drawer
                open={!!activeCategory}
                onClose={() => setActiveCategory(null)}
                title={activeCategory?.title}
                size={700}
            >
                {activeCategory?.content?.(() => setActiveCategory(null))}
            </Drawer>
            {/* Article modal: full reading view */}
            <Modal
                open={!!activeArticle}
                onCancel={() => setActiveArticle(null)}
                footer={null}
                width={800}
                title={activeArticle?.title}
            >
                <Paragraph type="secondary">
                    {activeArticle?.readTime}
                </Paragraph>

                {activeArticle?.component ? (
                    <activeArticle.component />
                ) : (
                    activeArticle?.sections?.map((section, index) => (
                        <div
                            key={index}
                            style={{
                                marginBottom: 32,
                            }}
                        >
                            <Title level={4}>{section.title}</Title>

                            <Paragraph>{section.text}</Paragraph>

                            {section.image && (
                                <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        margin: "20px 0",
                                    }}
                                >
                                    <Image
                                        src={section.image}
                                        alt={section.title}
                                        style={{
                                            maxWidth: "100%",
                                            maxHeight: 350,
                                            objectFit: "contain",
                                            borderRadius: 12,
                                            border: "1px solid #f0f0f0",
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    ))
                )}
            </Modal>
        </div>
    );
};

export default Help;