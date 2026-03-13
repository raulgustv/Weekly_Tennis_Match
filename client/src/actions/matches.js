import axiosInstance from "../API/axios"


export const createNewMatch = async(values) =>{
    const {data} = await axiosInstance.post('/match/new', values)
    
    return data;
}

export const updateStatus = async(id, status) =>{
    const {data} = await axiosInstance.post(`/match/update-status/${id}`, {status})

    return data;
}

export const joinMatch = async(id, backup, paymentMethod) =>{
    const {data} = await axiosInstance.post(`/match/join/${id}`, {asBackup: backup, paymentMethod});

    return data;
}

export const leaveMatch = async(id) =>{
    const {data} = await axiosInstance.post(`/match/leave/${id}`)

    return data;
}

export const getMatch = async(id) =>{
    const {data} = await axiosInstance.get(`/match/view-match/${id}`);

    return data;
}


export const generateMatch = async(id) =>{
    const {data} = await axiosInstance.post(`/match/generate/${id}`);

    return data;
}

export const updateGeneratedMatch = async(matchId, generatedMatches) =>{
    const {data} = await axiosInstance.put(`/match/update-generate/${matchId}`, generatedMatches);

    return data;
}

export const removeMatchCourt = async(matchId, courtNumber) =>{
    const {data} = await axiosInstance.post(`/match/remove-courts/${matchId}/${courtNumber}`);

    return data;
}


export const addMatchCourts = async(courts, matchId ) =>{   

    const {data} = await axiosInstance.post(`/match/add-courts/${matchId}`, {courts});

    return data;
}

export const voteSkill = async(playerId, value, matchId) =>{
    const {data} = await axiosInstance.post(`/vote/match/${matchId}`,{
        votedUserId: playerId,
        value
    });

    return data;
}

export const getUserVotesMatch = async(matchId) =>{
    const {data} = await axiosInstance.get(`/vote/match/${matchId}`);

    return data;
}

