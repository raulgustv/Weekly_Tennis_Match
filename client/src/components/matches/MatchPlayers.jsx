import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getMatch, generateMatch } from "../../actions/matches"; // 🔵 CAMBIO: se añade generateMatch
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
  Tooltip, // 🔵 CAMBIO: nuevo — explica por qué "Generate matches" está deshabilitado
} from "antd";
import {
  ArrowLeftOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  UserDeleteOutlined,
  ThunderboltOutlined, // 🔵 CAMBIO: icono para el botón "Generate matches"
} from "@ant-design/icons";
import dayjs from "dayjs";
import MatchDetails from "./MatchDetails";
import { useAuth } from "../../context/AuthContext";
import { togglePayment, adminRemovePlayer } from "../../actions/admin";
import colors from "../../themes/colors";
import ProfilePicture from "../uploads/ProfilePicture";
import CourtDetail from "./CourtDetail";
import { toast } from "react-toastify";
import { getMatchStartDateTime } from "../../helpers/time"; // 🔵 CAMBIO: mismo helper que ya usa el countdown de MatchesTable.jsx

const { Title, Text } = Typography;


const MatchPlayers = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();
  const [match, setMatch] = useState();



  const [loading, setLoading] = useState(false);
  const [removingId, setRemovingId] = useState(null); // 🔵 CAMBIO: nuevo, para el loading del botón "quitar"
  const [pageLoading, setPageLoading] = useState(false)
  const [generating, setGenerating] = useState(false); // 🔵 CAMBIO: nuevo, para el loading del botón "Generate matches"

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

  // 🔵 CAMBIO: handler nuevo — llama a POST /match/generate/:id (ya existía en el
  // backend, protegido por verifyBookerOrAdmin). El backend también valida las 12h
  // (ver server/controller/match.js), así que aunque este botón esté deshabilitado
  // en el cliente, el endpoint se protege igual si alguien lo llama directamente.
  const handleGenerateMatch = async () => {
    try {
      setGenerating(true)
      await generateMatch(match._id)
      toast.success('Matches successfully generated')
      const updated = await getMatch(id)
      setMatch(updated)
    } catch ({ response }) {
      toast.error(response?.data?.message || 'Error generating matches')
    } finally {
      setGenerating(false)
    }
  }

  if (pageLoading || !match) return <LoadingSpinner />;

  const isReady = match?.status === "Ready" || match?.status === 'Playing';

  // 🔵 CAMBIO: bloque nuevo — condiciones para mostrar/habilitar "Generate matches".
  // Mismas reglas de base que ya usaba MatchesTable.jsx (Open/Full + 4 jugadores),
  // más la ventana de 12h que pidió Raúl. El botón se MUESTRA siempre que se cumplan
  // las condiciones de base (aunque falten más de 12h) pero queda deshabilitado con
  // un tooltip explicando por qué, en vez de desaparecer.
  const hasEnoughPlayers = (match?.players?.length ?? 0) >= 4;
  const isGenerableStatus = match?.status === 'Open' || match?.status === 'Full';
  const alreadyGenerated = (match?.generatedMatches?.length ?? 0) > 0;
  const showGenerateButton = canManage && isGenerableStatus && hasEnoughPlayers && !alreadyGenerated;

  const matchStartMs = getMatchStartDateTime(match);
  const hoursUntilMatch = matchStartMs ? (matchStartMs - Date.now()) / (1000 * 60 * 60) : null;
  // Igual que isLessThan12h en el backend: se permite generar aunque hoursUntilMatch
  // sea negativo (el partido ya empezó), solo se bloquea si aún faltan más de 12h.
  const withinGenerateWindow = hoursUntilMatch !== null && hoursUntilMatch <= 12;

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



        {((user?.role === 'admin') && match.generatedMatches?.length > 0) && (
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


        {showGenerateButton && (
          <Col xs={24} md={4} style={{ textAlign: "right", marginTop: 12 }}>
            <Tooltip
              title={
                withinGenerateWindow
                  ? ""
                  : "Matches can only be generated once 12 hours or less remain before the match starts"
              }
            >
              <Button
                icon={<ThunderboltOutlined />}
                onClick={handleGenerateMatch}
                block
                disabled={!withinGenerateWindow}
                loading={generating}
                style={{ background: colors.yellow }}
              >
                Generate matches
              </Button>
            </Tooltip>
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
          {match.generatedMatches?.map((m, index) => (
            <Col key={index} xs={24} sm={12} lg={12}>
              {/* 🔵 CAMBIO: prop nueva currentUserId — permite a MatchDetails resaltar
                  al jugador logueado dentro del emparejamiento generado */}
              <MatchDetails match={m} currentUserId={user?._id} />
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
                        {/* 🔵 CAMBIO: la tarjeta del jugador ahora es clicable para
                            admin/booker y lleva al perfil (/admin/player/:id), igual que
                            ya hace PlayersTable.jsx. Para el resto de usuarios se deja
                            igual que antes (no clicable), porque esa ruta está protegida
                            por AdminRoute y un jugador normal sería redirigido. */}
                        <Tooltip title={user?.role === 'admin' ? "Click on player to view profile" : ""}>
                          <Flex
                            align="center"
                            gap={12}
                            style={user?.role === 'admin' ? { cursor: "pointer" } : undefined}
                            onClick={
                              user?.role === 'admin'
                                ? (e) => {
                                  e.stopPropagation();
                                  navigate(`/admin/player/${p?.user?._id}`);
                                }
                                : undefined
                            }
                          >
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
                        </Tooltip>
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
                              <Tooltip
                                title='Remove player from this match'
                                color="#1677FF"
                              >
                                <Button
                                  danger
                                  size="small"
                                  icon={<UserDeleteOutlined />}
                                  loading={removingId === p?.user?._id}
                                />
                              </Tooltip>
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
                        {/* 🔵 CAMBIO: misma tarjeta clicable que en Players, solo para
                            admin/booker */}
                        <Tooltip title={canManage ? "Click on player to view profile" : ""}>
                          <Flex
                            align="center"
                            gap={12}
                            style={canManage ? { cursor: "pointer" } : undefined}
                            onClick={
                              canManage
                                ? (e) => {
                                  e.stopPropagation();
                                  navigate(`/admin/player/${b?.user?._id}`);
                                }
                                : undefined
                            }
                          >
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
                        </Tooltip>

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