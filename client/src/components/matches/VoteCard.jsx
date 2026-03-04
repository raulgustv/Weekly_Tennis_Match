import {
  Card,
  Typography,
  Divider,
  Tag,
  Flex,
  Button,
  Popover,
  Space
} from "antd";
import { AuditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useMemo } from "react";
import colors from "../../themes/colors";
import Voting from "./Voting";
import { toast } from "react-toastify";
import { voteSkill } from "../../actions/matches";
import useMatchVotes from "../../hooks/useMatchVotes";
import ProfilePicture from "../uploads/ProfilePicture";

const { Text, Title } = Typography;

const VoteCard = ({ match, loadMatches, userId }) => {

  const { votedUserIds, markAsVoted } = useMatchVotes(match?._id);

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

      <Text strong style={{ fontSize: 16 }}>
        Evaluate players skill level
      </Text>

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
