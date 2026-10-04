import RankingHeader from '../../components/SeasonRanking/RankingHeader'
import { useAuth } from '../../context'
import RankedUser from '../../components/SeasonRanking/RankedUser'
import { Grid, Tabs } from 'antd' // [CAMBIO] añadido Tabs (pestañas para jugadores inscritos)
import RankRegisterForm from '../../components/SeasonRanking/RankRegisterForm'
// [CAMBIO] NUEVO: vista del jugador (cada pestaña carga sus propios datos)
import RankingRoundMatches from '../../components/RankingUser/RankingRoundMatches'
import RankPublickStands from '../../components/RankingUser/RankingPublicStands'
import RankingMyMatch from '../../components/RankingUser/RankingMyMatch'
// [CAMBIO] NUEVO: partidos públicos de cada ronda (todos los jugadores los ven)


const RankingRegistration = () => {

    const { user, loadUser, loading } = useAuth()

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    return (
        <>
            {/* [CAMBIO] se pasa isMobile (RankingHeader ya lo aceptaba pero no se le pasaba) */}
            <RankingHeader isMobile={isMobile} />
            {
                //RANKED USERS
                // [CAMBIO] antes solo se mostraba RankedUser. Ahora 4 pestañas:
                //   My match (partido de la ronda + reportar resultado + historial)
                //   Round matches (todos los partidos de la ronda) [NUEVO]
                //   Standings (clasificación pública)
                //   My registration (RankedUser SIN cambios: datos de alta + retirarse)
                // [CAMBIO] user?.isRanked (antes user.isRanked → rompía si user era null)
                user?.isRanked && (
                    <Tabs
                        defaultActiveKey="match"
                        size={isMobile ? 'middle' : 'large'}
                        destroyOnHidden // al volver a la pestaña se recargan los datos (resultado del rival, etc.)
                        items={[
                            {
                                key: 'match',
                                label: 'My match',
                                children: <RankingMyMatch isMobile={isMobile} />
                            },
                            {
                                // [CAMBIO] NUEVO: todos los partidos publicados de la ronda
                                key: 'round-matches',
                                label: 'Round matches',
                                children: <RankingRoundMatches currentUserId={user?._id} />
                            },
                            {
                                key: 'standings',
                                label: 'Standings',
                                children: <RankPublickStands currentUserId={user?._id} />
                            },
                            {
                                key: 'registration',
                                label: 'My registration',
                                children: <RankedUser user={user} isMobile={isMobile} loadUser={loadUser} />
                            }
                        ]}
                    />
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