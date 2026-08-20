import axiosInstance from "../API/axios"

export const getNotifications = async() =>{
    const {data} = await axiosInstance.get('/notifications')
    return data;
}


export const updateSeenNotification = async(ids) => {
    await axiosInstance.post('/notifications/seen', {ids})
}


export const createNotification = async (payload) => {
  const { data } = await axiosInstance.post("/notifications/create", payload);
  return data;
};