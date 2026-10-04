import mongoose from "mongoose"; // CHANGE: faltaba — submitRankingResult usa mongoose.startSession()
import { validationResult } from "express-validator"; // CHANGE: faltaba — submitRankingResult lo usa
import Ranking from "../models/Ranking.js";
import User from "../models/user.js";
import RankingMatch from "../models/RankingMatch.js";
import Season from "../models/Season.js"; // CHANGE (NUEVO): lo usa getRoundOverview
// CHANGE (NUEVO): añadido buildMadridDateTime — lo usa getMyRankingMatch (fecha/hora de cierre de la ronda)
import { buildMadridDateTime, isAtLeast18 } from "../helpers/dateHelpers.js";
// CHANGE: añadido closeRound — closeRoundNow lo llamaba sin importarlo (ReferenceError → 500)
// CHANGE (NUEVO): añadidos findPendingProposalRound y findOpenPublishedRound (guardas de rondas)
import {
    closeRound,
    findOpenPublishedRound,
    findPendingProposalRound,
    generateRankingRoundProposal,
    resolveSeason
} from "../services/rankingServices.js";
// CHANGE: faltaba — submitRankingResult usa sumGames y computeRatingDelta sin importarlos (ReferenceError → 500)
import { computeRatingDelta, sumGames } from "../utils/rankingEngine.js";

// CHANGE: versión del reglamento aceptada. Constante en vez de string suelto
// dentro del controller; si cambia el reglamento, se sube aquí.
export const RANKING_RULES_VERSION = 'v1';

// CHANGE: solo devolvemos los campos del ranking, no el documento User entero
// (antes se devolvía `user` completo: notesHistory, walletBalance, etc. — el
// frontend no los necesita en esta respuesta y refresca con GET /user/auth).
const rankingStatusPayload = (user) => ({
    isRanked: user.isRanked,
    rankingRegisteredAt: user.rankingRegisteredAt,
    rankingRulesAccepted: user.rankingRulesAccepted,
    rankingRulesAcceptedAt: user.rankingRulesAcceptedAt,
    rankingRulesVersion: user.rankingRulesVersion
});


//registration
export const rankingRegistration = async(req, res) =>{
    try {

        const userId = req.user._id;

        const user = await User.findById(userId)

        const {acceptRankingRules, dateOfBirth} = req.body;

        // CHANGE: también rechaza cuentas borradas (isDeleted) — antes solo miraba isActive
        if(!user || !user.isActive || user.isDeleted){
             return res.status(400).json({
                ok: false,
                message: 'User not found'
            })
        }

        if(user.isRanked){
             return res.status(400).json({
                ok: false,
                // CHANGE: texto corregido ("this rank" → "the ranking")
                message: 'You are already registered for the ranking'
            })
        }

        // CHANGE: NUEVO — un usuario suspendido no puede darse de alta
        // (mismo criterio que joinMatch en controller/match.js)
        if(user.suspendedUntil && user.suspendedUntil > new Date()){
            return res.status(403).json({
                ok: false,
                message: `You are suspended and cannot register for the ranking until ${user.suspendedUntil.toLocaleDateString('es-ES')}`
            })
        }

        if(!user.ntrplvl){
             return res.status(400).json({
                ok: false,
                message: 'You must have an NTRP level to register'
            })
        }

        if(acceptRankingRules !== true){
             return res.status(400).json({
                ok: false,
                // CHANGE: typo corregido ("Pleaes")
                message: 'Please accept the ranking rules to participate'
            })
        }

        // CHANGE (SEGURIDAD): antes era `dateOfBirth || user.dateOfBirth`, es decir,
        // la fecha del body tenía PRIORIDAD sobre la guardada. Un usuario con una
        // fecha guardada de menor de 18 podía mandar otra fecha en el body, pasar
        // el check 18+ y registrarse (la fecha falsa ni siquiera se guardaba, así
        // que no quedaba rastro). Ahora, si ya hay fecha guardada, es la ÚNICA que
        // cuenta y la del body se ignora.
        const storedDob = user.dateOfBirth;
        const dob = storedDob || dateOfBirth;

        if(!dob || !isAtLeast18(dob)){
             return res.status(400).json({
                ok: false,
                message: 'You must be 18+ years old to participate'
            })
        }

        if(!storedDob){
            user.dateOfBirth = dateOfBirth;
        }

        const now = new Date();

        user.isRanked = true;
        user.rankingRegisteredAt = now;
        user.rankingRulesAccepted = true;
        user.rankingRulesAcceptedAt = now;
        user.rankingRulesVersion = RANKING_RULES_VERSION;

        await user.save();

        return res.status(200).json({
            ok: true,
            message: 'You have successfully registered for the ranking',
            // CHANGE: antes `user` (documento completo)
            ranking: rankingStatusPayload(user)
        })

        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            message: 'There was an error with your registration'
        })
    }
}

