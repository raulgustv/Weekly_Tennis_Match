import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context";

const ProtectedRoute = () => {

    const {isAuthenticated, loading} = useAuth();

    if(loading) return null; //add a spinner 

    if(!isAuthenticated){
        return <Navigate to='/login' replace />
    }

    return <Outlet />
}

export default ProtectedRoute

