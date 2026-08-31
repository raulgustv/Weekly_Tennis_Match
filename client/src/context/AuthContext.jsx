import { useContext, useState, createContext, useEffect, useCallback } from "react";
import { getNotificationToken, getUserAuth } from "../actions/auth";
import { getToken } from "firebase/messaging";
//import { toast } from "react-toastify";
import { messaging } from "../config/firebase";
import axiosInstance, { setAccessToken, setOnSessionExpired } from "../API/axios"; // ajusta el path si tu archivo se llama distinto

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // true solo cuando el usuario acaba de registrarse en esta sesión de la app
    // NUNCA se persiste, NUNCA se prende desde tryRestoreSession
    const [justRegistered, setJustRegistered] = useState(false);

    // trae los datos del usuario asumiendo que el access token ya está seteado en memoria
    const loadUser = useCallback(async () => {
        try {
            const res = await getUserAuth();
            setUser(res.data.user);   // ✅ backend manda { ok, user }
        } catch (error) {
            setAccessToken(null);
            setUser(null);
        }
    }, []);

    // intenta recuperar sesión vía refresh token (cookie httpOnly)
    const tryRestoreSession = useCallback(async () => {
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
    }, [loadUser]);

    // al montar la app
    useEffect(() => {
        const bootstrap = async () => {
            await tryRestoreSession();
            setLoading(false);
        };

        bootstrap();
    }, [tryRestoreSession]);

    // al volver del segundo plano (clave para iOS PWA / app añadida a inicio)
    useEffect(() => {
        const handleVisibilityChange = async () => {
            if (document.visibilityState === "visible") {
                await tryRestoreSession();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
    }, [tryRestoreSession]);

    // si el interceptor de axios detecta que el refresh token ya no es
    // válido (sesión caducada de verdad, no un simple access token vencido),
    // limpiamos aquí el usuario. ProtectedRoute reacciona a isAuthenticated
    // y redirige a /login solo, sin que ninguna pantalla tenga que mostrar
    // un error de token.
    useEffect(() => {
        setOnSessionExpired(() => {
            setUser(null);
            setJustRegistered(false);
        });

        return () => setOnSessionExpired(null);
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

    // se llama justo después de un login o registro exitoso, con el accessToken que devuelve el backend
    // options.fromRegister === true SOLO cuando viene del flujo de registro
    const setSession = async (accessToken, { fromRegister = false } = {}) => {

        setAccessToken(accessToken);
        setLoading(true);

        await loadUser();

        setJustRegistered(fromRegister);

        setLoading(false);
    };

    // se llama cuando el usuario cierra/ignora el modal, o cuando ya se verificó
    const dismissJustRegistered = () => setJustRegistered(false);

    const logout = async () => {

        try {
            await axiosInstance.post("/user/logout");
        } catch (error) {
            // aunque falle el request al backend, igual limpiamos el estado local
        } finally {
            setAccessToken(null);
            setUser(null);
            setJustRegistered(false);
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
                loadUser,
                justRegistered,
                dismissJustRegistered
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);