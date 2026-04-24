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

export const togglePayment = async(matchId, userId) =>{
    const {data} = await axiosInstance.put(`/admin/payment/${matchId}/${userId}`);

    return data;
}

export const viewPlayer = async(id) =>{
    const {data} = await axiosInstance.get(`/user/${id}`);

    return data;
}

export const addUserNote = async(id, note) =>{
    const {data} = await axiosInstance.post(`/user/${id}`, {note})

    return data;
} 


export const getUserNoteHistory = async(id) =>{
    const {data} = await axiosInstance.get(`/user/notes/${id}`);

    return data;
}

export const updatePaymentRecepient = async(id) =>{
    const {data} = await axiosInstance.post(`/admin/update-recepient/${id}`);

    return data;
}