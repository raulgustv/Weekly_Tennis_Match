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
import { useFeedback } from "../../context/FeedbackContext";

const { useBreakpoint } = Grid;
const { Timer } = Statistic;

const JoinMatch = ({ openMatches = [], loading, fetchMatches }) => {

  const screens = useBreakpoint();


  const { fetchTransactions } = useTransactions()
  const {user, loadUser} = useAuth();
  const {triggerFeedbackCheck} = useFeedback()

  const balance = user?.walletBalance;

  // 🔵 AÑADIDO
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [paymentModal, setPaymentModal] = useState(false);


  const handleJoin = async (id, backup = false, paymentMethod = null) => {
    try {
      const data = await joinMatch(id, backup, paymentMethod);

      toast.success(
        `Joined match for ${dayjs(data?.match?.date).format(
          "DD-MM-YYYY"
        )} as ${data?.role}`
      );

      fetchMatches();

      triggerFeedbackCheck('post_action', {
        action: backup ? 'match_joined_backup' : 'match_joined_player',
        matchId: id
      })
      
    } catch (error) {

      toast.error(error?.response?.data?.message);
      triggerFeedbackCheck('friction', {
        action: 'join_failed',
        matchId: id,
        reason: error?.response?.data?.message
      })
    }
  };

  // 🔵 AÑADIDO
  const handleRequestJoin = (match) => {
    setSelectedMatch(match);
    setPaymentModal(true);
  };

  // 🔵 AÑADIDO
  const handleConfirmJoin = async (paymentMethod) => {
    if (!selectedMatch) return;

    await handleJoin(
      selectedMatch._id,
      false,
      paymentMethod
    );

    setPaymentModal(false);
    setSelectedMatch(null);
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
          onCancel={() => setPaymentModal(false)}
          onConfirm={handleConfirmJoin}
          paymentMethods={selectedMatch.paymentMethods}
          price={Number(
            selectedMatch.price /
            selectedMatch.maxPlayers
          ).toFixed(2)}
          balance={balance}
        />
      )}
    </>
  );
};

export default JoinMatch;