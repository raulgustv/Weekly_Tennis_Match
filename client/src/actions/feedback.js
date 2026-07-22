import axiosInstance from "../API/axios"

export const checkFeedbackEligibility = async(triggerType) => {

    const {data} = await axiosInstance.get('/feedback/eligibility', {
        params: {triggerType}
    });

    return data;    
}

export const recordFeedbackShown = async(triggerType, triggerContext = {}) =>{
    const {data} = await axiosInstance.post('/feedback/shown', {
        triggerType, 
        triggerContext
    }) 

    return data;
}