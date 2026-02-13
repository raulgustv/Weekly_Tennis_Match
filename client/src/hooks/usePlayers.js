import {useEffect, useState} from 'react'
import axiosInstance from '../API/axios';

export const usePlayers = () => {

    const [players, setPlayers] = useState([]);
    const [loadPlayers, setLoadPlayers] = useState(false);

    const fetchPlayers = async() =>{
        try {

            setLoadPlayers(true)

            const {data} = await axiosInstance.get('/user/all-users')

            setPlayers(data);
        } catch (error) {
            console.log(error)
        }finally{
            setLoadPlayers(false)
        }
    }

    useEffect(() => {
        fetchPlayers();
    }, []);

    return{
        players, fetchPlayers, loadPlayers
    }
    
  
}
