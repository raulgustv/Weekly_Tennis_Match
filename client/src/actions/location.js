import axiosInstance from "../API/axios"


export const addLocation = async(values) =>{
    const {data} = await axiosInstance.post('/location/new');

    return data;
}

export const favoriteLocation = async (slug) =>{
    const {data} = await axiosInstance.post(`/location/favorite/${slug}`)

    return data
}

export const activateLocations = async(slug) =>{
    const {data} = await axiosInstance.post(`/location/status/${slug}`)

    return data;
}