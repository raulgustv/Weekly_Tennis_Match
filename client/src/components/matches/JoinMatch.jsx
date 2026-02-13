import { Card, Col, Row } from 'antd'
import MatchSummaryTabs from './MatchSummaryTabs'
import { joinMatch, leaveMatch } from '../../actions/matches'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'


const JoinMatch = ({ openMatches, loading, fetchMatches }) => {



    const handleJoin = async (id, backup) => {

        try {
            const data = await joinMatch(id, backup)

            toast.success(`Joined match for ${dayjs(data?.match?.date).format("DD-MM-YYYY")} as ${data?.role}`)

            fetchMatches()

        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    }

    const handleLeave = async (id) => {
        try {

            await (leaveMatch(id))

            toast.success('Successfully left the match')

            fetchMatches()

        } catch (error) {
            console.log(error)
            toast.error(error?.response?.data?.message)
        }
    }

    return (
        <>
            <Row gutter={16}>
                {
                    openMatches.map((match) => (
                        <Col key={match._id} span={8}>
                            <Card title="Upcoming matches"
                                loading={loading}
                                style={{ width: '100%', marginBottom: 12 }}
                            >
                                <MatchSummaryTabs matchSummary={match} showJoinButton={true} onJoin={handleJoin} onLeave={handleLeave} />

                            </Card>
                        </Col>
                    ))
                }
            </Row>
        </>
    )
}

export default JoinMatch