export const unRegisterRanking = async(req, res) =>{
    try {

        const userId = req.user._id;

        const user = await User.findById(userId);

        if(!user || !user.isRanked){
            return res.status(400).json({
                ok: false,
                // CHANGE: texto más claro para el usuario
                message: 'You are not registered for the ranking'
            })
        }

        user.isRanked = false;
        await user.save();

        await Ranking.updateMany(
            {userId: user._id, status: {$ne: 'retired'}},
            {$set: {status: 'retired', dateOfLeave: Date.now()}},
        )

        return res.status(200).json({
            ok: true,
            message: 'You have retired from the ranking',
            ranking: rankingStatusPayload(user) // CHANGE: NUEVO — mismo formato que el registro
        })
        
    } catch (error) {
        console.log(error) // CHANGE: antes el error se tragaba sin log
        return res.status(500).json({
            ok: false,
            message: 'Unable to retire from ranking due to an internal error'
        })
    }
}

// =====================================================================
// CHANGE (NUEVO): helpers de rondas para el flujo admin
// =====================================================================

// Mensajes que lanza resolveSeason → código HTTP correcto (antes todo era 500).
const SEASON_ERROR_STATUS = {
    'Season not found': 404,
    'There is no active season configured': 400
};

const handleSeasonError = (error, res, fallbackMessage) => {
    const status = SEASON_ERROR_STATUS[error?.message];
    if (status) {
        return res.status(status).json({ ok: false, message: error.message });
    }
    console.log(error);
    return res.status(500).json({ ok: false, message: fallbackMessage });
};

// CHANGE (NUEVO): orden de la clasificación: activos por posición, luego
// suspendidos y al final retirados.
const STANDING_STATUS_ORDER = { active: 0, suspended: 1, retired: 2 };

const publicPlayer = (user) => user
    ? { _id: user._id, name: user.name, lastname: user.lastname, profilePicture: user.profilePicture }
    : null; // usuario borrado

/**
 * CHANGE (NUEVO): clasificación actual de una temporada (solo para la vista
 * admin: incluye rating interno y puntos de penalización). Solo se envían
 * nombre, apellido y foto de cada jugador.
 */
const getSeasonStandings = async (seasonId) => {
    const docs = await Ranking.find({ season: seasonId })
        .select('userId rank rating penaltyPoints status lastRoundPlayed suspendedUntilRound')
        .populate('userId', 'name lastname profilePicture.url')
        .lean();

    return docs
        .map(r => ({
            _id: r._id,
            player: publicPlayer(r.userId),
            rank: r.rank,
            rating: r.rating,
            penaltyPoints: r.penaltyPoints ?? 0,
            status: r.status,
            lastRoundPlayed: r.lastRoundPlayed ?? 0,
            suspendedUntilRound: r.suspendedUntilRound ?? null
        }))
        .sort((a, b) =>
            (STANDING_STATUS_ORDER[a.status] ?? 3) - (STANDING_STATUS_ORDER[b.status] ?? 3) ||
            a.rank - b.rank
        );
};

/**
 * CHANGE (NUEVO): jugadores inscritos al ranking que todavía NO tienen Ranking
 * doc en esta temporada. Mismo filtro que generateRankingRoundProposal
 * ({ isRanked: true, isActive: true }), así la lista coincide exactamente con
 * quién entrará (en la última posición) en la próxima propuesta.
 */
const getPlayersPendingEntry = async (seasonId) => {
    const existingUserIds = await Ranking.find({ season: seasonId }).distinct('userId');

    const users = await User.find({
        isRanked: true,
        isActive: true,
        _id: { $nin: existingUserIds }
    })
        .select('name lastname profilePicture.url rankingRegisteredAt')
        .sort({ rankingRegisteredAt: 1 })
        .lean();

    return users.map(u => ({ ...publicPlayer(u), rankingRegisteredAt: u.rankingRegisteredAt ?? null }));
};

/**
 * CHANGE (NUEVO): GET /ranking/rounds/:seasonId?round=N (solo admin)
 * Devuelve la temporada, el resumen de todas sus rondas y los partidos de la
 * ronda seleccionada (por defecto, la última). Si la ronda es una propuesta
 * sin publicar, incluye además los jugadores elegibles que se han quedado sin
 * rival (bye). Solo se envían los campos necesarios: nunca email, teléfono,
 * wallet, notas, etc.
 */
