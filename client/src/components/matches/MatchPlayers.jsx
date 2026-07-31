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
  Empty,
  Tag,
  Switch,
} from "antd";
import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import MatchDetails from "./MatchDetails";
import { useAuth } from "../../context/AuthContext";
import { togglePayment } from "../../actions/admin";
import colors from "../../themes/colors";
import ProfilePicture from "../uploads/ProfilePicture";
import CourtDetail from "./CourtDetail";
import { toast } from "react-toastify";

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

  const handleTogglePayment = async (userId) => {
    try {
      setLoading(true)
      await togglePayment(match._id, userId)
      const updated = await getMatch(id)
      setMatch(updated)

    } catch ({response}) {
      console.log({response})
      toast.error(response?.data?.message || 'Error setting user payment')
      setLoading(false)
    } finally { setLoading(false) }
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
        gutter={[16, 16]}
      >
        <Col xs={24} md={10}>
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



        {(user?.role === 'admin' && match.generatedMatches.length > 0) && (
          <Col xs={24} md={4} style={{ textAlign: "right", marginTop: 12 }}>
            <Button
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/match/edit/${match._id}`)}
              block
              style={{ background: colors.warning }}
            >
              Edit pairs
            </Button>
          </Col>
        )}

        <Col xs={24} md={user?.role === 'admin' ? 3 : 6} style={{ textAlign: "right", marginTop: 12 }}>
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/games")}
            block
          >
            Back
          </Button>
        </Col>
      </Row>

      <Row style={{ marginBottom: 32 }}>
        <Col md={12} sm={24} >
          <CourtDetail courts={match.courts} />
        </Col>
      </Row>

      {/* READY STATE */}
      {isReady ? (
        <Row gutter={[24, 24]}>
          {match.generatedMatches.map((m, index) => (
            <Col key={index} xs={24} sm={12} lg={6}>
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
                      <Flex align="center" justify="space-between" wrap gap={12}>
                        <Flex align="center" gap={12}>
                          {/* <Avatar
                            size={40}
                            icon={<UserOutlined />}
                            style={{ backgroundColor: "#52c41a" }}
                          /> */}
                          <ProfilePicture
                            user={p}
                            profilePicture={p?.user?.profilePicture?.url}
                            size={28}
                            editable={false}
                          />
                          <div>
                            <Text strong>{p?.user?.name} {p?.user?.lastname?.[0]} <small>({p?.user?.ntrplvl})</small></Text>
                            <br />
                            <Tag color="green">Confirmed</Tag>
                          </div>

                        </Flex>
                        {user?.role === 'admin' && (
                          <Flex
                            align="center"
                            gap={8}
                            style={{
                              marginTop: 8,
                              marginLeft: "auto",
                            }}
                          >
                            <Tag
                              color={p?.payment?.status === 'unpaid' ? 'warning' : 'success'}
                              icon={<ExclamationCircleOutlined />}
                            >
                              <strong>{p?.payment?.method}</strong>
                            </Tag>

                            <Switch
                              checked={p?.payment?.status === "paid"}
                              checkedChildren="paid"
                              unCheckedChildren="unpaid"
                              onChange={() => handleTogglePayment(p?.user?._id)}
                              loading={loading}
                            />
                          </Flex>
                        )}
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
                        <ProfilePicture
                          user={b}
                          profilePicture={b?.user?.profilePicture?.url}
                          size={28}
                          editable={false}
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
