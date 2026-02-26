import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMatch } from "../../actions/matches";
import LoadingSpinner from "../utils/LoadingSpinner";
import {
  //Badge,
  Button,
  Card,
  Col,
  Flex,
  Row,
  Typography,
  Avatar,
  Empty,
  Tag,
  Switch,
} from "antd";
import {
  UserOutlined,
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import MatchDetails from "./MatchDetails";
import { useAuth } from "../../context/AuthContext";
import { togglePayment } from "../../actions/admin";

const { Title, Text } = Typography;


const MatchPlayers = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();


  const [match, setMatch] = useState();
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false)

  //console.log(match)

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        setPageLoading(true);
        const data = await getMatch(id);
        setMatch(data);
      } catch (error) {
        console.log(error);
      } finally {
        setPageLoading(false);
      }
    };

    fetchMatch();
  }, [id]);

  const handleTogglePayment = async(userId) =>{
    try {
      setLoading(true)
      await togglePayment(match._id, userId)      
      const updated = await getMatch(id)
      setMatch(updated)
      
    } catch (error) {
      console.log(error)
      setLoading(false)
    }finally{setLoading(false)}
  }

  if (pageLoading || !match) return <LoadingSpinner />;

  const isReady = match.status === "Ready";

  return (
    <div style={{ padding: 20 }}>

      {/* HEADER SIMPLE (SIN CARD) */}
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: 32 }}
      >
        <Col xs={24} md={18}>
          <Title level={3} style={{ marginBottom: 4 }}>
            🎾 {match?.location?.name}
          </Title>
          <Text type="secondary">
            {dayjs(match?.date).format(
              "dddd MMMM DD, YYYY"
            )}{" "}
            · {match?.startTime} - {match?.endTime}
          </Text>
        </Col>

        <Col xs={24} md={6} style={{ textAlign: "right", marginTop: 12 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/games")}
            block
          >
            Back
          </Button>
        </Col>
      </Row>

      {/* READY STATE */}
      {isReady ? (
        <Row gutter={[24, 24]}>
          {match.generatedMatches.map((m, index) => (
            <Col key={index} xs={24} sm={12} lg={8}>
              <MatchDetails match={m} />
            </Col>
          ))}
        </Row>
      ) : (
        <Row gutter={[24, 24]}>

          {/* PLAYERS */}
          <Col xs={24} lg={12}>
            <Card title="Players" variant="outlined">
              {match?.players?.length === 0 ? (
                <Empty description="No players signed up yet" />
              ) : (
                <Flex vertical gap={12}>
                  {match.players.map((p, index) => (
                    <Card
                      key={p?.user?._id || index}
                      size="small"
                      style={{ borderLeft: "4px solid #52c41a" }}
                    >
                      <Flex align="center" justify="space-between">
                        <Flex align="center" gap={12}>
                          <Avatar
                            size={40}
                            icon={<UserOutlined />}
                            style={{ backgroundColor: "#52c41a" }}
                          />
                          <div>
                            <Text strong>{p?.user?.name} {p?.user?.lastname?.[0]} <small>({p?.user?.ntrplvl})</small></Text>
                            <br />
                            <Tag color="green">Confirmed</Tag>
                          </div>

                        </Flex>
                        {
                          user?.role === 'admin' && (
                            <Flex align="center">
                              <Tag color={p?.payment?.status === 'unpaid' ? 'warning' : 'success'} icon={<ExclamationCircleOutlined />}>
                                <strong>{p?.payment?.method}</strong>
                              </Tag>
                              <Switch 
                                style={{marginLeft: 5}}
                                checked={p?.payment?.status === "paid"}
                                checkedChildren="paid"
                                unCheckedChildren="unpaid"
                                onChange={() => handleTogglePayment(p?.user?._id)}
                                loading={loading}
                              />
                            </Flex>
                          )
                        }
                      </Flex>


                    </Card>
                  ))}
                </Flex>
              )}
            </Card>
          </Col>

          {/* BACKUPS */}
          <Col xs={24} lg={12}>
            <Card title="Backups" variant="outlined">
              {match?.backUps?.length === 0 ? (
                <Empty description="No backups signed up yet" />
              ) : (
                <Flex vertical gap={12}>
                  {match.backUps.map((b, index) => (
                    <Card
                      key={b?.user?._id || index}
                      size="small"
                      style={{ borderLeft: "4px solid #faad14" }}
                    >
                      <Flex align="center" gap={12}>
                        <Avatar
                          size={40}
                          icon={<UserOutlined />}
                          style={{ backgroundColor: "#faad14" }}
                        />
                        <div>
                          <Text strong>{b?.user?.name}</Text>
                          <br />
                          <Tag color="gold">Backup</Tag>
                        </div>
                      </Flex>
                    </Card>
                  ))}
                </Flex>
              )}
            </Card>
          </Col>

        </Row>
      )}
    </div>
  );
};

export default MatchPlayers;
