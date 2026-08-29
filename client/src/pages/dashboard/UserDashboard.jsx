import { useMatches } from "../../context/MatchContext"
import { useAuth } from "../../context/AuthContext"
import JoinMatch from "../../components/matches/JoinMatch";
import { Button, Space, Spin, Typography } from "antd";
import { ReloadOutlined } from "@ant-design/icons";
import "../../styles/Loader.css";
import TennisLoader from "../../components/Animations/TennisLoader";

const { Title } = Typography;

const UserDashboard = () => {

  const { openMatches, loadOpenMatches, fetchOpenMatches } = useMatches();
  const { user } = useAuth();

  const openMatch = openMatches.filter(
    (match) => match.status !== "Played"  
  );

  return (
    <>
      <Space
        style={{
          width: "100%",
          justifyContent: "space-between",
          marginBottom: 20,
          alignItems: "center",
        }}
      >
        <Space align="center" size={16}>
          <Title level={3} style={{ margin: 0 }}>
            🎾 Open Matches
          </Title>

          {user?.isVerified && (
            <Typography.Text
              type="secondary"
              style={{ fontSize: 13 }}
            >
              Not in our WhatsApp group?{" "}
              <Typography.Link
                href="https://chat.whatsapp.com/DHGAmc9sI1nHG8iX8UsPH2?s=cl&p=a&mlu=4"
                target="_blank"
                rel="noopener noreferrer"
              >
                Join us here
              </Typography.Link>
            </Typography.Text>
          )}
        </Space>

        <Button
          type="primary"
          icon={<ReloadOutlined spin={loadOpenMatches} />}
          size="large"
          style={{
            background: "linear-gradient(135deg, #7CB342 0%, #43A047 100%)",
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
          onClick={() => {
            fetchOpenMatches();
          }}
        >
          {loadOpenMatches ? "Refreshing..." : "Refresh games"}
        </Button>
      </Space>

      <Spin
        spinning={loadOpenMatches}
        description="Obtaining matches..."
        indicator={<TennisLoader />}
      >
        <JoinMatch
          openMatches={openMatch}
          loading={loadOpenMatches}
          fetchMatches={fetchOpenMatches}
        />
      </Spin>
    </>
  );
};

export default UserDashboard;