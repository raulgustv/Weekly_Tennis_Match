import { Button, Timeline, Typography } from "antd";
import {
    ArrowDownOutlined,
    ArrowUpOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const NTRPHistory = ({ ntrpHistory }) => {

    const { Text, Title } = Typography;

    const step = 4;

    const [visibleCount, setVisibleCount] = useState(step);

    const hasMore = ntrpHistory.length > visibleCount;

    const handleShowMore = () => {
        setVisibleCount((prev) => prev + step)
    };

    const handleShowLess = () => {
        setVisibleCount(step)
    }

    const visibleItems = ntrpHistory.slice(0, visibleCount)




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

                            return {
                                color: isUp ? "green" : "red",
                                icon: isUp ? <ArrowUpOutlined /> : <ArrowDownOutlined />,
                                content: (
                                    <div>
                                        <small>{item.date}</small>
                                        <br />
                                        <Text strong type={isUp ? "success" : "warning"}>
                                            {isUp ? "+" : ""}
                                            {item.totalChange}
                                        </Text>
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
    )
}

export default NTRPHistory 