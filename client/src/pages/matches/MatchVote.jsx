import { useEffect } from "react";
import {
  Row,
  Col,
  Space,
  Typography,
  Button,
  Spin,
  Alert,
} from "antd";
import {
  ReloadOutlined,
  InfoCircleOutlined,
} from "@ant-design/icons";

import { useAuth } from "../../context";
import { useMatches } from "../../context/MatchContext";
import { useFeedback } from "../../context/FeedbackContext";

import VoteCard from "../../components/matches/VoteCard";
import EmptyVote from "../../components/matches/EmptyVote";
import TennisLoader from "../../components/Animations/TennisLoader";

const { Title, Text } = Typography;

const MatchVote = () => {
  const {
    matches,
    loadMatches,
    fetchMatches,
  } = useMatches();

  const { user } = useAuth();
  const { triggerFeedbackCheck } = useFeedback();

  const voteMatches = matches
    .filter(
      (m) =>
        m.status === "Played" &&
        m.players?.some((p) => p.user?._id === user?._id)
    )
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  useEffect(() => {
    if (voteMatches.length && user) {
      triggerFeedbackCheck(
        "post_match",
        {
          action: "match_played",
          matchId: voteMatches[0]?._id,
        },
        "match",
        "How was your experience on your match?"
      );
    }
  }, [user, voteMatches, triggerFeedbackCheck]);

  return (
    <>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        <Title level={3} style={{ margin: 0 }}>
          ⭐ Match Feedback
        </Title>

        <Button
          type="primary"
          icon={<ReloadOutlined spin={loadMatches} />}
          disabled={loadMatches}
          onClick={() => fetchMatches()}
          size="large"
          style={{
            background:
              "linear-gradient(135deg, #7CB342 0%, #43A047 100%)",
            border: "none",
            borderRadius: 999,
            fontWeight: 700,
            paddingInline: 24,
            boxShadow: "0 6px 16px rgba(67,160,71,.35)",
            transition: "all .25s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow =
              "0 10px 24px rgba(67,160,71,.45)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow =
              "0 6px 16px rgba(67,160,71,.35)";
          }}
        >
          {loadMatches ? "Refreshing..." : "Refresh Matches"}
        </Button>
      </Space>

      {/* VOTING INFORMATION */}
      <Alert
        type="info"
        showIcon
        icon={<InfoCircleOutlined />}
        title="How skill voting works"
        description={
          <Space
            orientation="vertical"
            size={4}
            style={{ width: "100%" }}
          >
            <Text>
              Rate the players you played with based on their performance
              in this match.
            </Text>

            <Text>
              <strong>−1</strong> → Below your level&nbsp;&nbsp;·&nbsp;&nbsp;
              <strong>0</strong> → Similar level&nbsp;&nbsp;·&nbsp;&nbsp;
              <strong>+1</strong> → Above your level
            </Text>

            <Text>
              Your vote is <strong>anonymous</strong> and contributes to the
              player's skill rating. Votes from higher-rated players have
              slightly more influence, helping keep the rating accurate.
            </Text>

            <Text>
              A player's rating can change by <strong>no more than 0.15
                points</strong> from a single match.
            </Text>

            <Text type="secondary">
              Please vote based on what you actually saw on court and be fair.
            </Text>
          </Space>
        }
        style={{
          marginBottom: 20,
          borderRadius: 10,
        }}
      />

      <Spin
        spinning={loadMatches}
        indicator={<TennisLoader />}
      >
        {voteMatches.length === 0 ? (
          <EmptyVote />
        ) : (
          <Row gutter={[16, 16]}>
            {voteMatches.map((m) => (
              <Col
                key={m._id}
                lg={12}
                md={16}
                sm={24}
                xs={24}
              >
                <VoteCard
                  match={m}
                  loadMatches={loadMatches}
                  userId={user._id}
                />
              </Col>
            ))}
          </Row>
        )}
      </Spin>
    </>
  );
};

export default MatchVote;