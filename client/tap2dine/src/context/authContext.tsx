import React, { createContext, useEffect, useState } from "react"

type AuthContextType = {
    isAuthenticated: boolean,
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>,
    logout: () => void,
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(()=>{
        const token = localStorage.getItem('accessToken');
        if(token) setIsAuthenticated(true);
    },[])

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, logout}}>
            {children}
        </AuthContext.Provider>
    )
}


