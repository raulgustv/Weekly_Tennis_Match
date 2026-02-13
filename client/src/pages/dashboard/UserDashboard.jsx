import { useMatches } from "../../context/MatchContext"
import JoinMatch from "../../components/matches/JoinMatch";

const UserDashboard = () => {

  const { matches, loadMatches, fetchMatches } = useMatches();

  const openMatches = [...matches]
    .filter(m => m.status === 'Open' || m.status === 'Full' || m.status === 'Ready'  )
    .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <>
      <JoinMatch openMatches={openMatches} loading={loadMatches} fetchMatches={fetchMatches} />
    </>
  )
}

export default UserDashboard
