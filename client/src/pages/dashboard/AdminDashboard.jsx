import { Row, Col, Empty } from "antd"
import WeatherCard from "../../components/common/WeatherCard"
import UpComingMatches from "../../components/matches/UpComingMatches"
import { useMatches } from "../../context/MatchContext"


const AdminDashboard = () => {

  const {matches, loadMatches} = useMatches();

  const upcomingMatches = matches.filter((m) => m?.status === 'Open')

  return (
    <>
      <Row gutter={[16, 16]} >
        <Col lg={8} md={12} sm={16} xs={24}  >
          <WeatherCard />
        </Col>
        <Col lg={8} md={12} sm={16} xs={24}   >
          {
            upcomingMatches.length ===  0 ? (
            <Empty description="No up coming matches available" /> ) : (
          <UpComingMatches matches={upcomingMatches} loadMatches={loadMatches} /> 
            )
          }
        </Col>
      </Row>
    </>
  )
}

export default AdminDashboard
