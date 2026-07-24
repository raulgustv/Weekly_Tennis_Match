import axios from "axios";
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


export const submitFeedbackResponse = async(rating, category, comment) =>{
    const {data} = await axios.patch('/feedback/response',{
        rating, category, comment
    })

     return data;
}