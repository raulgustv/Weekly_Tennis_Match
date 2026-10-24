import { Button, Timeline, Typography, Tag } from "antd"; // CHANGE: añadido Tag
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
    MinusOutlined,
    TrophyOutlined, // 🆕 CHANGE: tag "Ranking match"
    ToolOutlined,   // 🆕 CHANGE: tag "Admin adjustment"
    TeamOutlined,   // 🆕 CHANGE: tag "Doubles"
} from "@ant-design/icons";
import { useState } from "react";

// 🆕 CHANGE (tags NTRP): tag por tipo de ajuste. 'other' (reasons desconocidos) no lleva tag.
// `item.category` lo calcula useNTRPAdjustment a partir del `reason` del backend.
const REASON_TAGS = {
    ranking: { label: "Ranking match", color: "gold", icon: <TrophyOutlined /> },
    doubles: { label: "Doubles match", color: "blue", icon: <TeamOutlined /> },
    admin: { label: "Admin adjustment", color: "purple", icon: <ToolOutlined /> },
};
// ⬆️ FIN CHANGE

const NTRPHistory = ({ ntrpHistory }) => {

    const { Text, Title } = Typography;

    const step = 4;

    const [visibleCount, setVisibleCount] = useState(step);

    const hasMore = ntrpHistory.length > visibleCount;

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + step);
    };

    const handleShowLess = () => {
        setVisibleCount(step);
    };

    const visibleItems = ntrpHistory.slice(0, visibleCount);

    return (
        <>
            <Title level={4}>NTRP History</Title>

            {ntrpHistory.length === 0 ? (
                <Text type="secondary">No NTRP Adjustments</Text>
            ) : (
                <>
                    <Timeline
                        items={visibleItems.map((item) => {
                            const isUp = item.totalChange > 0;
                            const isDown = item.totalChange < 0;

                            // 🆕 CHANGE (tags NTRP): tag de esta línea (undefined → sin tag)
                            const reasonTag = REASON_TAGS[item.category];

                            return {
                                color: isUp
                                    ? "green"
                                    : isDown
                                        ? "red"
                                        : "gold",

                                icon: isUp ? (
                                    <ArrowUpOutlined />
                                ) : isDown ? (
                                    <ArrowDownOutlined />
                                ) : (
                                    <MinusOutlined />
                                ),

                                content: (
                                    <div>
                                        <small>{item.date}</small>
                                        <br />

                                        <Text
                                            strong
                                            type={
                                                isUp
                                                    ? "success"
                                                    : isDown
                                                        ? "danger"
                                                        : "warning"
                                            }
                                        >
                                            {isUp ? "+" : ""}
                                            {item.totalChange.toFixed(2)}
                                        </Text>

                                        {/* 🆕 CHANGE (tags NTRP): tag según el origen del ajuste
                                            (antes solo había tag para ranking con item.isRankingMatch) */}
                                        {reasonTag && (
                                            <Tag
                                                color={reasonTag.color}
                                                icon={reasonTag.icon}
                                                style={{ marginLeft: 8, borderRadius: 999 }}
                                            >
                                                {reasonTag.label}
                                            </Tag>
                                        )}
                                        {/* ⬆️ FIN CHANGE */}
                                    </div>
                                ),
                            };
                        })}
                    />

                    {hasMore && (
                        <Button type="link" onClick={handleShowMore}>
                            Show more
                        </Button>
                    )}

                    {!hasMore && ntrpHistory.length > step && (
                        <Button type="link" onClick={handleShowLess}>
                            Show less
                        </Button>
                    )}
                </>
            )}
        </>
    );
};

export default NTRPHistory;