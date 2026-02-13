import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context";

const AdminRoute = () => {

    const {user, loading} = useAuth();

    if(loading) return null //add spinner

    //in this condition do soemthing, redirect to not auth
    if(!user || user.role !== 'admin'){
        return <Navigate to='/login' replace />
    }

    return <Outlet />

    
}

export default AdminRoute