export const getRoundOverview = async (req, res) => {
    try {
        const { seasonId } = req.params;
        const requestedRound = req.query.round ? Number(req.query.round) : null;

        const season = await Season.findById(seasonId)
            .select('name type year status nextRoundCloseDate roundCloseTime roundIntervalDays startDate endDate')
            .lean();

        if (!season) {
            return res.status(404).json({ ok: false, message: 'Season not found' });
        }

        const roundsAgg = await RankingMatch.aggregate([
            { $match: { season: season._id } },
            {
                $group: {
                    _id: '$round',
                    total: { $sum: 1 },
                    published: { $max: { $cond: ['$published', 1, 0] } },
                    pendingResults: {
                        $sum: {
                            $cond: [{ $and: ['$published', { $eq: ['$status', 'scheduled'] }] }, 1, 0]
                        }
                    }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        const rounds = roundsAgg.map(r => ({
            round: r._id,
            total: r.total,
            published: r.published === 1,
            pendingResults: r.pendingResults
        }));

        if (requestedRound && !rounds.some(r => r.round === requestedRound)) {
            return res.status(404).json({ ok: false, message: 'Round not found for this season' });
        }

        const selectedRound = requestedRound ?? rounds[0]?.round ?? null;

        let matches = [];
        let unpaired = [];

        if (selectedRound) {
            matches = await RankingMatch.find({ season: season._id, round: selectedRound })
                .select('round playerA playerB ratingBefore status published winner sets superTieBreak resultSource playedAt')
                .populate('playerA', 'name lastname profilePicture.url')
                .populate('playerB', 'name lastname profilePicture.url')
                .sort({ createdAt: 1 })
                .lean();

            const isProposal = matches.length > 0 && matches.every(m => !m.published);

            if (isProposal) {
                const pairedIds = new Set(
                    matches.flatMap(m => [String(m.playerA?._id ?? m.playerA), String(m.playerB?._id ?? m.playerB)])
                );

                // Mismo criterio de elegibilidad que generateRankingRoundProposal
                const eligible = await Ranking.find({
                    season: season._id,
                    status: 'active',
                    $or: [
                        { suspendedUntilRound: null },
                        { suspendedUntilRound: { $lte: selectedRound } }
                    ]
                })
                    .select('userId rating')
                    .populate('userId', 'name lastname profilePicture.url')
                    .lean();

                unpaired = eligible
                    .filter(r => r.userId && !pairedIds.has(String(r.userId._id)))
                    .map(r => ({
                        _id: r.userId._id,
                        name: r.userId.name,
                        lastname: r.userId.lastname,
                        profilePicture: r.userId.profilePicture,
                        rating: r.rating
                    }));
            }
        }

        // CHANGE (NUEVO): clasificación de la temporada (Ranking docs) + jugadores
        // inscritos (isRanked) que aún no tienen Ranking doc en esta temporada.
        const [pendingRound, openRound, standings, pendingPlayers] = await Promise.all([
            findPendingProposalRound(season._id),
            findOpenPublishedRound(season._id),
            getSeasonStandings(season._id),
            season.status === 'active' ? getPlayersPendingEntry(season._id) : []
        ]);

        return res.status(200).json({
            ok: true,
            season,
            rounds,
            selectedRound,
            matches,
            unpaired,
            pendingRound,
            openRound,
            standings,      // CHANGE (NUEVO)
            pendingPlayers  // CHANGE (NUEVO)
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: 'Unable to load the ranking rounds' });
    }
};

export const generateRoundProposal = async(req, res) =>{
    try {

        // CHANGE: 403 (antes 400 — no es un error de la petición, es de permisos)
        if(req.user.role !== 'admin'){
            return res.status(403).json({
                ok: false,
                message: 'You are not authorized to generate ranking rounds'
            })
        }

        // CHANGE (SEGURIDAD): `round` YA NO se lee del body. Antes el admin (o
        // cualquiera manipulando la petición) podía mandar un número de ronda
        // arbitrario (ej. 1 otra vez) y crear partidos en una ronda ya jugada.
        // Ahora el número de ronda lo calcula siempre el servidor.
        // seasonId pasa a ser obligatorio (validado en proposeRoundValidator).
        const {seasonId} = req.body;

        const season = await resolveSeason(seasonId);

        // CHANGE (NUEVO): solo se proponen rondas de la temporada activa
        if (season.status !== 'active') {
            return res.status(400).json({
                ok: false,
                message: 'Rounds can only be proposed for the active season'
            })
        }

        // CHANGE (BUG): NUEVO — antes, pulsar "proponer" dos veces creaba partidos
        // duplicados encima de la propuesta anterior.
        const pendingRound = await findPendingProposalRound(season._id);
        if (pendingRound) {
            return res.status(409).json({
                ok: false,
                message: `Round ${pendingRound} has already been proposed and is not published yet. Publish it or discard it first.`
            })
        }

        // CHANGE (NUEVO): no se propone la siguiente ronda mientras la actual sigue abierta
        const openRound = await findOpenPublishedRound(season._id);
        if (openRound) {
            return res.status(409).json({
                ok: false,
                message: `Round ${openRound} is still in progress. The next round is proposed when it closes.`
            })
        }

        const result = await generateRankingRoundProposal({seasonId: season._id})

        // CHANGE (NUEVO): con menos de 2 jugadores elegibles no se crea ningún partido
        if (!result.matches.length) {
            return res.status(400).json({
                ok: false,
                message: 'Not enough eligible players to create a round (at least 2 are needed)'
            })
        }

        // CHANGE: antes se devolvía `...result` (documento Season completo + todos
        // los partidos). El frontend recarga con GET /rounds/:seasonId, así que
        // solo se devuelve lo mínimo.
        return res.status(200).json({
            ok: true,
            message: `Round ${result.round} proposed. Please review it and publish it when ready.`,
            round: result.round,
            matchesCreated: result.matches.length,
            byePlayer: result.byePlayer
        })
        
    } catch (error) {
        // CHANGE: antes todo error era 500 sin log
        return handleSeasonError(error, res, 'Unable to generate round proposal');
    }
}

export const publishRankingRound = async(req, res) =>{
    try {

        // CHANGE: 403 (antes 400)
        if(req.user.role !== 'admin'){
            return res.status(403).json({
                ok: false,
                message: 'You are not authorized to publish ranking rounds'
            })
        }

        // CHANGE: seasonId y round validados en roundActionValidator (round → entero)
        const {seasonId, round} = req.body;

        const season = await resolveSeason(seasonId);

        // CHANGE (NUEVO): solo se publica en la temporada activa
        if (season.status !== 'active') {
            return res.status(400).json({
                ok: false,
                message: 'Rounds can only be published for the active season'
            })
        }

        // CHANGE (SEGURIDAD): NUEVO — antes se podía mandar CUALQUIER número de
        // ronda. Ahora solo se publica la propuesta pendiente actual.
        const pendingRound = await findPendingProposalRound(season._id);
        if (!pendingRound || pendingRound !== round) {
            return res.status(404).json({
                ok: false,
                message: 'There is no unpublished proposal for this round'
            })
        }

        // CHANGE (NUEVO): nunca dos rondas abiertas a la vez
        const openRound = await findOpenPublishedRound(season._id);
        if (openRound && openRound !== round) {
            return res.status(409).json({
                ok: false,
                message: `Round ${openRound} is still in progress. Close it before publishing a new round.`
            })
        }

        const result = await RankingMatch.updateMany(
            {season: season._id, round, published: false},
            {$set: {published: true} }
        )

        return res.status(200).json({
            ok: true,
            message: `Round ${round} published`,
            matchesPublished: result.modifiedCount
        })

        
    } catch (error) {
        // CHANGE: antes devolvía el mensaje equivocado ('Unable to generate round proposal')
        return handleSeasonError(error, res, 'Unable to publish the ranking round');
    }
}

/**
 * CHANGE (NUEVO): POST /ranking/rounds/discard (solo admin)
 * Borra una propuesta SIN PUBLICAR para poder generar otra. Nunca toca partidos
 * publicados (los jugadores ya los han visto y pueden tener resultado).
 * Los Ranking docs creados al proponer (jugadores nuevos) se mantienen: son
 * válidos y se reutilizan en la siguiente propuesta.
 */
export const discardRoundProposal = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ ok: false, message: 'You are not authorized to discard ranking rounds' });
        }

        const { seasonId, round } = req.body;

        const season = await resolveSeason(seasonId);

        const publishedInRound = await RankingMatch.exists({ season: season._id, round, published: true });
        if (publishedInRound) {
            return res.status(409).json({ ok: false, message: 'This round has already been published and cannot be discarded' });
        }

        const result = await RankingMatch.deleteMany({
            season: season._id,
            round,
            published: false,
            status: 'scheduled'
        });

        if (!result.deletedCount) {
            return res.status(404).json({ ok: false, message: 'There is no unpublished proposal for this round' });
        }

        return res.status(200).json({
            ok: true,
            message: `Proposal for round ${round} discarded`,
            matchesDiscarded: result.deletedCount
        });

    } catch (error) {
        return handleSeasonError(error, res, 'Unable to discard the round proposal');
    }
};

