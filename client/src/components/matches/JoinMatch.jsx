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

  const [selectedMatch, setSelectedMatch] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);
  // 🔵 CAMBIO (nuevo): distingue si el PaymentModal que se está abriendo es
  // para unirse como player o como backup — el backup ahora también elige
  // método de pago al apuntarse (antes "Join as backup" no abría este modal,
  // ver handleRequestBackupJoin más abajo).
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

  const handleRequestJoin = (match) => {
    setSelectedMatch(match);
    // 🔵 CAMBIO: se asegura de que el modal se abre en modo "player"
    setJoinAsBackup(false);
    setPaymentModal(true);
  };

  // 🔵 CAMBIO (nuevo): equivalente a handleRequestJoin pero para "Join as
  // backup" — antes ese botón llamaba directo a onJoin(_id, true) sin pedir
  // método de pago. Ahora el backup también elige método (y si es wallet,
  // el saldo se retiene ya al apuntarse, ver server/controller/match.js).
  const handleRequestBackupJoin = (match) => {
    setSelectedMatch(match);
    setJoinAsBackup(true);
    setPaymentModal(true);
  };

  const handleConfirmJoin = async (paymentMethod) => {
    if (!selectedMatch) return;

    // 🔵 CAMBIO: usa el flag joinAsBackup para decidir si se apunta como
    // player o como backup, en vez de estar siempre fijo a `false`.
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
      await fetchMatches();
      //fetchAllTransactions()
      await fetchTransactions()
      await loadUser()

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
            startTime && startTime > Date.now() ?
            startTime : null;

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
                  onRequestBackupJoin={handleRequestBackupJoin}
                  onJoin={handleJoin}
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
          onCancel={() => {
            setPaymentModal(false);
            setJoinAsBackup(false);
          }}
          onConfirm={handleConfirmJoin}
          paymentMethods={selectedMatch.paymentMethods}
          price={Number(
            selectedMatch.price /
            selectedMatch.maxPlayers
          ).toFixed(2)}
          balance={balance}
          walletPaymentAllowed={walletPaymentAllowed}
        />
      )}
    </>
  );
};

export default JoinMatch;