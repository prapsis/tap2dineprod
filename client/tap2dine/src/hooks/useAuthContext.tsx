import { useContext } from "react";
import { AuthContext } from "../context/authContext";

export default function useAuthContext(){
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuthContext must be used within a AuthProvider')
    }
    return context
}