export const closeRoundNow = async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ ok: false, message: 'You are not authorized to close a ranking round' });
        }
 
        const { seasonId } = req.body;
        const result = await closeRound({ seasonId }); // CHANGE: llama al service — antes esto duplicaba toda la generación de ronda otra vez aquí mismo
 
        return res.status(200).json({ ok: true, message: 'Round closed and next round proposed', ...result });
 
    } catch (error) {
        console.log(error)
        return res.status(500).json({ ok: false, message: error.message || 'Internal error closing the ranking round' });
    }
};

// =====================================================================
// CHANGE (NUEVO): vista del JUGADOR — su partido de la ronda + clasificación
// =====================================================================

// Estados con resultado definitivo (cuentan para W-L de la clasificación)
const FINISHED_MATCH_STATUSES = ['played', 'walkover', 'admin_resolved'];

/**
 * CHANGE (NUEVO): un partido visto desde el jugador que lo pide.
 * Nunca se envían ratingBefore/ratingDelta/marginMultiplier/penaltiesIssued/
 * confirmedBy: el rating es interno (solo admin). El teléfono del rival SOLO
 * se incluye si `includeOpponentPhone` (partido publicado de la ronda actual
 * y aún 'scheduled'); en el historial nunca.
 */
const toPlayerMatchView = (match, userId, includeOpponentPhone = false) => {
    const playerAId = String(match.playerA?._id ?? match.playerA);
    const mySide = playerAId === String(userId) ? 'A' : 'B';
    const opponentDoc = mySide === 'A' ? match.playerB : match.playerA;

    // populate devuelve null si el rival borró su cuenta
    const opponent = opponentDoc && opponentDoc._id
        ? {
            _id: opponentDoc._id,
            name: opponentDoc.name,
            lastname: opponentDoc.lastname,
            profilePicture: opponentDoc.profilePicture,
            ...(includeOpponentPhone && match.status === 'scheduled' ? { phone: opponentDoc.phone || null } : {})
        }
        : null;

    const winnerId = match.winner ? String(match.winner) : null;
    const firstReporter = match.confirmedBy?.[0] ? String(match.confirmedBy[0]) : null;

    return {
        _id: match._id,
        round: match.round,
        status: match.status,
        mySide,                       // 'A' | 'B' → el front pinta los sets como "yo - rival"
        opponent,
        sets: match.sets || [],
        superTieBreak: match.superTieBreak?.played ? match.superTieBreak : { played: false },
        result: winnerId ? (winnerId === String(userId) ? 'won' : 'lost') : null,
        resultSource: winnerId ? match.resultSource : null,
        reportedBy: match.resultSource === 'Player' && firstReporter
            ? (firstReporter === String(userId) ? 'me' : 'opponent')
            : null,
        playedAt: match.playedAt
    };
};

