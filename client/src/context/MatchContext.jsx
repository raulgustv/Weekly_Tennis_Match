import { createContext, useContext, useEffect, useRef, useState } from "react";
import axiosInstance from "../API/axios";
import { useAuth } from "./AuthContext";
import { toast } from 'react-toastify'


const MatchesContext = createContext();

const getPollInterval = () => {
    const day = new Date().getDay(); // 3 = miércoles
    return day === 3 ? 60 * 1000 : 60 * 60 * 1000; // miércoles: 1 min, resto: 1h
};

export const MatchesProvider = ({ children }) => {

    const { user, loading } = useAuth();

    const [matches, setMatches] = useState([]);
    const [openMatches, setOpenMatches] = useState([])
    const [loadMatches, setLoadMatches] = useState(false);
    const [loadOpenMatches, setloadOpenMatches] = useState(false)
    const intervalRef = useRef(null)

    const fetchMatches = async (isSilent = false) => {
        try {
            if (!isSilent) setLoadMatches(true);

            const { data } = await axiosInstance.get('/match/view-all');

            setMatches(data)
        } catch (error) {
            console.log(error)
            toast.error('Error obtaining all matches')
        } finally {
            if (!isSilent) setLoadMatches(false)
        }
    }

    const fetchOpenMatches = async (isSilent = false) => {
        try {
            if (!isSilent) setloadOpenMatches(true);

            const { data } = await axiosInstance.get('/match/view-open-match');

            setOpenMatches(data);
        } catch (error) {
            console.log(error)
            toast.error('There was an error obtaining matches')
        } finally {
            if (!isSilent) setloadOpenMatches(false);
        }
    }

    //polling open matches only
    useEffect(() => {
        if (!user || loading) return;

        const startPolling = () => {
            fetchOpenMatches(true);

            intervalRef.current = setInterval(() => {
                fetchOpenMatches(true)
            }, getPollInterval());
        }

        const stopPolling = () => clearInterval(intervalRef.current)

        const handleVisibilityChange = () => {
            document.visibilityState === 'visible' ? startPolling() : stopPolling()
        }

        document.addEventListener('visibilitychange', handleVisibilityChange);
        startPolling();

        return () => {
            stopPolling();
            document.removeEventListener('visibilitychange', handleVisibilityChange)
        }
    }, [user, loading]);

    useEffect(() => {
        if (!user || loading) return;
        fetchMatches();
    }, [user, loading]);

    return (
        <MatchesContext.Provider value={{ matches, loadMatches, fetchMatches, openMatches, loadOpenMatches, fetchOpenMatches }}>
            {children}
        </MatchesContext.Provider>
    )
};

export const useMatches = () => useContext(MatchesContext);