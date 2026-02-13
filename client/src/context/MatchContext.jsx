import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../API/axios";
import { useAuth } from "./AuthContext";


const MaatchesContext = createContext();

export const MatchesProvider = ({children}) =>{

    const {user, loading} = useAuth();


    const [matches, setMatches] = useState([]);
    const [loadMatches, setLoadMatches] = useState(false);

    const fetchMatches = async() =>{
        try {
            setLoadMatches(true);

            const {data} = await axiosInstance.get('/match/view-all');

            setMatches(data)
        } catch (error) {
            console.log(error)
        }finally{
            setLoadMatches(false)
        }
    }

    useEffect(() =>{
        if(!user) return 
        if(loading) return 
        fetchMatches();
    }, [user, loading]);
    

    return (
        <MaatchesContext.Provider value={{matches, loadMatches, fetchMatches}}>
            {children}
        </MaatchesContext.Provider>
    )
};

export const useMatches = () => useContext(MaatchesContext);