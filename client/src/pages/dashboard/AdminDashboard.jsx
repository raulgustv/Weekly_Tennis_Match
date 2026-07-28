import { Row, Col, Empty } from "antd"
import WeatherCard from "../../components/common/WeatherCard"
import UpComingMatches from "../../components/matches/UpComingMatches"
import { useMatches } from "../../context/MatchContext"
import PendingTransactions from "../../components/wallet/PendingTransactions"
import { usePendingTransactions } from "../../hooks/useTransactions"
import FeedbackModal from "../../components/modals/FeedbackModal"


const AdminDashboard = () => {

  const { matches, loadMatches } = useMatches();
  const { pendingTransactions, setLoadPendingTransactions , fetchPendingTransactions} = usePendingTransactions()

  const upcomingMatches = matches.filter((m) => m?.status === 'Open')

  return (
    <>
      <Row gutter={[16, 16]} >
        <Col lg={8} md={12} sm={16} xs={24}  >
          <WeatherCard />
        </Col>
        <Col lg={8} md={12} sm={16} xs={24}   >
          {
            upcomingMatches.length === 0 ? (
              <Empty description="No up coming matches available" />) : (
              <UpComingMatches matches={upcomingMatches} loadMatches={loadMatches} />
            )
          }
        </Col>
        <Col lg={8} md={12} sm={16} xs={24}>
          <PendingTransactions
            transactions={pendingTransactions}
            setLoading={setLoadPendingTransactions}
            fetchTransactions={fetchPendingTransactions}
          />
        </Col>
      </Row>

      {/* <FeedbackModal open={true} /> */}
    </>
  )
}

export default AdminDashboard
