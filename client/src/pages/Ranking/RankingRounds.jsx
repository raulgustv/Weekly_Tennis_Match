import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Flex, Tabs } from "antd"; // [CAMBIO] añadido Tabs (pestañas Matches / Standings)
import { toast } from "react-toastify";
import { activateSeason, discardRound, getRoundOverview, proposeRound, publishRound } from "../../actions/ranking";
import RankingStandingsTable from "../../components/Ranking/RankingStandingsTable";
import RankingRoundMatchList from "../../components/Ranking/RankingRoundList";
import RankingRoundHeader from "../../components/Ranking/RankingRoundHeader";
import RankingAdminResultModal from "../../components/modals/RankingAdminResultModal";
import RankingRoundCloseModal from "../../components/modals/RankingRoundCloseModal";


const getErrorMessage = (error, fallback) => {
    const data = error?.response?.data;
    if (Array.isArray(data)) return data[0]?.msg || fallback;
    return data?.message || fallback;
};

const EMPTY_OVERVIEW = {
    season: null,
    rounds: [],
    selectedRound: null,
    matches: [],
    unpaired: [],
    pendingRound: null,
    openRound: null,
    standings: [],      // [NUEVO]
    pendingPlayers: [], // [NUEVO]
};

const RankingRounds = () => {
    const { id: seasonId } = useParams();
    const navigate = useNavigate();

    const [overview, setOverview] = useState(EMPTY_OVERVIEW);
    const [requestedRound, setRequestedRound] = useState(null); // null = última ronda
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [actionLoading, setActionLoading] = useState(null);
    const [reloadKey, setReloadKey] = useState(0);
    const [activeTab, setActiveTab] = useState("matches"); // [NUEVO] pestaña visible
    const [editingMatch, setEditingMatch] = useState(null);
    const [closeDateOpen, setCloseDateOpen] = useState(false); // [CAMBIO] NUEVO: modal de fecha de cierre // [CAMBIO] NUEVO: partido cuyo resultado edita el admin

    // Recarga forzada tras una acción (propose/publish/discard/activate)
    const reload = useCallback((round = null) => {
        setRequestedRound(round);
        setReloadKey((k) => k + 1);
    }, []);

    useEffect(() => {
        let active = true;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getRoundOverview(seasonId, requestedRound);
                if (active) setOverview({ ...EMPTY_OVERVIEW, ...data });
            } catch (err) {
                if (active) setError(getErrorMessage(err, "Could not load the rounds. Please try again."));
            } finally {
                if (active) setLoading(false);
            }
        };

        load();
        return () => {
            active = false;
        };
    }, [seasonId, requestedRound, reloadKey]);

    // Ejecuta una acción, muestra el toast y recarga. `nextRound` = ronda a mostrar después.
    const runAction = async (key, request, fallbackError, nextRound = null) => {
        setActionLoading(key);
        try {
            const data = await request();
            toast.success(data?.message || "Done");
            reload(nextRound);
        } catch (err) {
            toast.error(getErrorMessage(err, fallbackError));
            reload(overview.selectedRound); // por si el estado cambió en el servidor (otro admin, el cron...)
        } finally {
            setActionLoading(null);
        }
    };

    const handlePropose = () =>
        runAction("propose", () => proposeRound(seasonId), "Could not propose the round");

    const handlePublish = () =>
        runAction(
            "publish",
            () => publishRound(seasonId, overview.pendingRound),
            "Could not publish the round",
            overview.pendingRound
        );

    const handleDiscard = () =>
        runAction("discard", () => discardRound(seasonId, overview.pendingRound), "Could not discard the proposal");

    const handleActivate = () =>
        runAction("activate", () => activateSeason(seasonId), "Could not activate the season");

    return (
        <Flex vertical gap={24}>
            <RankingRoundHeader
                season={overview.season}
                rounds={overview.rounds}
                selectedRound={overview.selectedRound}
                pendingRound={overview.pendingRound}
                openRound={overview.openRound}
                actionLoading={actionLoading}
                onBack={() => navigate("/admin/seasons")}
                onSelectRound={(round) => setRequestedRound(round)}
                onPropose={handlePropose}
                onPublish={handlePublish}
                onDiscard={handleDiscard}
                onActivate={handleActivate}
                onEditCloseDate={() => setCloseDateOpen(true)} // [CAMBIO] NUEVO
            />

            {/* [CAMBIO] Antes solo se mostraba RankingRoundMatchList. Ahora dos pestañas:
                partidos de la ronda seleccionada y clasificación de la temporada. */}
            <Tabs
                activeKey={activeTab}
                onChange={setActiveTab}
                size="large"
                items={[
                    {
                        key: "matches",
                        label: "Matches",
                        children: (
                            <RankingRoundMatchList
                                matches={overview.matches}
                                unpaired={overview.unpaired}
                                selectedRound={overview.selectedRound}
                                loading={loading}
                                error={error}
                                // [CAMBIO] NUEVO: solo en la temporada activa (el servidor también lo exige)
                                onEditResult={overview.season?.status === "active" ? setEditingMatch : undefined}
                            />
                        ),
                    },
                    {
                        key: "standings",
                        // [NUEVO] contador de jugadores en la clasificación
                        label: `Standings${loading ? "" : ` (${overview.standings.length})`}`,
                        children: (
                            <RankingStandingsTable
                                standings={overview.standings}
                                pendingPlayers={overview.pendingPlayers}
                                loading={loading}
                                error={error}
                            />
                        ),
                    },
                ]}
            />

            {/* [CAMBIO] NUEVO: cambiar la fecha de cierre; al guardar se recarga (la cabecera muestra la nueva fecha) */}
            {closeDateOpen && overview.season && (
                <RankingRoundCloseModal
                    key={`${overview.season._id}-${overview.season.nextRoundCloseDate}`}
                    open
                    season={overview.season}
                    onClose={() => setCloseDateOpen(false)}
                    onSaved={() => {
                        setCloseDateOpen(false);
                        reload(overview.selectedRound);
                    }}
                />
            )}

            {/* [CAMBIO] NUEVO: al guardar se recarga la misma ronda (resultado + clasificación) */}
            {editingMatch && (
                <RankingAdminResultModal
                    key={editingMatch._id}
                    open
                    match={editingMatch}
                    onClose={() => setEditingMatch(null)}
                    onSaved={() => {
                        setEditingMatch(null);
                        reload(overview.selectedRound);
                    }}
                />
            )}
        </Flex>
    );
};

export default RankingRounds;