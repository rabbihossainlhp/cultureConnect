import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";



export default function ProtectedRoute({children}:{children:React.ReactNode}) {
    const {isAuthenticated,isLoading} = useAuth();

    if(isLoading){
        return <div className="min-h-screen grid place-items-center">Loading...</div>
    }
    return isAuthenticated? children:<Navigate to="/auth/login" replace />;

}