/**
 * CHANGE (NUEVO): GET /ranking/me/match (cualquier usuario logueado)
 * Temporada activa, posición del jugador, su partido de la ronda publicada más
 * reciente (con el teléfono del rival mientras esté por jugar) y su historial
 * de la temporada. Las propuestas SIN publicar nunca se exponen aquí.
 */
export const getMyRankingMatch = async (req, res) => {
    try {
        const userId = req.user._id;

        const season = await Season.findOne({ status: 'active' })
            .select('name type year nextRoundCloseDate roundCloseTime roundIntervalDays')
            .lean();

        if (!season) {
            return res.status(200).json({ ok: true, season: null, myRanking: null, currentRound: null, currentMatch: null, history: [] });
        }

        const roundCloseAt = season.nextRoundCloseDate
            ? buildMadridDateTime(season.nextRoundCloseDate, season.roundCloseTime)?.toDate() ?? null
            : null;

        const [myRankingDoc, latestPublished] = await Promise.all([
            Ranking.findOne({ season: season._id, userId })
                .select('rank status penaltyPoints suspendedUntilRound')
                .lean(),
            RankingMatch.findOne({ season: season._id, published: true })
                .sort({ round: -1 })
                .select('round')
                .lean()
        ]);

        const currentRound = latestPublished?.round ?? null;

        // Penalizaciones propias: son del propio jugador, se las mostramos a él (nunca a otros)
        const myRanking = myRankingDoc
            ? {
                rank: myRankingDoc.status === 'active' ? myRankingDoc.rank : null,
                status: myRankingDoc.status,
                penaltyPoints: myRankingDoc.penaltyPoints ?? 0,
                suspendedUntilRound: myRankingDoc.suspendedUntilRound ?? null
            }
            : null;

        const matches = await RankingMatch.find({
            season: season._id,
            published: true,
            $or: [{ playerA: userId }, { playerB: userId }]
        })
            .select('round playerA playerB sets superTieBreak winner status resultSource confirmedBy playedAt')
            .populate('playerA', 'name lastname profilePicture.url phone')
            .populate('playerB', 'name lastname profilePicture.url phone')
            .sort({ round: -1 })
            .limit(30)
            .lean();

        const currentDoc = currentRound ? matches.find(m => m.round === currentRound) : null;

        return res.status(200).json({
            ok: true,
            season: {
                _id: season._id,
                name: season.name,
                type: season.type,
                year: season.year,
                roundCloseAt
            },
            myRanking,
            currentRound,
            currentMatch: currentDoc ? toPlayerMatchView(currentDoc, userId, true) : null,
            history: matches
                .filter(m => m.round !== currentRound)
                .map(m => toPlayerMatchView(m, userId, false))
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: 'Unable to load your ranking match' });
    }
};

