import axiosInstance from "../API/axios"

export const rankingRetire = async() =>{
    const data = await axiosInstance.post('/ranking/unregister')

    return data;
}

export const registerRank = async(values) =>{

    ///console.log(values)

    const data = await axiosInstance.post('/ranking/register', values)
    return data;
}

export const newSeason = async(values) =>{
    const data = await axiosInstance.post('/season', values)
    return data;
}

export const getSeasons = async() => {
    const {data} = await axiosInstance.get('/season');
    return data;
}

// =====================================================================
// CHANGE (NUEVO): acciones del flujo admin de rondas (RankingRounds.jsx)
// =====================================================================

// CHANGE (NUEVO): activa una temporada 'upcoming' (cierra la que estuviera activa).
// Endpoint ya existente en el backend: POST /season/:id/activate
export const activateSeason = async(seasonId) =>{
    const {data} = await axiosInstance.post(`/season/${encodeURIComponent(seasonId)}/activate`);
    return data;
}

// CHANGE (NUEVO): resumen de rondas + partidos de una ronda (por defecto la última)
export const getRoundOverview = async(seasonId, round) =>{
    const {data} = await axiosInstance.get(`/ranking/rounds/${encodeURIComponent(seasonId)}`, {
        params: round ? { round } : {}
    });
    return data;
}

// CHANGE (NUEVO): propone la siguiente ronda. El número de ronda lo calcula el servidor.
export const proposeRound = async(seasonId) =>{
    const {data} = await axiosInstance.post('/ranking/rounds/propose', { seasonId });
    return data;
}

// CHANGE (NUEVO): publica la propuesta pendiente (los jugadores ya ven su partido)
export const publishRound = async(seasonId, round) =>{
    const {data} = await axiosInstance.post('/ranking/rounds/publish', { seasonId, round });
    return data;
}

// CHANGE (NUEVO): descarta la propuesta pendiente (solo si no está publicada)
export const discardRound = async(seasonId, round) =>{
    const {data} = await axiosInstance.post('/ranking/rounds/discard', { seasonId, round });
    return data;
}