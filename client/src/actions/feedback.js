import axiosInstance from "../API/axios"

export const checkFeedbackEligibility = async(triggerType, type) => {

    const {data} = await axiosInstance.get('/feedback/eligibility', {
        params: {triggerType, type}
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


export const submitFeedbackResponse = async(rating, category, comment, feedbackRequestId) =>{

    const {data} = await axiosInstance.patch(`/feedback/response/${feedbackRequestId}`,{
        rating, category, comment
    })

    //console.log(data)

     return data;
}


export const dismissFeedbackResponse = async(feedbackRequestId) => {
    const {data}  = await axiosInstance.patch(`/feedback/response/${feedbackRequestId}`);

    return data;
}