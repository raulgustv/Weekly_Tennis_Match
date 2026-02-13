import { Card, Col, Divider, Row, Tag, Typography, Space, Flex } from "antd";
import colors from "../../themes/colors";

const { Title, Text } = Typography;

const MatchDetails = ({ match }) => {

  console.log(match)

  const playersTeamA = (teamA, accentColor) => (
    <Space orientation="vertical" size={6} style={{ width: '100%' }}>
      {Object.values(teamA).map((p) => (
        <div key={p?._id} style={{
          padding: "5px 8px",
          borderRadius: 6,
          background: colors.white,
          borderLeft: `3px solid ${accentColor}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          height: 28,            
          display: "flex",
          alignItems: "center"

        }}>
          <Text
            style={{
              fontSize: 13,
              color: colors.textPrimary,
              display: 'block',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: '100%'
            }}
          >
            {p?.name} {p?.lastname}
          </Text>
        </div>
      ))}
    </Space>
  )

  const playersTeamB = (teamB, accentColor) => (
    <Space orientation="vertical" size={6} style={{ width: '100%' }}>
      {Object.values(teamB).map((p) => (
        <div key={p?._id} style={{
          padding: "5px 8px",
          borderRadius: 6,
          background: colors.white,
          borderLeft: `3px solid ${accentColor}`,
          boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
          height: 28,           
          display: "flex",
          alignItems: "center"
        }}>
          <Text
            style={{
              fontSize: 13,
              color: colors.textPrimary,
              display: 'block',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              maxWidth: '100%'
            }}
          >
            {p?.name} {p?.lastname}
          </Text>
        </div>
      ))}
    </Space>
  )

  return (
    <Card
      size="small"
      style={{
        width: "100%",
        borderRadius: 12,
        background: colors.bgSoft,
        boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
      }}
      title={
        <Flex vertical>
          <Text strong style={{ color: colors.navy, fontSize: 14 }}>
            Court {match.court} · Round {match.round}
          </Text>
        </Flex>
      }
    >
      <Row align="middle">
        {/* TEAM A */}
        <Col span={10}>
          <Title level={5} style={{ marginBottom: 8, color: colors.blue }}>
            Team A
          </Title>
          {playersTeamA(match.teamA, colors.blue)}
        </Col>

        {/* VS */}
        <Col
          span={4}
          style={{
            textAlign: "center",
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: 600
          }}
        >
          VS
        </Col>

        {/* TEAM B */}
        <Col span={10}>
          <Title level={5} style={{ marginBottom: 8, color: colors.green }}>
            Team B
          </Title>
          {playersTeamB(match.teamB, colors.blue)}
        </Col>
      </Row>

      <Divider style={{ margin: "12px 0" }} />

      {/* AVG NTRP PILLS */}
      <Flex justify="center" gap={12}>
        <Tag
          style={{
            background: colors.blue,
            color: colors.white,
            border: "none",
            padding: "4px 14px",
            fontSize: 12,
            borderRadius: 16
          }}
        >
          Avg NTRP Team A: <strong>{match?.averageNTRPA.toFixed(1)}</strong>
        </Tag>

        <Tag
          style={{
            background: colors.green,
            color: colors.white,
            border: "none",
            padding: "4px 14px",
            fontSize: 12,
            borderRadius: 16
          }}
        >
          Avg NTRP Team B: <strong>{match?.averageNTRPB.toFixed(1)}</strong>
        </Tag>
      </Flex>
    </Card>
  );
};

export default MatchDetails;
