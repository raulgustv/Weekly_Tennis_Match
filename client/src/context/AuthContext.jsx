import { useContext, useState, createContext, useEffect } from 'react'
import { getUserAuth } from '../actions/auth';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {

            const token = localStorage.getItem("token");

            if (!token) {
                setLoading(false);
                return;
            }

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

        initAuth();

    }, []);

    // ✅ NUEVA setSession limpia
    const setSession = async (token) => {
        localStorage.setItem("token", token);

        try {
            const res = await getUserAuth();

            setUser({
                token,
                ...res.data
            });
        } catch (error) {
            localStorage.removeItem("token");
            setUser(null);
        }
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
                setSession,   // 👈 vuelve a exportarse
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);