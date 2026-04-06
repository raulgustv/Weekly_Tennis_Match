import axiosInstance from "../API/axios"

export const addFunds = async(payload) =>{
    const data = await axiosInstance.post('/wallet', payload)

    return data;
}

export const acceptTransaction = async(id) =>{
    const data = await axiosInstance.post(`/wallet/confirm/${id}`, {note: ""})

    return data;
}

export const rejectTransaction = async(id, note) =>{ 

    const data = await axiosInstance.post(`/wallet/reject/${id}`, {note: note})

    return data;
}