// =====================================================================
// MatchVote.jsx  —  ARCHIVO ACTUALIZADO
// =====================================================================
// CAMBIOS respecto a tu versión anterior (todos marcados con "// 🆕"):
//
//   1) Import nuevo: VotingCriteriaCard (client/src/components/matches/
//      VotingCriteriaCard.jsx), la tarjeta con el "chart" de criterio
//      de voto (Lower / Correct / Higher) + el texto que vende el
//      valor del voto de forma objetiva y sutil.
//
//   2) El contenido se reorganiza en un <Row> de 2 columnas:
//        - Columna izquierda (lg=16): lo que ya tenías — el Alert
//          "How Match Voting works" + el listado de partidos a votar
//          (o el estado vacío EmptyVote).
//        - Columna derecha (lg=8): la nueva VotingCriteriaCard, fijada
//          con position: sticky para que acompañe al usuario mientras
//          hace scroll por la lista de partidos.
//
//      En pantallas pequeñas (xs/sm) ambas columnas ocupan el 100% del
//      ancho y la tarjeta de criterio se apila debajo del listado — no
//      hace falta lógica extra, lo resuelve el propio grid de antd.
//
//   3) No se ha tocado NINGUNA lógica de datos (fetchMatches,
//      triggerFeedbackCheck, filtrado/orden de voteMatches, etc.). Solo
//      es una reorganización visual + el nuevo componente.
//
// Nota sobre el "sticky": el valor `top: 24` en el contenedor de la
// derecha asume que no hay un header fijo por encima que lo tape. Si
// tu layout general tiene un header fijo, ajusta ese `top` a la altura
// de dicho header para que no se solape.
// =====================================================================

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
import { useNavigate } from "react-router-dom";
import VotingCriteria from "../../components/matches/VotingCriteria";

const { Title, Text } = Typography;

const MatchVote = () => {
  const {
    matches,
    loadMatches,
    fetchMatches,
  } = useMatches();

  const { user } = useAuth();
  const { triggerFeedbackCheck } = useFeedback();
  const navigate = useNavigate();

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

      {/* 🆕 Layout en 2 columnas: contenido principal a la izquierda, */}
      {/* tarjeta de criterio de voto ("chart") a la derecha.          */}
      <Row gutter={[24, 24]}>
        {/* ================= COLUMNA IZQUIERDA ================= */}
        <Col xs={24} lg={16}>
          <Alert
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
            title="Vote with a fair eye 🎯"
            description={
              <Space
                orientation="vertical"
                size={4}
                style={{ width: "100%" }}
              >
                <Text>
                  A rough match doesn't always mean a lower level — it might just be
                  their game. Vote honestly, based on what you actually saw on court.
                </Text>

                <Button
                  type="link"
                  onClick={() => navigate("/help")}
                  style={{
                    padding: 0,
                    height: "auto",
                    width: "fit-content",
                    fontWeight: 600,
                  }}
                >
                  Check the NTRP guide before you vote →
                </Button>
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
        </Col>

        {/* ================= COLUMNA DERECHA ================= */}
        {/* 🆕 Tarjeta con el "chart" de criterio de voto, fijada al  */}
        {/* hacer scroll (sticky) para que acompañe al usuario mientras */}
        {/* revisa el listado de partidos a la izquierda.               */}
        <Col xs={24} lg={8}>
          <div style={{ position: "sticky", top: 24 }}>
            <VotingCriteria />
          </div>
        </Col>
      </Row>
    </>
  );
};

export default MatchVote;