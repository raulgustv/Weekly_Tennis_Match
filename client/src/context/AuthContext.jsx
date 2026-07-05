import { useContext, useState, createContext, useEffect } from "react";
import { getUserAuth } from "../actions/auth";

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