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
import ProfilePicture from "../uploads/ProfilePicture";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const MatchDetails = ({ match }) => {
  const screens = useBreakpoint();

  const renderPlayers = (team, accentColor) => (
    <Space
      orientation="vertical"
      size={4}
      style={{ width: "100%" }}
    >
      {Object.values(team).map((p) => (
        <div
          key={p?._id}
          style={{
            padding: "4px 7px",
            minHeight: 36,
            borderRadius: 7,
            background: colors.white,
            borderLeft: `3px solid ${accentColor}`,
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            display: "flex",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <ProfilePicture
            user={p}
            editable={false}
            profilePicture={p?.profilePicture?.url}
            size={26}
          />

          <Text
            style={{
              fontSize: 12,
              lineHeight: "16px",
              color: colors.textPrimary,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              width: "100%",
              marginLeft: 6,
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
        borderRadius: 12,
        background: colors.bgSoft,
        boxShadow: "0 4px 10px rgba(0,0,0,0.07)",
      }}
      styles={{
        header: {
          minHeight: 36,
          padding: "6px 12px",
        },
        body: {
          padding: screens.xs ? "10px" : "12px",
        },
      }}
      title={
        <Text
          strong
          style={{
            color: colors.navy,
            fontSize: 13,
          }}
        >
          Court {match.court} · Round {match.round}
        </Text>
      }
    >
      <Row
        gutter={[screens.xs ? 6 : 10, 6]}
        align="top"
      >
        {/* TEAM A */}
        <Col xs={11} sm={10}>
          <Title
            level={5}
            style={{
              margin: "0 0 5px",
              color: colors.blue,
              fontSize: 13,
              lineHeight: "18px",
            }}
          >
            Team A
          </Title>

          {renderPlayers(match.teamA, colors.blue)}
        </Col>

        {/* VS */}
        <Col
          xs={2}
          sm={4}
          style={{
            textAlign: "center",
            color: colors.textSecondary,
            fontSize: 11,
            fontWeight: 700,
            alignSelf: "center",
          }}
        >
          {screens.xs ? (
            <div
              style={{
                fontSize: 10,
                fontWeight: 700,
              }}
            >
              VS
            </div>
          ) : (
            "VS"
          )}
        </Col>

        {/* TEAM B */}
        <Col xs={11} sm={10}>
          <Title
            level={5}
            style={{
              margin: "0 0 5px",
              color: colors.green,
              fontSize: 13,
              lineHeight: "18px",
            }}
          >
            Team B
          </Title>

          {renderPlayers(match.teamB, colors.green)}
        </Col>
      </Row>

      <Divider
        style={{
          margin: screens.xs ? "9px 0" : "12px 0",
        }}
      />

      {/* AVG NTRP */}
      <Flex
        justify="center"
        gap={6}
        wrap="wrap"
      >
        <Tag
          style={{
            background: colors.blue,
            color: colors.white,
            border: "none",
            padding: "3px 9px",
            marginInlineEnd: 0,
            fontSize: 11,
            lineHeight: "18px",
            borderRadius: 14,
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
            padding: "3px 9px",
            marginInlineEnd: 0,
            fontSize: 11,
            lineHeight: "18px",
            borderRadius: 14,
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