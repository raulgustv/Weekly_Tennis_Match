import {
  Card,
  Typography,
  Divider,
  Tag,
  Flex,
  Button,
  Popover,
  Space,
  Tooltip
} from "antd";
import { AuditOutlined, InfoCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";
import colors from "../../themes/colors";
import Voting from "./Voting";
import { toast } from "react-toastify";
import { voteSkill } from "../../actions/matches";
import useMatchVotes from "../../hooks/useMatchVotes";
import ProfilePicture from "../uploads/ProfilePicture";
import { useFeedback } from "../../context/FeedbackContext";

const { Text, Title } = Typography;

const VoteCard = ({ match, loadMatches, userId }) => {

  const { votedUserIds, markAsVoted } = useMatchVotes(match?._id);
  const {triggerFeedbackCheck} = useFeedback();

  // SOLO jugadores con los que realmente jugó el user
  const playersToVote = useMemo(() => {

    if (!match?.generatedMatches?.length || !userId) return [];

    const uniqueMap = new Map();

    match.generatedMatches.forEach((m) => {

      const roundPlayers = [
        m.teamA.player1,
        m.teamA.player2,
        m.teamB.player1,
        m.teamB.player2
      ];

      const userPlayedThisRound = roundPlayers.some(
        p => String(p._id) === String(userId)
      );

      if (!userPlayedThisRound) return;

      roundPlayers.forEach(player => {

        const id = String(player._id);

        if (id === String(userId)) return;

        if (!uniqueMap.has(id)) {
          uniqueMap.set(id, player);
        }

      });

    });

    return Array.from(uniqueMap.values());

  }, [match, userId]);

  useEffect(() =>{
    if(!playersToVote.length) return;

    const allVoted = playersToVote.every(
      p => votedUserIds.includes(String(p._id))
    )

    if(allVoted){
      triggerFeedbackCheck('post_action', {
        action: 'match_voting_completed',
        matchId: match?._id
      })
    }
  }, [votedUserIds, playersToVote, match?._id, triggerFeedbackCheck])

  const handleVote = async (playerId, value) => {
    try {

      await voteSkill(playerId, value, match._id);

      markAsVoted(playerId);

      toast.success("Thanks for voting");

    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const renderPlayerRow = (player) => {

    const playerId = String(player._id);
    const alreadyVoted = votedUserIds.includes(playerId);

    return (
      <Flex
        key={playerId}
        align="center"
        justify="space-between"
        style={{
          padding: 12,
          borderRadius: 12,
          background: alreadyVoted
            ? "rgba(24,144,255,0.08)"
            : "#fafafa"
        }}
      >
        <Flex align="center" gap={14}>
          {/* <Avatar size={44}>
            {player?.name?.[0]}
          </Avatar> */}
          <ProfilePicture
            user={player}
            profilePicture={player?.profilePicture?.url}
            size={50}
            editable={false}
          />

          <Flex vertical>
            <Text strong>
              {player?.name} {player?.lastname} <small>({player?.ntrplvl})</small>
            </Text>
          </Flex>
        </Flex>

        {/* 🔥 CONDICIÓN CLAVE */}
        {alreadyVoted ? (
          <Tag color="blue">Voted</Tag>
        ) : (
          <Popover
            trigger="click"
            content={
              <Voting
                onVote={(value) =>
                  handleVote(playerId, value)
                }
              />
            }
          >
            <Button
              shape="round"
              size="small"
              icon={<AuditOutlined />}
              style={{
                backgroundColor: colors.info,
                borderColor: colors.info,
                color: "white"
              }}
            >
              Vote
            </Button>
          </Popover>
        )}
      </Flex>
    );
  };

  return (
    <Card
      loading={loadMatches}
      hoverable
      style={{ borderRadius: 14 }}
    >
      {/* HEADER */}
      <Flex justify="space-between" align="center">
        <Title level={5} style={{ margin: 0 }}>
          {match?.date
            ? dayjs(match.date).format("DD MMM YYYY")
            : "-"}
        </Title>

        <Tag color={match?.status === "Played" ? "green" : "default"}>
          {match?.status}
        </Tag>
      </Flex>

      <Divider />

      <Flex align="center" gap={6}>
        <Text strong style={{ fontSize: 16 }}>
          Evaluate players skill level
        </Text>

        <Tooltip
          title={
            <div style={{ maxWidth: 260 }}>
              <p style={{ marginBottom: 8 }}>
                You can rate the players you shared the court with in your last match.
              </p>

              <p style={{ marginBottom: 8 }}>
                Your feedback is completely anonymous and will not be visible to the player.
              </p>

              <p style={{ margin: 0 }}>
                Please vote honestly and respectfully to help improve the experience for everyone.
              </p>
            </div>
          }
          placement="right"
          color={'#1677ff'}
        >
          <InfoCircleOutlined style={{ color: '#999', cursor: 'pointer' }} />
        </Tooltip>
      </Flex>

      <Divider />

      <Space
        orientation="vertical"
        size="middle"
        style={{ width: "100%" }}
      >
        {playersToVote.map(player => renderPlayerRow(player))}
      </Space>

    </Card>
  );
};

export default VoteCard;