/**
 * CHANGE (NUEVO): GET /ranking/standings (cualquier usuario logueado)
 * Clasificación pública de la temporada activa: posición, nombre, foto y
 * partidos jugados/ganados/perdidos. Solo jugadores 'active' (los suspendidos
 * pierden la posición según el Reglamento). Sin rating ni penalizaciones.
 */
export const getPublicStandings = async (req, res) => {
    try {
        const season = await Season.findOne({ status: 'active' })
            .select('name type year')
            .lean();

        if (!season) {
            return res.status(200).json({ ok: true, season: null, standings: [] });
        }

        const [rankingDocs, recordAgg] = await Promise.all([
            Ranking.find({ season: season._id, status: 'active' })
                .select('userId rank')
                .populate('userId', 'name lastname profilePicture.url')
                .sort({ rank: 1 })
                .lean(),
            RankingMatch.aggregate([
                {
                    $match: {
                        season: season._id,
                        published: true,
                        winner: { $ne: null },
                        status: { $in: FINISHED_MATCH_STATUSES }
                    }
                },
                { $project: { winner: 1, players: ['$playerA', '$playerB'] } },
                { $unwind: '$players' },
                {
                    $group: {
                        _id: '$players',
                        played: { $sum: 1 },
                        won: { $sum: { $cond: [{ $eq: ['$players', '$winner'] }, 1, 0] } }
                    }
                }
            ])
        ]);

        const recordByUser = new Map(recordAgg.map(r => [String(r._id), r]));

        const standings = rankingDocs.map(r => {
            const record = r.userId ? recordByUser.get(String(r.userId._id)) : null;
            const played = record?.played ?? 0;
            const won = record?.won ?? 0;
            return {
                _id: r._id,
                rank: r.rank,
                player: publicPlayer(r.userId),
                played,
                won,
                lost: played - won
            };
        });

        return res.status(200).json({ ok: true, season, standings });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: 'Unable to load the ranking standings' });
    }
};

/**
 * CHANGE (NUEVO): GET /ranking/matches?round=N (cualquier usuario logueado)
 * Partidos PUBLICADOS de la temporada activa, ronda a ronda (por defecto la
 * última publicada), para que todos los jugadores vean quién juega con quién
 * y los resultados. Solo nombre, apellido y foto de cada jugador: nunca
 * teléfono, email, rating, ratingDelta ni penalizaciones. Las propuestas sin
 * publicar nunca salen aquí.
 */
