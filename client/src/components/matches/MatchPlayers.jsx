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
  Popconfirm,
} from "antd";
import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  UserDeleteOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import MatchDetails from "./MatchDetails";
import { useAuth } from "../../context/AuthContext";
import { togglePayment, adminRemovePlayer } from "../../actions/admin";
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
  const [removingId, setRemovingId] = useState(null); // 🔵 CAMBIO: nuevo, para el loading del botón "quitar"
  const [pageLoading, setPageLoading] = useState(false)

  // 🔵 CAMBIO: variable nueva, evita repetir la condición admin/booker por todo el componente
  const canManage = user?.role === 'admin' || user?.role === 'booker';

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

    } catch ({ response }) {
      console.log({ response })
      toast.error(response?.data?.message || 'Error setting user payment')
      setLoading(false)
    } finally { setLoading(false) }
  }

  // 🔵 CAMBIO: handler nuevo. Llama a la acción adminRemovePlayer, que ya
  // existía en actions/admin.js (apunta a POST /admin/remove-player/:matchId/:playerId)
  // pero no estaba conectada a ningún botón de la interfaz.
  const handleRemovePlayer = async (userId) => {
    try {
      setRemovingId(userId)
      await adminRemovePlayer(match._id, userId)
      toast.success('Player removed from the match')
      const updated = await getMatch(id)
      setMatch(updated)
    } catch ({ response }) {
      toast.error(response?.data?.message || 'Error removing player')
    } finally {
      setRemovingId(null)
    }
  }

  if (pageLoading || !match) return <LoadingSpinner />;

  const isReady = match?.status === "Ready" || match?.status === 'Playing';

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



        {((user?.role === 'admin' || user?.role === 'booker') && match.generatedMatches?.length > 0) && (
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
      {isReady  ? (
        <Row gutter={[24, 24]}>
          {match.generatedMatches?.map((m, index) => (
            <Col key={index} xs={24} sm={12} lg={12}>
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
                  {match.players?.map((p, index) => (
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
                        {canManage && (
                          <Flex
                            align="center"
                            gap={8}
                            wrap
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

                            {/* 🔵 CAMBIO: botón nuevo — antes admin/booker no tenían
                                forma de retirar a un jugador desde esta pantalla. */}
                            <Popconfirm
                              title="Remove player"
                              description="Remove this player from the match? If they paid with wallet, they'll be refunded and the next backup (if any) will be auto-promoted."
                              onConfirm={() => handleRemovePlayer(p?.user?._id)}
                              okText="Remove"
                              cancelText="Cancel"
                            >
                              <Button
                                danger
                                size="small"
                                icon={<UserDeleteOutlined />}
                                loading={removingId === p?.user?._id}
                              />
                            </Popconfirm>
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
              {!match?.backUps?.length ? (
                <Empty description="No backups signed up yet" />
              ) : (
                <Flex vertical gap={12}>
                  {match.backUps.map((b, index) => (
                    <Card
                      key={b?.user?._id || index}
                      size="small"
                      style={{ borderLeft: "4px solid #faad14" }}
                    >
                      <Flex align="center" justify="space-between" wrap gap={12}>
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
                            {/* 🔵 CAMBIO: tag nuevo — antes no se mostraba nada
                                del pago de un backup (no existía ese dato). */}
                            {b?.payment?.method && (
                              <Tag color={b?.payment?.status === 'held' ? 'success' : 'default'}>
                                <strong>{b.payment.method}</strong> · {b.payment.status}
                              </Tag>
                            )}
                          </div>
                        </Flex>

                        {/* 🔵 CAMBIO: botón nuevo, mismo handler que para players */}
                        {canManage && (
                          <Popconfirm
                            title="Remove backup"
                            description="Remove this backup from the match? If they had wallet funds on hold, they'll be refunded."
                            onConfirm={() => handleRemovePlayer(b?.user?._id)}
                            okText="Remove"
                            cancelText="Cancel"
                          >
                            <Button
                              danger
                              size="small"
                              icon={<UserDeleteOutlined />}
                              loading={removingId === b?.user?._id}
                              style={{ marginLeft: "auto" }}
                            />
                          </Popconfirm>
                        )}
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