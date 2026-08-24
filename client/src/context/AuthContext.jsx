import { useContext, useState, createContext, useEffect } from "react";
import { getNotificationToken, getUserAuth } from "../actions/auth";
import { getToken } from "firebase/messaging";
//import { toast } from "react-toastify";
import { messaging } from "../config/firebase";
import axiosInstance, { setAccessToken } from "../API/axios"; // ajusta el path si tu archivo se llama distinto

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // trae los datos del usuario asumiendo que el access token ya está seteado en memoria
    const loadUser = async () => {
        try {
            const res = await getUserAuth();
            setUser(res.data.user);   // ✅ backend manda { ok, user }
        } catch (error) {
            setAccessToken(null);
            setUser(null);
        }
    };

    // intenta recuperar sesión vía refresh token (cookie httpOnly)
    const tryRestoreSession = async () => {
        try {
            const { data } = await axiosInstance.post("/user/refresh");
            setAccessToken(data.accessToken);
            await loadUser();
            return true;
        } catch (error) {
            setAccessToken(null);
            setUser(null);
            return false;
        }
    };

    // al montar la app
    useEffect(() => {
        const bootstrap = async () => {
            await tryRestoreSession();
            setLoading(false);
        };

        bootstrap();
    }, []);

    // al volver del segundo plano (clave para iOS PWA / app añadida a inicio)
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === "visible") {
                await tryRestoreSession();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, []);

    useEffect(() => {
        if (!user) return;

        const registerFCM = async () => {
            try {

                const token = await getToken(messaging, {
                    vapidKey: process.env.REACT_APP_FIREBASE_VAPID_KEY
                });

                await getNotificationToken(token);

            } catch (error) {
                console.log(error);
                //toast.error('Error generating FCM token')
            }
        };

        registerFCM();

    }, [user]);

    // se llama justo después de un login exitoso, con el accessToken que devuelve el backend
    const setSession = async (accessToken) => {

        setAccessToken(accessToken);
        setLoading(true);

        await loadUser();

        setLoading(false);
    };

    const logout = async () => {

        try {
            await axiosInstance.post("/user/logout");
        } catch (error) {
            // aunque falle el request al backend, igual limpiamos el estado local
        } finally {
            setAccessToken(null);
            setUser(null);
        }
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