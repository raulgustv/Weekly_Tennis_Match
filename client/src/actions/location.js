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

export const getLocation = async(slug) =>{
    const {data} = await axiosInstance.get(`/location/view/${slug}`);
    return data;
}

export const updateSurface = async(slug, courtNumber, surface ) =>{
    const {data} = await axiosInstance.put(`/location/${slug}`, {courtNumber, surface})
    return data;
}

export const toggleFavoriteCourt = async(slug, courtNumber) =>{
    const {data} = await axiosInstance.patch(`/location/${slug}/courts/${courtNumber}/favorite`)

    return data;
}