import { Card, Row, Col, theme, Grid } from "antd";

const { useBreakpoint } = Grid;

const StatsCard = ({
  title,
  icon,
  children,
  accent = "primary",
}) => {
  const { token } = theme.useToken();
  const screens = useBreakpoint();
  const isMobile = !screens.sm;

  const accentMap = {
    primary: token.colorPrimary,
    success: token.colorSuccess,
    warning: token.colorWarning,
    info: token.colorInfo,
  };

  const accentColor = accentMap[accent] || token.colorPrimary;

  return (
    <Card
      size="small"
      variant="borderless"
      title={title}
      style={{ height: "100%" }}
      styles={{
        body: {
          height: "100%",
          borderRadius: token.borderRadiusLG,
          borderTop: `4px solid ${accentColor}`,
          background: token.colorBgContainer,
          boxShadow: `0 4px 12px ${token.colorFillSecondary}`,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: token.paddingLG,
        },
      }}
    >
      <Row
        align="middle"
        gutter={12}
        style={{ flex: 1 }}
        justify={isMobile ? "center" : "start"}
      >
        {/* ICON */}
        <Col
          flex={isMobile ? "none" : "44px"}
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: isMobile ? 8 : 0,
          }}
        >
          <div
            style={{
              width: isMobile ? 36 : 44,
              height: isMobile ? 36 : 44,
              borderRadius: "50%",
              background: token.colorFillSecondary,
              color: accentColor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: isMobile ? 18 : 22,
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        </Col>

        {/* CONTENT */}
        <Col
          flex="auto"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          {children}
        </Col>
      </Row>
    </Card>
  );
};

export default StatsCard;
