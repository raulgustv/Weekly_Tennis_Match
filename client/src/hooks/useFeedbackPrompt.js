import { useCallback, useState, useRef } from "react"
import { checkFeedbackEligibility, recordFeedbackShown } from "../actions/feedback";


export const useFeedbackPrompt = () =>{
    const [feedbackRequestId , setFeedbackRequestId ] = useState(null);
    const [modalOpen, setModalOpen] = useState(false)

    const modalOpenRef = useRef(false);
    const checkingRef = useRef(false)

    const triggerFeedbackCheck = useCallback(async (triggerType, triggerContext = {}) =>{

        if(modalOpenRef.current || checkingRef.current) return;

        try {

            checkingRef.current = true

            const {eligible} = await checkFeedbackEligibility(triggerType)

            if(!eligible) return;

            const {feedbackRequestId} = await recordFeedbackShown(triggerType, triggerContext)

            modalOpenRef.current = true
            setFeedbackRequestId(feedbackRequestId)
            setModalOpen(true)

        } catch (error) {
            console.log(error)
        }finally{
            checkingRef.current = false
        }
    }, []) 

    const closeFeedbackModal = useCallback(() => {
        modalOpenRef.current = false
        setModalOpen(false);
        setFeedbackRequestId(null)
    }, []);

    return{
        modalOpen, 
        feedbackRequestId,
        triggerFeedbackCheck,
        closeFeedbackModal
    }
}