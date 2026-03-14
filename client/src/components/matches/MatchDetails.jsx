import {
  Card,
  Col,
  Divider,
  Row,
  Tag,
  Typography,
  Space,
  Flex,
  Grid,
} from "antd";
import colors from "../../themes/colors";
import ProfilePicture from '../uploads/ProfilePicture'

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const MatchDetails = ({ match }) => {
  const screens = useBreakpoint();



  const renderPlayers = (team, accentColor) => (
    <Space
      orientation="vertical"
      size={6}
      style={{ width: "100%" }}
    >
      {Object.values(team).map((p) => (
        <div
          key={p?._id}
          style={{
            padding: "6px 10px",
            borderRadius: 8,
            background: colors.white,
            borderLeft: `3px solid ${accentColor}`,
            boxShadow:
              "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <ProfilePicture user={p} editable={false } profilePicture={p?.profilePicture?.url} size={28} />
          
          <Text
            style={{
              fontSize: 13,
              color: colors.textPrimary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
              marginLeft: 2
            }}
          >
            {p?.name} {p?.lastname[0]}
          </Text>
        </div>
      ))}
    </Space>
  );

  return (
    <Card
      size="small"
      style={{
        width: "100%",
        borderRadius: 14,
        background: colors.bgSoft,
        boxShadow:
          "0 6px 14px rgba(0,0,0,0.08)",
      }}
      title={
        <Flex direction="vertical">
          <Text
            strong
            style={{
              color: colors.navy,
              fontSize: 14,
            }}
          >
            Court {match.court} · Round {match.round}
          </Text>
        </Flex>
      }
    >
      <Row
        gutter={[16, 16]}
        align="top"
      >
        {/* TEAM A */}
        <Col xs={24} sm={10}>
          <Title
            level={5}
            style={{
              marginBottom: 8,
              color: colors.blue,
            }}
          >
            Team A
          </Title>
          {renderPlayers(
            match.teamA,
            colors.blue
          )}
        </Col>

        {/* VS */}
        <Col
          xs={24}
          sm={4}
          style={{
            textAlign: "center",
            color: colors.textSecondary,
            fontSize: 14,
            fontWeight: 600,
            alignSelf: "center",
          }}
        >
          {screens.xs ? (
            <Divider>VS</Divider>
          ) : (
            "VS"
          )}
        </Col>

        {/* TEAM B */}
        <Col xs={24} sm={10}>
          <Title
            level={5}
            style={{
              marginBottom: 8,
              color: colors.green,
            }}
          >
            Team B
          </Title>
          {renderPlayers(
            match.teamB,
            colors.green
          )}
        </Col>
      </Row>

      <Divider style={{ margin: "16px 0" }} />

      {/* AVG NTRP */}
      <Flex
        justify="center"
        gap={12}
        wrap="wrap"
      >
        <Tag
          style={{
            background: colors.blue,
            color: colors.white,
            border: "none",
            padding: "6px 16px",
            fontSize: 12,
            borderRadius: 20,
          }}
        >
          Avg NTRP A:{" "}
          <strong>
            {match?.averageNTRPA?.toFixed(1)}
          </strong>
        </Tag>

        <Tag
          style={{
            background: colors.green,
            color: colors.white,
            border: "none",
            padding: "6px 16px",
            fontSize: 12,
            borderRadius: 20,
          }}
        >
          Avg NTRP B:{" "}
          <strong>
            {match?.averageNTRPB?.toFixed(1)}
          </strong>
        </Tag>
      </Flex>
    </Card>
  );
};

export default MatchDetails;
