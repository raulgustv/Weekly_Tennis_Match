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
// [CAMBIO] NUEVO: página "under construction" (misma ruta que usabas en RankingRounds;
// ajústala si RankingConstruction.jsx no está en la misma carpeta que este archivo)
import RankingConstruction from './RankingConstruction'

// [CAMBIO] NUEVO: false = los jugadores ven "under construction". Cambiar a true al lanzar.
// Solo oculta la UI en el navegador: la API del ranking debe seguir protegida en el servidor.
const RELEASE_READY = false;


const RankingRegistration = () => {

    const { user, loadUser, loading } = useAuth()

    const { useBreakpoint } = Grid;
    const screens = useBreakpoint();
    const isMobile = !screens.md;

    // [CAMBIO] NUEVO: retorno temprano DESPUÉS de los hooks (las reglas de hooks exigen
    // llamarlos siempre en el mismo orden). Así las pestañas no se montan y no hacen peticiones.
    if (!RELEASE_READY) {
        return <RankingConstruction section="Season ranking" />
    }

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