import { useMatches } from "../../context/MatchContext"
import JoinMatch from "../../components/matches/JoinMatch";

const UserDashboard = () => {

  const { openMatches, loadOpenMatches, fetchOpenMatches } = useMatches();

  // const openMatches = [...matches]
  //   .filter(m => m.status === 'Open' || m.status === 'Full' || m.status === 'Ready'  )
  //   .sort((a, b) => new Date(a.date) - new Date(b.date))

  return (
    <>
      <JoinMatch openMatches={openMatches} loading={loadOpenMatches} fetchMatches={fetchOpenMatches} />
    </>
  )
}

export default UserDashboard