export const getPublicRoundMatches = async (req, res) => {
    try {
        const requestedRound = req.query.round ? Number(req.query.round) : null;

        const season = await Season.findOne({ status: 'active' })
            .select('name type year')
            .lean();

        if (!season) {
            return res.status(200).json({ ok: true, season: null, rounds: [], selectedRound: null, matches: [] });
        }

        const roundsAgg = await RankingMatch.aggregate([
            { $match: { season: season._id, published: true } },
            {
                $group: {
                    _id: '$round',
                    total: { $sum: 1 },
                    finished: { $sum: { $cond: [{ $in: ['$status', FINISHED_MATCH_STATUSES] }, 1, 0] } }
                }
            },
            { $sort: { _id: -1 } }
        ]);

        const rounds = roundsAgg.map(r => ({ round: r._id, total: r.total, finished: r.finished }));

        if (requestedRound && !rounds.some(r => r.round === requestedRound)) {
            return res.status(404).json({ ok: false, message: 'Round not found' });
        }

        const selectedRound = requestedRound ?? rounds[0]?.round ?? null;

        if (!selectedRound) {
            return res.status(200).json({ ok: true, season, rounds, selectedRound: null, matches: [] });
        }

        const docs = await RankingMatch.find({ season: season._id, round: selectedRound, published: true })
            .select('round playerA playerB sets superTieBreak winner status playedAt createdAt')
            .populate('playerA', 'name lastname profilePicture.url')
            .populate('playerB', 'name lastname profilePicture.url')
            .sort({ createdAt: 1 })
            .lean();

        const matches = docs.map(m => {
            const winnerId = m.winner ? String(m.winner) : null;
            const aId = m.playerA?._id ? String(m.playerA._id) : null;
            const bId = m.playerB?._id ? String(m.playerB._id) : null;
            return {
                _id: m._id,
                round: m.round,
                status: m.status,
                playerA: publicPlayer(m.playerA),
                playerB: publicPlayer(m.playerB),
                sets: m.sets || [],
                superTieBreak: m.superTieBreak?.played
                    ? { played: true, pointsA: m.superTieBreak.pointsA, pointsB: m.superTieBreak.pointsB }
                    : { played: false },
                winner: winnerId ? (winnerId === aId ? 'A' : winnerId === bId ? 'B' : null) : null,
                playedAt: m.playedAt
            };
        });

        return res.status(200).json({ ok: true, season, rounds, selectedRound, matches });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ ok: false, message: 'Unable to load the round matches' });
    }
};

// CHANGE (NUEVO): normaliza el súper tie break que se guarda. Antes se guardaba
// `superTieBreak || match.superTieBreak` tal cual venía del body.
const buildSuperTieBreak = (setsTied, superTieBreak) => setsTied
    ? { played: true, pointsA: Number(superTieBreak.pointsA), pointsB: Number(superTieBreak.pointsB) }
    : { played: false, pointsA: null, pointsB: null };

