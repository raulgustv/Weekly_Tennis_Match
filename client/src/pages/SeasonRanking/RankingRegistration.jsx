    import RankingHeader from '../../components/SeasonRanking/RankingHeader'
    import { useAuth } from '../../context'
    import RankedUser from '../../components/SeasonRanking/RankedUser'
    import { Grid, Tabs } from 'antd' // [CAMBIO] añadido Tabs (pestañas para jugadores inscritos)
    import RankRegisterForm from '../../components/SeasonRanking/RankRegisterForm'
    // CHANGE (NUEVO): aviso para jugadores expulsados del ranking por un admin
    import RankingRemovedNotice from '../../components/SeasonRanking/RankingRemovedNotice'
    // [CAMBIO] NUEVO: vista del jugador (cada pestaña carga sus propios datos)
    import RankingRoundMatches from '../../components/RankingUser/RankingRoundMatches'
    import RankPublickStands from '../../components/RankingUser/RankingPublicStands'
    import RankingMyMatch from '../../components/RankingUser/RankingMyMatch'
    // [CAMBIO] NUEVO: partidos públicos de cada ronda (todos los jugadores los ven)
    // [CAMBIO] NUEVO: página "under construction" (misma ruta que usabas en RankingRounds;
    // ajústala si RankingConstruction.jsx no está en la misma carpeta que este archivo)
    //import RankingConstruction from './RankingConstruction'
    import RankingRegisteredPlayers from '../../components/RankingUser/RankingRegisteredPlayers'
import RankingRulesDownload from '../../components/Ranking/RankingRulesDownload'




    const RankingRegistration = () => {

        const { user, loadUser, loading } = useAuth()

        const { useBreakpoint } = Grid;
        const screens = useBreakpoint();
        const isMobile = !screens.md;


        // CHANGE (NUEVO): expulsado del ranking por un admin. Tiene prioridad sobre todo lo demás:
        // ni pestañas ni formulario de inscripción. (El servidor también lo bloquea.)
        const isRemoved = !!user?.rankingBan?.active

        return (
            <>
                {/* [CAMBIO] se pasa isMobile (RankingHeader ya lo aceptaba pero no se le pasaba) */}
                <RankingHeader isMobile={isMobile} />

                <div style={{marginBottom: '6px'}}>
                    <RankingRulesDownload />
                </div>

                {/* CHANGE (NUEVO): REMOVED USERS — nota con el motivo en lugar del formulario */}
                {
                    isRemoved && (
                        <RankingRemovedNotice ban={user.rankingBan} isMobile={isMobile} />
                    )
                }

                {
                    //RANKED USERS
                    // [CAMBIO] antes solo se mostraba RankedUser. Ahora 4 pestañas:
                    //   My match (partido de la ronda + reportar resultado + historial)
                    //   Round matches (todos los partidos de la ronda) [NUEVO]
                    //   Standings (clasificación pública)
                    //   My registration (RankedUser SIN cambios: datos de alta + retirarse)
                    // [CAMBIO] user?.isRanked (antes user.isRanked → rompía si user era null)
                    // CHANGE (NUEVO): + !isRemoved
                    user?.isRanked && !isRemoved && (
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
                                    // 🟢 NUEVO: jugadores inscritos (GET /ranking/registered)
                                    key: 'players',
                                    label: 'Players',
                                    children: <RankingRegisteredPlayers currentUserId={user?._id} />
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
                    // CHANGE (NUEVO): + !isRemoved (un expulsado no ve el formulario)
                    !user?.isRanked && !isRemoved && (
                    <RankRegisterForm user={user} loading={loading} loadUser={loadUser} isMobile={isMobile} />
                    )
                }



            </>
        )
    }

    export default RankingRegistration