import React, { createContext,  useEffect,  useState } from "react"

type AuthContextType = {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    logout: () => void;
    isLoading: boolean;
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
    validateToken: () => void;
    accessToken: string | null;
    setAccessToken:React.Dispatch<React.SetStateAction<string | null>>;
}

export const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken"));

    const validateToken = async () => {
        setIsLoading(true);
        const token = accessToken; // Use the state instead of fetching from localStorage
        if (!token) {
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}test-auth/`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            setIsAuthenticated(data.message === "You are authenticated");
        } catch (error) {
            setIsAuthenticated(false);
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        validateToken(); // Validate on initial load
    }, [accessToken]); // Re-validate whenever the token changes
    
    const logout = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
    }
    

    return (
        <AuthContext.Provider value={{isAuthenticated, setIsAuthenticated, logout, isLoading,setIsLoading,validateToken,accessToken,setAccessToken}}>
            {children}
        </AuthContext.Provider>
    )
}


