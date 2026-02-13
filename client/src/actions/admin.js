import axiosInstance from "../API/axios"

export const togglePlayerActive = async(id) =>{
    const {data} = await axiosInstance.post(`/admin/player-activation/${id}`)

    return data;
}

export const adminUpdateNTRP = async(id, ntrplvl) =>{
    const {data} = await axiosInstance.post(`/admin/adjust-ntrp/${id}`, {newLevel: ntrplvl});

    return data
}


export const adminRemovePlayer = async(matchId, playerId)=>{
    const {data} = await axiosInstance.post(`/admin/remove-player/${matchId}/${playerId}`)

    return data;
}

export const toggleUserRole = async(id) =>{
    const {data} = await axiosInstance.post('/admin/add-admin', {id})

    return data;
}