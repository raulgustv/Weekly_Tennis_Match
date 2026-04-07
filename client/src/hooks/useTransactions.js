import { useEffect, useState } from "react"
import axiosInstance from "../API/axios"

export  const useTransactions = () =>{


    const [loadWallet, setLoadWallet] = useState(false)
    const [transactions, setTransactions] = useState([])

    const fetchTransactions = async() =>{
        try {

            setLoadWallet(false);

            const {data} = await axiosInstance.get('/wallet/user/funds')

            setTransactions(data);
            
        } catch (error) {
            console.log(error)
        }finally{
            setLoadWallet(false)
        }
    }

    useEffect(() =>{
        fetchTransactions();
    }, []);

    return {
        transactions, loadWallet, fetchTransactions, setLoadWallet
    }

}

export const usePendingTransactions = () =>{

    const [loadPendingTransactions, setLoadPendingTransactions] = useState(false)
    const [pendingTransactions, setPendingTransactions] = useState([]);
    
    const fetchPendingTransactions = async() =>{
        try {

            setLoadPendingTransactions(true)

            const {data} = await axiosInstance.get('/wallet/pending');

            setPendingTransactions(data)
            
        } catch (error) {
            console.log(error)
        }finally{
            setLoadPendingTransactions(false)
        }
    }

    useEffect(() => {
        fetchPendingTransactions()
    }, []);

    return {
        pendingTransactions, loadPendingTransactions, setLoadPendingTransactions, fetchPendingTransactions
    }

   
}

export const useAllTransactions = () =>{


    const [loadTransactions, setLoadTransactions] = useState(false)
    const [transactions, setTransactions] = useState([]);
    
    const fetchAllTransactions = async() =>{
        try {

            setLoadTransactions(true)

            const {data} = await axiosInstance.get('/wallet');
            

            setTransactions(data)
            
        } catch ({response}) {
            console.log(response)
        }finally{
            setLoadTransactions(false)
        }
    }

    useEffect(() => {
        fetchAllTransactions()
       
    }, []);

    return {
        transactions, loadTransactions, setLoadTransactions, fetchAllTransactions
    }

   
}

