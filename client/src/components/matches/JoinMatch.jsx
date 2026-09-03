import { Card, Col, Row, Empty, Flex, Statistic, Grid } from "antd";
import MatchSummaryTabs from "./MatchSummaryTabs";
import { joinMatch, leaveMatch } from "../../actions/matches";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { getMatchStartDateTime } from "../../helpers/time";
import { useState } from "react";
import PaymentModal from "./PaymentModal";
import {  useTransactions } from "../../hooks/useTransactions";
import { useAuth } from "../../context/AuthContext";


const { useBreakpoint } = Grid;
const { Timer } = Statistic;

const JoinMatch = ({ openMatches = [], loading, fetchMatches }) => {

  const screens = useBreakpoint();


  const { fetchTransactions } = useTransactions()
  const {user, loadUser} = useAuth();

  const balance = user?.walletBalance;

  // 🔵 AÑADIDO
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  // 🔵 CAMBIO: nuevo estado — recuerda si el modal de pago se abrió desde
  // "Join Match" o desde "Join as backup", para saber qué mandar a joinMatch().
  const [joinAsBackup, setJoinAsBackup] = useState(false);

  const walletPaymentAllowed = selectedMatch?.createdBy?.walletPaymentAllowed === true


  const handleJoin = async (id, backup = false, paymentMethod = null) => {
    try {
      const data = await joinMatch(id, backup, paymentMethod);

      toast.success(
        `Joined match for ${dayjs(data?.match?.date).format(
          "DD-MM-YYYY"
        )} as ${data?.role}`
      );

      fetchMatches();

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  // 🔵 AÑADIDO
  const handleRequestJoin = (match) => {
    setSelectedMatch(match);
    setJoinAsBackup(false); // 🔵 CAMBIO: aseguramos que no quede el flag de un backup anterior
    setPaymentModal(true);
  };

  // 🔵 CAMBIO: handler nuevo, gemelo de handleRequestJoin pero para backup.
  // Antes el botón "Join as backup" llamaba a onJoin(_id, true) directo,
  // sin pasar por el modal de pago (ver MatchSummaryTabs.jsx).
  const handleRequestBackup = (match) => {
    setSelectedMatch(match);
    setJoinAsBackup(true);
    setPaymentModal(true);
  };

  // 🔵 AÑADIDO
  const handleConfirmJoin = async (paymentMethod) => {
    if (!selectedMatch) return;

    // 🔵 CAMBIO: antes aquí siempre iba "false" (solo se llegaba desde
    // Join Match). Ahora se manda joinAsBackup para cubrir también el
    // flujo de backup.
    await handleJoin(
      selectedMatch._id,
      joinAsBackup,
      paymentMethod
    );

    setPaymentModal(false);
    setSelectedMatch(null);
    setJoinAsBackup(false);
    //fetchAllTransactions()
    fetchTransactions()
    loadUser()
  };

  const handleLeave = async (id) => {
    try {
      await leaveMatch(id);
      toast.success("Successfully left the match");
      fetchMatches();
      //fetchAllTransactions()
      fetchTransactions()
      loadUser()

    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  if (!openMatches.length && !loading) {
    return <Empty description="No open matches available" />;
  }

  return (
    <>
      <Row gutter={[16, 16]} align="stretch">
        {openMatches.map((match) => {

          const startTime = getMatchStartDateTime(match);
          const matchStart =
            startTime && startTime > Date.now() ? startTime : null;

          const vertical = !screens.lg;

          return (
            <Col key={match._id} xs={24} sm={12} lg={8}>
              <Card
                loading={loading}
                style={{ height: "100%" }}
                styles={{
                  body: {
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  },
                }}
                title={
                  vertical ? (
                    <Flex vertical align="center" gap={4}>
                      <span style={{ fontWeight: 500 }}>
                        Upcoming match
                      </span>

                      {matchStart && (
                        <Timer
                          type="countdown"
                          value={matchStart}
                          format="D[d] H[h] m[m] s[s]"
                          styles={{
                            value: {
                              fontSize: 14,
                              fontWeight: 600,
                              color: "#1677ff",
                              whiteSpace: "nowrap",
                            },
                          }}
                        />
                      )}
                    </Flex>
                  ) : (
                    <Flex justify="space-between" align="center">
                      <span style={{ fontWeight: 500 }}>
                        Upcoming match
                      </span>

                      {matchStart && (
                        <Timer
                          type="countdown"
                          value={matchStart}
                          format="D[d] H[h] m[m]"
                          styles={{
                            value: {
                              fontSize: 12,
                              fontWeight: 600,
                              color: "#1677ff",
                              whiteSpace: "nowrap",
                            },
                          }}
                        />
                      )}
                    </Flex>
                  )
                }
              >
                <MatchSummaryTabs
                  matchSummary={match}
                  showJoinButton
                  onRequestJoin={handleRequestJoin}
                  // 🔵 CAMBIO: prop nueva, sustituye a la prop onJoin de antes
                  onRequestBackup={handleRequestBackup}
                  onLeave={handleLeave}
                />
              </Card>
            </Col>
          );
        })}
      </Row>

      {selectedMatch && (
        <PaymentModal
          open={paymentModal}
          onCancel={() => setPaymentModal(false)}
          onConfirm={handleConfirmJoin}
          paymentMethods={selectedMatch.paymentMethods}
          price={Number(
            selectedMatch.price /
            selectedMatch.maxPlayers
          ).toFixed(2)}
          balance={balance}
          walletPaymentAllowed={walletPaymentAllowed}
          // 🔵 CAMBIO: prop nueva, activa el aviso de backup dentro del modal
          isBackup={joinAsBackup}
        />
      )}
    </>
  );
};

export default JoinMatch;