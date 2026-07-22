import { createContext, useContext } from "react";
import { useFeedbackPrompt } from "../hooks/useFeedbackPrompt";
import FeedbackModal from "../components/modals/FeedbackModal";


export const FeedbackContext = createContext();

export const FeedbackProvider = ({children}) =>{
    const {modalOpen, feedbackRequestId, triggerFeedbackCheck, closeFeedbackModal} = useFeedbackPrompt()

    return (
        <FeedbackContext.Provider value={{triggerFeedbackCheck}}>
            {children}

            <FeedbackModal 
                open={modalOpen}
                feedbackRequestId={feedbackRequestId}
                onClose={closeFeedbackModal}
            />
        </FeedbackContext.Provider>
    )
};

export const useFeedback = () => useContext(FeedbackContext)