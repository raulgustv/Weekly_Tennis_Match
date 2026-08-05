import { useContext, useState, createContext, useEffect } from "react";
import { getNotificationToken, getUserAuth } from "../actions/auth";
import { getToken } from "firebase/messaging";
//import { toast } from "react-toastify";
import { messaging } from "../config/firebase";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async (token) => {

        try {

            const res = await getUserAuth();

            setUser({
                token,
                ...res.data
            });

        } catch (error) {

            localStorage.removeItem("token");
            setUser(null);

        } finally {

            setLoading(false);

        }
    };



    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        loadUser(token);

    }, []);



    useEffect(() => {
        if (!user) return;

        const regsiterFCM = async () => {
            try {

                const token = await getToken(messaging, {
                    vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
                })

                await getNotificationToken(token)

                //console.log(response)

            } catch (error) {
                console.log(error)
                //toast.error('Error generating FCM token')
            }
        }

        regsiterFCM()

    }, [user])

    // login / refresh session
    const setSession = async (token) => {

        localStorage.setItem("token", token);

        setLoading(true);

        await loadUser(token);

    };

    const logout = () => {

        localStorage.removeItem("token");
        setUser(null);
    };



    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                setSession,
                logout,
                loadUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);