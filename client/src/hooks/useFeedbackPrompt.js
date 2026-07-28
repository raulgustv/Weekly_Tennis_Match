import { useCallback, useState, useRef } from "react"
import { checkFeedbackEligibility, recordFeedbackShown } from "../actions/feedback";


export const useFeedbackPrompt = () =>{
    const [feedbackRequestId , setFeedbackRequestId ] = useState(null);
    const [modalOpen, setModalOpen] = useState(false)
    const [modalTitle, setModalTitle] = useState(null);
    const [modalType, setModalType] = useState(null)


    const modalOpenRef = useRef(false);
    const checkingRef = useRef(false)

    const triggerFeedbackCheck = useCallback(async (triggerType, triggerContext = {}, type, title= null) =>{


        if(modalOpenRef.current || checkingRef.current) return;

        try {

            checkingRef.current = true

            const {eligible} = await checkFeedbackEligibility(triggerType, type, triggerContext?.matchId)

            if(!eligible) return;

            const {feedbackRequestId} = await recordFeedbackShown(triggerType, triggerContext, type)


            modalOpenRef.current = true
            setFeedbackRequestId(feedbackRequestId)
            setModalTitle(title)
            setModalType(type)
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
        setModalTitle(null);
        setModalType(null);
        setFeedbackRequestId(null)
    }, []);

    return{
        modalOpen, 
        feedbackRequestId,
        modalTitle,
        modalType,
        triggerFeedbackCheck,
        closeFeedbackModal
    }
}