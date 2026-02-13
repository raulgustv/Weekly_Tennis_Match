import { useEffect, useState } from "react"
import axiosInstance from "../API/axios";

export const useCourts = () =>{
    const [courts, setCourts] = useState([]);
    const [loadCourts, setLoadCourts] = useState(false)

    const fetchCourts = async() =>{
        try {
            setLoadCourts(true)

            const {data} = await axiosInstance.get('/location/view-all')

            setCourts(data);
        } catch (error) {
            console.log(error)
        }finally{
            setLoadCourts(false)
        }
    };

    useEffect(() =>{
        fetchCourts();
    }, []);

    return{
        courts, fetchCourts, loadCourts
    }
}