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