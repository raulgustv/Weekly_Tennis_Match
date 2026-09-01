import { useContext, useState, createContext, useEffect, useCallback } from "react";
import { getNotificationToken, getUserAuth } from "../actions/auth";
import { getToken } from "firebase/messaging";
//import { toast } from "react-toastify";
import { messaging } from "../config/firebase";
import axiosInstance, { setAccessToken, refreshSession, setOnSessionExpired } from "../API/axios"; // ajusta el path si tu archivo se llama distinto

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
    //
    // 🔧 FIX (logout bug): ahora usa refreshSession(), la misma función
    // compartida que usa el interceptor 401 de axios.js, en vez de llamar
    // directamente a axiosInstance.post("/user/refresh"). Antes esta función
    // y el interceptor podían disparar cada uno su propio refresh al mismo
    // tiempo (típicamente justo cuando la app vuelve de segundo plano y, a la
    // vez, algún fetch en curso recibía un 401), chocando con la rotación de
    // un solo uso del refresh token en el backend y provocando un logout sin
    // que el refresh token de 30 días hubiera caducado realmente.
    const tryRestoreSession = useCallback(async () => {
        try {
            await refreshSession();
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

    // 🔧 FIX (logout bug): se suscribe al aviso de "sesión terminada de
    // verdad" que ahora emite axios.js cuando un refresh disparado por el
    // interceptor 401 falla de forma definitiva (refresh token realmente
    // inválido o caducado). Antes esto no existía y el estado `user` podía
    // quedarse desincronizado del backend — la UI seguía pensando que había
    // sesión mientras todas las peticiones fallaban en segundo plano.
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