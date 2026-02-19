import { Card, Col, Row, Empty, Flex, Statistic, Grid } from "antd";
import MatchSummaryTabs from "./MatchSummaryTabs";
import { joinMatch, leaveMatch } from "../../actions/matches";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { getMatchStartDateTime } from "../../helpers/time";

const { useBreakpoint } = Grid;
const { Timer } = Statistic;

const JoinMatch = ({ openMatches = [], loading, fetchMatches }) => {
  const screens = useBreakpoint();

  const handleJoin = async (id, backup) => {
    try {
      const data = await joinMatch(id, backup);
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

  const handleLeave = async (id) => {
    try {
      await leaveMatch(id);
      toast.success("Successfully left the match");
      fetchMatches();
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  if (!openMatches.length && !loading) {
    return <Empty description="No open matches available" />;
  }

  return (
    <Row gutter={[16, 16]} align="stretch">
      {openMatches.map((match) => {
        const startTime = getMatchStartDateTime(match);
        const matchStart =
          startTime && startTime > Date.now() ? startTime : null;

        const vertical = !screens.lg; // Hasta lg vertical

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
                        format="D[d] H[h] m[m]" // 👈 sin segundos en lg+
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
                onJoin={handleJoin}
                onLeave={handleLeave}
              />
            </Card>
          </Col>
        );
      })}
    </Row>
  );
};

export default JoinMatch;
