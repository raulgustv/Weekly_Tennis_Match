// NUEVO ARCHIVO: client/src/components/SeasonRanking/RankingRemovedNotice.jsx
// Aviso que ve un jugador expulsado del ranking (en /ranking, en lugar del formulario
// de inscripción). Datos: user.rankingBan = { active, reason, bannedAt } (lo envía
// /user/auth; `bannedBy` NO llega al cliente).
// El motivo lo escribe el admin: se pinta como texto (React lo escapa) y respetando saltos de línea.
import { Alert, Card, Descriptions, Flex, Typography } from "antd";
import { StopOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Text } = Typography;

const DATE_FORMAT = "DD/MM/YYYY";

const RankingRemovedNotice = ({ ban, isMobile }) => {
    const items = [
        {
            key: "reason",
            label: "Reason",
            children: <Text style={{ whiteSpace: "pre-wrap" }}>{ban?.reason || "No reason provided"}</Text>,
        },
        ...(ban?.bannedAt
            ? [{ key: "date", label: "Date", children: dayjs(ban.bannedAt).format(DATE_FORMAT) }]
            : []),
    ];

    return (
        <Card style={{ borderRadius: 14, maxWidth: 720 }}>
            <Flex vertical gap={16}>
                <Alert
                    type="error"
                    showIcon
                    icon={<StopOutlined />}
                    title="You have been removed from the MTC Ranking"
                    description="You can no longer take part in the ranking or register for it again."
                />

                <Descriptions
                    bordered
                    size="small"
                    column={1}
                    layout={isMobile ? "vertical" : "horizontal"}
                    items={items}
                />

                <Text type="secondary">
                    This decision only affects the MTC Ranking. Your account and your regular matches are not
                    affected by it. If you believe this is a mistake, please contact the administration.
                </Text>
            </Flex>
        </Card>
    );
};

export default RankingRemovedNotice;