import { useCallback, useEffect, useState } from "react"
import { getUserVotesMatch } from "../actions/matches";


const useMatchVotes = (matchId) =>{
    const [votedUserIds, setVotedUserIds] = useState([]);
    const [loadingVotes, setLoadingVotes] = useState(false);

    const loadVotes = useCallback(async () => {
        if(!matchId) return;

        try {
            setLoadingVotes(true);

            const res = await getUserVotesMatch(matchId);

            setVotedUserIds(res.votedUserIds)
        } catch (error) {
            console.log(error)
        } finally{
            setLoadingVotes(false)
        }  
    }, [matchId]);

    useEffect(() => {
        loadVotes()
    }, [loadVotes]);

    //local mark
    const markAsVoted = (userId) =>{
        setVotedUserIds(prev => [...prev, String(userId)])
    };

    return{
        votedUserIds,
        loadingVotes,
        markAsVoted
    }
}

export default useMatchVotes;