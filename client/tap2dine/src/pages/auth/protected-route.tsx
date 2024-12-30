import { Navigate } from "react-router";
import useAuthContext from "../../hooks/useAuthContext"


export default function ProtectedRoute({children}: {children: React.ReactNode}) {
    const {isAuthenticated} = useAuthContext();
    console.log(isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/auth" />
}