export const submitRankingResult = async (req, res) => {
    const session = await mongoose.startSession();
 
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ ok: false, message: errors.array()[0].msg });
        }
 
        const { matchId, superTieBreak } = req.body;
        // CHANGE: los games se pasan a Number (el validator los da por buenos como
        // enteros, pero podían llegar como string "10" > "9" → comparación de texto)
        const sets = req.body.sets.map(s => ({ gamesA: Number(s.gamesA), gamesB: Number(s.gamesB) }));
        const userId = req.user.id;
 
        // CHANGE (SEGURIDAD, hueco nº 10): antes el partido se leía FUERA de la
        // transacción. Si los dos jugadores enviaban casi a la vez, los dos veían
        // 'scheduled' y el rating se aplicaba DOS veces. Ahora se lee DENTRO de la
        // transacción: o el segundo ve 'played', o MongoDB aborta su escritura por
        // conflicto (se responde 409 más abajo).
        session.startTransaction();

        const match = await RankingMatch.findById(matchId).session(session);
 
        if (!match) {
            await session.abortTransaction();
            return res.status(404).json({ ok: false, message: 'Ranking match not found' });
        }
 
        if (![match.playerA.toString(), match.playerB.toString()].includes(userId)) {
            await session.abortTransaction();
            return res.status(403).json({ ok: false, message: 'You are not a participant in this match' });
        }
 
        // CHANGE (SEGURIDAD): NUEVO — no se aceptan resultados de propuestas sin publicar
        if (!match.published) {
            await session.abortTransaction();
            return res.status(400).json({ ok: false, message: 'This match has not been published yet' });
        }

        // CHANGE (SEGURIDAD): antes solo bloqueaba 'played' y 'admin_resolved', así que se
        // podía enviar resultado a un partido 'disputed' (saltándose al admin tras el
        // cierre), 'cancelled' o 'walkover'. Ahora solo 'scheduled'.
        if (match.status !== 'scheduled') {
            await session.abortTransaction();
            // CHANGE: mensaje más claro (el caso típico es que el rival ya lo envió)
            return res.status(409).json({ ok: false, message: 'A result has already been recorded for this match or it is closed' });
        }

        // CHANGE (SEGURIDAD): NUEVO — solo partidos de la temporada ACTIVA. Al activar
        // otra temporada, los partidos 'scheduled' de la anterior se quedaban abiertos.
        const seasonIsActive = await Season.exists({ _id: match.season, status: 'active' }).session(session);
        if (!seasonIsActive) {
            await session.abortTransaction();
            return res.status(400).json({ ok: false, message: 'This season is closed and no longer accepts results' });
        }
 
        const setsWonByA = sets.filter(s => s.gamesA > s.gamesB).length;
        const setsWonByB = sets.length - setsWonByA;
        const setsTied = setsWonByA === setsWonByB; // CHANGE: se reutiliza para guardar el STB

        // CHANGE (BUG CRÍTICO): antes `winnerIsA = setsWonByA > setsWonByB` → con 1-1 en
        // sets ganaba SIEMPRE el jugador B. Ahora, con empate en sets, decide el súper
        // tie break (obligatorio en ese caso, a 10 con diferencia de 2).
        // (El validator ya exige formato estricto; esto queda como segunda barrera.)
        let winnerIsA;
        if (!setsTied) {
            winnerIsA = setsWonByA > setsWonByB;
        } else {
            const pointsA = Number(superTieBreak?.pointsA);
            const pointsB = Number(superTieBreak?.pointsB);
            const validStb =
                superTieBreak?.played === true &&
                Number.isInteger(pointsA) && Number.isInteger(pointsB) &&
                Math.max(pointsA, pointsB) >= 10 &&
                Math.abs(pointsA - pointsB) >= 2;

            if (!validStb) {
                await session.abortTransaction();
                return res.status(400).json({ ok: false, message: 'The sets are tied: please add a valid super tie break score (first to 10, win by 2)' });
            }
            winnerIsA = pointsA > pointsB;
        }
 
        const { gamesWinner, gamesLoser } = sumGames(sets, winnerIsA);
 
        const [rankingA, rankingB] = await Promise.all([
            Ranking.findOne({ userId: match.playerA, season: match.season }).session(session),
            Ranking.findOne({ userId: match.playerB, season: match.season }).session(session)
        ]);
 
        if (!rankingA || !rankingB) {
            await session.abortTransaction();
            return res.status(400).json({ ok: false, message: 'One of the players has no active ranking entry for this season' });
        }
 
        const { winnerDelta, loserDelta, multiplier } = computeRatingDelta({
            ratingWinner: winnerIsA ? rankingA.rating : rankingB.rating,
            ratingLoser: winnerIsA ? rankingB.rating : rankingA.rating,
            gamesWinner,
            gamesLoser
        });
 
        const deltaA = winnerIsA ? winnerDelta : loserDelta;
        const deltaB = winnerIsA ? loserDelta : winnerDelta;
 
        rankingA.rating += deltaA;
        rankingB.rating += deltaB;
        rankingA.lastRoundPlayed = match.round;
        rankingB.lastRoundPlayed = match.round;
 
        match.sets = sets;
        match.superTieBreak = buildSuperTieBreak(setsTied, superTieBreak); // CHANGE: antes `superTieBreak || match.superTieBreak`
        match.winner = winnerIsA ? match.playerA : match.playerB;
        match.status = 'played';
        match.resultSource = 'Player'; // CHANGE (CRÍTICO): antes 'player' — el enum es ['Player','Admin'] → ValidationError → TODO resultado daba 500
        match.playedAt = new Date();
        match.marginMultiplier = multiplier;
        match.ratingDelta = { playerA: deltaA, playerB: deltaB };
 
        if (!match.confirmedBy.map(String).includes(userId)) {
            match.confirmedBy.push(userId);
        }
 
        await Promise.all([
            match.save({ session }),
            rankingA.save({ session }),
            rankingB.save({ session })
        ]);
 
        const standings = await Ranking.find({ season: match.season, status: 'active' })
            .sort({ rating: -1 })
            .session(session);
 
        await Promise.all(standings.map((doc, index) =>
            Ranking.updateOne({ _id: doc._id }, { $set: { rank: index + 1 } }, { session })
        ));
 
        await session.commitTransaction();
 
        // CHANGE (SEGURIDAD): antes se devolvía el documento `match` completo y
        // `ratingDelta`. El rating es interno (solo admin) → el jugador no lo ve.
        // El frontend recarga con GET /ranking/me/match.
        return res.status(200).json({
            ok: true,
            message: 'Result recorded. Thanks for reporting it!'
        });
 
    } catch (error) {
        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        // CHANGE (NUEVO): conflicto de escritura (el rival envió el resultado a la
        // vez) → 409 con mensaje claro en vez de 500. El rating se aplica UNA vez.
        if (error?.hasErrorLabel?.('TransientTransactionError') || error?.code === 112) {
            return res.status(409).json({ ok: false, message: 'Your opponent has just submitted the result for this match. Please refresh.' });
        }

        console.log(error)
        return res.status(500).json({ ok: false, message: 'Internal error submitting the ranking result' });
    } finally {
        session.endSession();
    }
};