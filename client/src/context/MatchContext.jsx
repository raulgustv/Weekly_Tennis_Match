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
            // 🔧 FIX (logout bug): antes este toast se ejecutaba SIEMPRE —
            // `isSilent` solo controlaba el spinner, no el aviso de error. Como
            // este fetch también se dispara en segundo plano, en cuanto el
            // access token caducaba (a los 15 min) aparecía este toast en
            // cada ciclo, dando la sensación de que la app te expulsaba todo
            // el rato. Ahora se respeta `isSilent` y, además, nunca se
            // muestra en un 401: ese caso ya lo gestiona el flujo de sesión
            // (AuthContext / ProtectedRoute), que redirige a /login sin
            // necesidad de un mensaje técnico de "error obteniendo partidos".
            if (!isSilent && error?.response?.status !== 401) {
                toast.error('Error obtaining all matches')
            }
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
            // 🔧 FIX (logout bug — mismo cambio que en fetchMatches): este es
            // el sondeo en segundo plano (cada 1 min los miércoles, cada 1h
            // el resto de días) que dispara el mensaje "There was an error
            // obtaining matches" descrito en el informe de seguridad. Antes
            // se mostraba en CADA ciclo de sondeo mientras el token estaba
            // expirado; ahora se respeta `isSilent` y se ignoran los 401.
            if (!isSilent && error?.response?.status !== 401) {
                toast.error('There was an error obtaining matches')
            }
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