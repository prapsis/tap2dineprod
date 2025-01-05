import { Navigate } from "react-router";
import useAuthContext from "../../hooks/useAuthContext"
import Loader from "../../components/reusables/loader";


export default function ProtectedRoute({children}: {children: React.ReactNode}) {
    const {isAuthenticated,isLoading} = useAuthContext();
    if (isLoading) return (<Loader />);
    return isAuthenticated ? children : <Navigate to="/login" />
}
