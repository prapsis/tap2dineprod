import React, { createContext, useEffect, useState } from "react"

type AuthContextType = {
    isAuthenticated: boolean
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
    logout: () => void
    isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    useEffect(()=>{
        const token = localStorage.getItem('accessToken');
        if(token) setIsAuthenticated(true);
        setIsLoading(false);
    },[])

    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
    }

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, logout, isLoading}}>
            {children}
        </AuthContext.Provider>
    )
}


