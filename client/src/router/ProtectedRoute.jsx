import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context";
import LoadingSpinner from "../components/utils/LoadingSpinner";

const ProtectedRoute = () => {

    const {isAuthenticated, loading} = useAuth();

    if(loading) return <LoadingSpinner />; //add a spinner 

    if(!isAuthenticated){
        return <Navigate to='/login' replace />
    }

    return <Outlet />
}

export default ProtectedRoute

