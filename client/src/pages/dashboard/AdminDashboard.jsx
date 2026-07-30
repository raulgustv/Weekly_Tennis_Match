import { Row, Col, Empty, Space, Typography, Button, Spin } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

import WeatherCard from "../../components/common/WeatherCard";
import UpComingMatches from "../../components/matches/UpComingMatches";
import PendingTransactions from "../../components/wallet/PendingTransactions";
import TennisLoader from "../../components/Animations/TennisLoader";

import { useMatches } from "../../context/MatchContext";
import { usePendingTransactions } from "../../hooks/useTransactions";

const { Title } = Typography;

const AdminDashboard = () => {

  const {
    openMatches,
    loadOpenMatches,
    fetchOpenMatches,
  } = useMatches();

  const {
    pendingTransactions,
    loadPendingTransactions,
    setLoadPendingTransactions,
    fetchPendingTransactions,
  } = usePendingTransactions();

  const upcomingMatches = openMatches.filter(
    (m) => m?.status !== "Played"
  );

  const loading = loadOpenMatches || loadPendingTransactions;

  const refreshDashboard = async () => {
    await Promise.all([
      fetchOpenMatches(),
      fetchPendingTransactions(),
    ]);
  };

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
        <Title level={3} style={{ margin: 0 }}>
          🛠️ Admin Dashboard
        </Title>

        <Button
          type="primary"
          icon={<ReloadOutlined spin={loading} />}
          disabled={loading}
          onClick={refreshDashboard}
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
        >
          {loading ? "Refreshing..." : "Refresh Dashboard"}
        </Button>
      </Space>

      <Spin
        spinning={loading}
        indicator={<TennisLoader />}
      >
        <Row gutter={[16, 16]}>
          <Col lg={8} md={12} sm={16} xs={24}>
            <WeatherCard />
          </Col>

          <Col lg={8} md={12} sm={16} xs={24}>
            {upcomingMatches.length === 0 ? (
              <Empty description="No upcoming matches available" />
            ) : (
              <UpComingMatches
                matches={upcomingMatches}
                loadMatches={loadOpenMatches}
              />
            )}
          </Col>

          <Col lg={8} md={12} sm={16} xs={24}>
            <PendingTransactions
              transactions={pendingTransactions}
              setLoading={setLoadPendingTransactions}
              fetchTransactions={fetchPendingTransactions}
            />
          </Col>
        </Row>
      </Spin>
    </>
  );
};

export default AdminDashboard;