import { Result, Button, Typography, Space, Tag, theme } from "antd";
import { ArrowLeftOutlined, HomeOutlined, ToolOutlined } from "@ant-design/icons";
// [ASSUMPTION] The project uses react-router-dom (v6+). If not, replace
// useNavigate with your own navigation and adjust the two button handlers.
import { useNavigate } from "react-router-dom";

const { Text } = Typography;

// [NEW] Tennis palette (ball yellow, court green, clay, white lines)
const COLORS = {
  ball: "#D4E157",
  ballSeam: "#FFFFFF",
  court: "#2E7D32",
  courtDark: "#1B5E20",
  clay: "#C1663B",
  line: "#FFFFFF",
};

// [NEW] Static animation CSS (constant string, no interpolation of user data)
const ANIMATION_CSS = `
@keyframes uc-ball-bounce {
  0%   { transform: translate(-70px, -60px); }
  25%  { transform: translate(-35px, 0px); }
  50%  { transform: translate(0px, -45px); }
  75%  { transform: translate(35px, 0px); }
  100% { transform: translate(70px, -60px); }
}
@keyframes uc-ball-shadow {
  0%, 50%, 100% { transform: scale(0.6); opacity: 0.25; }
  25%, 75%      { transform: scale(1);   opacity: 0.45; }
}
.uc-ball      { animation: uc-ball-bounce 2.4s ease-in-out infinite alternate; transform-box: fill-box; }
.uc-shadow    { animation: uc-ball-shadow 1.2s ease-in-out infinite; transform-origin: center; transform-box: fill-box; }
@media (prefers-reduced-motion: reduce) {
  .uc-ball, .uc-shadow { animation: none; }
}
`;

// [NEW] Inline SVG illustration: mini tennis court + bouncing ball.
// Kept inside this same file on purpose (only used here, the user asked for
// a single general page, not one file per piece).
// [CHANGED] Converted from function declaration to arrow function
const CourtIllustration = () => {
  return (
    <svg
      width="260"
      height="170"
      viewBox="0 0 260 170"
      role="img"
      aria-label="Tennis ball bouncing on a court"
    >
      {/* Court surface */}
      <rect x="20" y="95" width="220" height="60" rx="6" fill={COLORS.court} />
      <rect x="20" y="95" width="220" height="60" rx="6" fill="none" stroke={COLORS.line} strokeWidth="2" />
      {/* Service lines */}
      <line x1="60" y1="95" x2="60" y2="155" stroke={COLORS.line} strokeWidth="1.5" />
      <line x1="200" y1="95" x2="200" y2="155" stroke={COLORS.line} strokeWidth="1.5" />
      <line x1="60" y1="125" x2="200" y2="125" stroke={COLORS.line} strokeWidth="1.5" />
      {/* Net */}
      <rect x="128" y="78" width="4" height="80" fill={COLORS.courtDark} />
      <line x1="130" y1="80" x2="130" y2="155" stroke={COLORS.line} strokeWidth="1" strokeDasharray="3 3" />
      {/* Ball shadow */}
      <ellipse className="uc-shadow" cx="130" cy="112" rx="14" ry="4" fill="#000" />
      {/* Ball */}
      <g className="uc-ball">
        <circle cx="130" cy="88" r="14" fill={COLORS.ball} />
        <path d="M118 80 Q130 88 118 96" fill="none" stroke={COLORS.ballSeam} strokeWidth="2" strokeLinecap="round" />
        <path d="M142 80 Q130 88 142 96" fill="none" stroke={COLORS.ballSeam} strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}; // [CHANGED] arrow function closing

// [CHANGED] Converted from "export default function" to arrow function;
// default export moved to the end of the file
const UnderConstruction = ({ section }) => {
  const navigate = useNavigate();
  const { token } = theme.useToken(); // [NEW] respects the app's AntD theme (light/dark)

  // [NEW] Title adapts if a section name is passed. React escapes the string,
  // so passing any text here is safe.
  const title = section
    ? `${section} is currently under construction`
    : "Currently under construction";

  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        // Subtle clay-to-grass background
        background: `linear-gradient(160deg, ${token.colorBgLayout} 0%, ${token.colorBgContainer} 100%)`,
      }}
    >
      <style>{ANIMATION_CSS}</style>

      <div
        style={{
          width: "100%",
          maxWidth: 640,
          background: token.colorBgContainer,
          borderRadius: token.borderRadiusLG * 2,
          boxShadow: token.boxShadowTertiary,
          borderTop: `6px solid ${COLORS.court}`,
          overflow: "hidden",
        }}
      >
        <Result
          icon={<CourtIllustration />}
          title={title}
          subTitle={
            <Space orientation="vertical" size={8}>
              <Text type="secondary">
                We're warming up on the baseline. This section will be ready
                before match point.
              </Text>
              <Space size={[4, 8]} wrap style={{ justifyContent: "center" }}>
                <Tag icon={<ToolOutlined />} color="green">
                  Work in progress
                </Tag>
                <Tag color="orange">Coming soon</Tag>
              </Space>
            </Space>
          }
          extra={
            <Space wrap style={{ justifyContent: "center" }}>
              <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
                Go back
              </Button>
              <Button
                type="primary"
                icon={<HomeOutlined />}
                onClick={() => navigate("/")}
                style={{ background: COLORS.court, borderColor: COLORS.court }}
              >
                Back to home
              </Button>
            </Space>
          }
        />
        {/* Bottom clay strip as a court accent */}
        <div style={{ height: 6, background: COLORS.clay }} />
      </div>
    </div>
  );
}; // [CHANGED] arrow function closing

// [CHANGED] Default export moved here (was inline "export default function")
export default UnderConstruction;