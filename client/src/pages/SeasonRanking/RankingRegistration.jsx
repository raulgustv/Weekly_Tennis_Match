import RankingHeader from '../../components/SeasonRanking/RankingHeader'
import { useAuth } from '../../context'
import RankedUser from '../../components/SeasonRanking/RankedUser'
import { Grid } from 'antd'
import RankRegisterForm from '../../components/SeasonRanking/RankRegisterForm'


const RankingRegistration = () => {

    const { user, loadUser, loading } = useAuth()

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    return (
        <>
            <RankingHeader />
            {
                //RANKED USERS
                user.isRanked && (
                    <RankedUser user={user} isMobile={isMobile} loadUser={loadUser} />
                )
            }

            {/* Not registerd */}
            {
                !user?.isRanked && (
                <RankRegisterForm user={user} loading={loading} loadUser={loadUser} isMobile={isMobile} />
                )
            }



        </>
    )
}

export default RankingRegistration