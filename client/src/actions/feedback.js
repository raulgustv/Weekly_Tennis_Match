import axiosInstance from "../API/axios"

export const checkFeedbackEligibility = async (triggerType, type, matchId) => {
    const params = new URLSearchParams({ triggerType, type });
    if (matchId) params.append('matchId', matchId);

    const { data } = await axiosInstance.get(`/feedback/eligibility?${params.toString()}`);
    return data;
}

export const recordFeedbackShown = async(triggerType, triggerContext = {}, type) =>{
    const {data} = await axiosInstance.post('/feedback/shown', {
        triggerType, 
        triggerContext, 
        type
    }) 

    return data;
}


export const submitFeedbackResponse = async(rating, category, comment, feedbackRequestId) =>{

    const {data} = await axiosInstance.patch(`/feedback/response/${feedbackRequestId}`,{
        rating, category, comment
    })

    //console.log(data)

     return data;
}


export const dismissFeedbackResponse = async(feedbackRequestId) => {
    const {data}  = await axiosInstance.patch(`/feedback/dismiss/${feedbackRequestId}`);

    return data;
}