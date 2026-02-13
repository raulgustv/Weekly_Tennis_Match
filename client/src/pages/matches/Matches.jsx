
import CreateMatchForm from '../../components/matches/CreateMatchForm';
import UpComingMatches from '../../components/matches/UpComingMatches';
import { useMatches } from '../../context/MatchContext'
import {  Row, Col } from 'antd';

const Matches = () => {

  const { matches, fetchMatches, loadMatches } = useMatches();

  const matchLimit = [...matches]
                      .filter(m => m.status === 'Open')
                      .sort((a,b) => new Date(a.date) - new Date(b.date))
                      .slice(0, 2)

  //const { Title, Text } = Typography;

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        {/* <Title level={3} style={{ marginBottom: 0 }}>
          Create matches
        </Title>
        <Text type="secondary">
          Create and organize new tennis matches
        </Text> */}

        <Row gutter={[24, 24]}>
          <Col span={16}>
            <CreateMatchForm refreshMatches={fetchMatches} />
          </Col>

          <Col span={8}>
            <UpComingMatches  matches={matchLimit} loadMatches={loadMatches} />
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Matches
