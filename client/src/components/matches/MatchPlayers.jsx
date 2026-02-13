import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMatch } from "../../actions/matches";
import LoadingSpinner from "../utils/LoadingSpinner";
import {
  Badge,
  Button,
  Card,
  Col,
  Flex,
  Row,
  Typography,
  Avatar,
  Empty,
  Tag
} from "antd";
import { UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import MatchDetails from "./MatchDetails";

const MatchPlayers = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { Title, Text } = Typography;

  const [match, setMatch] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setLoading(true);
        const data = await getMatch(id);
        setMatch(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatch();
  }, [id]);

  if (loading || !match) return <LoadingSpinner />;

  const isReady = match.status === "Ready";

  return (
    <Flex vertical gap={24}>
      {/* HEADER */}
      <Flex justify="space-between" align="flex-start">
        <div>
          <Title level={3} style={{ marginBottom: 0 }}>
            🎾 Match at: {match?.location?.name}
            <br />
            <Text type="secondary">
              {dayjs(match?.date).format("dddd MMMM DD, YYYY")}
            </Text>
          </Title>
          <Text type="secondary">
            {match?.startTime} - {match?.endTime}
          </Text>
        </div>

        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate("/dashboard")}
        >
          Back to matches
        </Button>
      </Flex>

      {/* ===================== */}
      {/* READY → ONLY VERSUS */}
      {/* ===================== */}
      {isReady ? (
        
        <Row gutter={[20,20]} justify="start">
          {match.generatedMatches.map((m, index) => (            
            <Col
              xs={24}
              sm={12}
              md={8}
              key={index}
            >
              
                <MatchDetails match={m} />
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={16}>
          {/* PLAYERS */}
          <Col span={12}>
            <Card
              title={
                <Flex align="center" justify="space-evenly">
                  <Title level={5}>Players</Title>
                  <Button
                    type="primary"
                    variant="outlined"
                    style={{ marginBottom: 12, marginLeft: 5 }}
                  >
                    Join this match
                  </Button>
                </Flex>
              }
            >
              {match?.players?.length === 0 ? (
                <Empty
                  description="No players signed up yet"
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                />
              ) : (
                <Flex vertical gap={8}>
                  {match.players.map((p, index) => (
                    <Card
                      key={p?.user?._id || p?.user?.id || index}
                      size="small"
                      hoverable
                      style={{ borderLeft: "4px solid #52c41a" }}
                    >
                      <Flex align="center" gap={12}>
                        <Badge status="success">
                          <Avatar
                            size={36}
                            icon={<UserOutlined />}
                            style={{ backgroundColor: "#52c41a" }}
                          />
                        </Badge>

                        <Flex vertical>
                          <Text strong>{p?.user?.name}</Text>
                          <Tag color="green">Confirmed</Tag>
                        </Flex>
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              )}
            </Card>
          </Col>

          {/* BACKUPS */}
          <Col span={12}>
            <Card
              title={
                <Flex align="center" justify="space-evenly">
                  <Title level={5}>Backups</Title>
                  <Button
                    type="default"
                    variant="outlined"
                    style={{ marginBottom: 12, marginLeft: 5 }}
                  >
                    Join as backup
                  </Button>
                </Flex>
              }
            >
              {match?.backUps?.length === 0 ? (
                <Empty
                  description="No backups signed up yet"
                  image="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg"
                />
              ) : (
                <Flex vertical gap={8}>
                  {match.backUps.map((b, index) => (
                    <Card
                      key={b?.user?._id || b?.user?.id || index}
                      size="small"
                      hoverable
                      style={{ borderLeft: "4px solid #faad14" }}
                    >
                      <Flex align="center" gap={12}>
                        <Badge status="warning">
                          <Avatar
                            size={36}
                            icon={<UserOutlined />}
                            style={{ backgroundColor: "#faad14" }}
                          />
                        </Badge>

                        <Flex vertical>
                          <Text strong>{b?.user?.name}</Text>
                          <Tag color="gold">Backup</Tag>
                        </Flex>
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              )}
            </Card>
          </Col>
        </Row>
      )}
    </Flex>
  );
};

export default MatchPlayers;
