import { Card, Typography, Tag, Flex } from "antd";
import { useState } from "react";
import { BgColorsOutlined, DollarOutlined } from "@ant-design/icons";
import { surfaceColors } from "../../themes/surfaceColors";

const { Text } = Typography;

const CourtDetail = ({ courts }) => {

    const tabList = courts.map((c) => ({
        key: c.courtNumber,
        tab: `Court ${c.courtNumber}`
    }));

    const contentList = {};

    courts.forEach((c) => {
        contentList[c.courtNumber] = (
            <Flex
                vertical
                gap="middle"
                style={{
                    background: "#fafafa",
                    padding: 16,
                    borderRadius: 8
                }}
            >
                <Flex justify="space-between" align="center">
                    <Text strong>
                        <BgColorsOutlined /> Surface
                    </Text>

                    <Tag color={surfaceColors[c.surface]}>
                       {c.surface}
                    </Tag>
                </Flex>

                <Flex justify="space-between" align="center">
                    <Text strong>
                        <DollarOutlined /> Price
                    </Text>

                    <Tag color="green">
                        €{c.price}
                    </Tag>
                </Flex>
            </Flex>
        );
    });

    const [activeTabKey, setActiveTabKey] = useState(courts[0]?.courtNumber);

    return (
        <Card
            tabList={tabList}
            activeTabKey={activeTabKey}
            onTabChange={(key) => setActiveTabKey(key)}
            size="small"
            title="Courts"
            style={{ borderRadius: 10 }}
        >
            {contentList[activeTabKey]}
        </Card>
    );
};

export default CourtDetail;