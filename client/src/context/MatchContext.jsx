import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../API/axios";
import { useAuth } from "./AuthContext";


const MatchesContext = createContext();

export const MatchesProvider = ({ children }) => {

    const { user, loading } = useAuth();

    const [matches, setMatches] = useState([]);
    const [loadMatches, setLoadMatches] = useState(false);

    const fetchMatches = async (isSilent = false) => {
        try {
            if (!isSilent) setLoadMatches(true);

            const { data } = await axiosInstance.get('/match/view-all');

            setMatches(data)
        } catch (error) {
            console.log(error)
        } finally {
            if (!isSilent) setLoadMatches(false)
        }
    }

    useEffect(() => {
        if (!user || loading) return;
        fetchMatches();
    }, [user, loading]);



    //polling automático por cron
    useEffect(() => {
        if (!user || loading) return;


        const shouldRefresh = () => matches.some((m) =>
            ["Ready", "Playing", "Played"].includes(m?.status)
        )

        if (!shouldRefresh) return;

        const interval = setInterval(() => {
            fetchMatches(true);
        }, 300000);

        return () => clearInterval(interval)

    }, [user, loading, matches])


    return (
        <MatchesContext.Provider value={{ matches, loadMatches, fetchMatches }}>
            {children}
        </MatchesContext.Provider>
    )
};

export const useMatches = () => useContext(MatchesContext);