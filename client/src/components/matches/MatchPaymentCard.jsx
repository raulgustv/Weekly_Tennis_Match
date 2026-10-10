// 🔵 NUEVO (archivo completo): tarjeta de pagos post-partido.
// En MatchPlayers.jsx, cuando el partido está en "Ready" o "Playing" solo se
// muestran los emparejamientos generados y la lista de jugadores (con sus
// controles de pago) desaparece. Esta tarjeta recupera el control de pagos
// en ese estado. Solo se renderiza para admin/booker (lo decide el padre;
// el backend lo vuelve a verificar con verifyBookerOrAdmin).
import { Card, Empty, Flex, Progress, Typography } from "antd";
// 🔵 CAMBIO: era "../../uploads/ProfilePicture". El archivo está en
// components/matches/ (no en components/matches/payments/), así que solo
// hay que subir un nivel para llegar a components/uploads/.
import ProfilePicture from "../uploads/ProfilePicture";
import PlayerPaymentControls from "./PlayerPaymentControls";


const { Text } = Typography;

const MatchPaymentCard = ({
  players = [],
  paymentMethods = [],
  matchStatus,
  loading = false,
  onTogglePaid,
  onChangeMethod,
}) => {
  // El booker cuenta como pagado (no debe aparecer como pendiente).
  const paidCount = players.filter(
    (p) => p?.payment?.status === "paid" || p?.payment?.method === "booker"
  ).length;

  const total = players.length;
  const percent = total ? Math.round((paidCount / total) * 100) : 0;

  return (
    <Card
      title="Payments"
      variant="outlined"
      extra={<Text type="secondary">{paidCount} / {total} paid</Text>}
    >
      {total === 0 ? (
        <Empty description="No players in this match" />
      ) : (
        <>
          <Progress
            percent={percent}
            size="small"
            status={percent === 100 ? "success" : "active"}
            showInfo={false}
            style={{ marginBottom: 16 }}
          />

          <Flex vertical gap={12}>
            {players.map((p, index) => (
              <Card
                key={p?.user?._id || index}
                size="small"
                style={{
                  borderLeft: `4px solid ${
                    p?.payment?.status === "paid" || p?.payment?.method === "booker"
                      ? "#52c41a"
                      : "#faad14"
                  }`,
                }}
              >
                <Flex align="center" justify="space-between" wrap gap={12}>
                  <Flex align="center" gap={12}>
                    <ProfilePicture
                      user={p}
                      profilePicture={p?.user?.profilePicture?.url}
                      size={28}
                      editable={false}
                    />
                    <Text strong>
                      {p?.user?.name} {p?.user?.lastname?.[0]}
                    </Text>
                  </Flex>

                  <PlayerPaymentControls
                    player={p}
                    paymentMethods={paymentMethods}
                    matchStatus={matchStatus}
                    loading={loading}
                    onTogglePaid={onTogglePaid}
                    onChangeMethod={onChangeMethod}
                  />
                </Flex>
              </Card>
            ))}
          </Flex>
        </>
      )}
    </Card>
  );
};

export default MatchPaymentCard;