import { useContext, useState, createContext, useEffect } from 'react'

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user")

        if (token && userData) {
            setUser({ token, ...JSON.parse(userData) })
        }

        setLoading(false)
    }, [])

    const setSession = (token, userData) => {
        localStorage.setItem("token", token)
        localStorage.setItem("user", JSON.stringify(userData))
        setUser({ token, ...userData })
    }

    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated: !!user,
                loading,
                setSession,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )

}

export const useAuth = () => useContext(AuthContext)