import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";



export default function GuestRoute({children}:{children:React.ReactNode}) {
    const {isAuthenticated,isLoading} = useAuth();

    if(isLoading){
        return <div className="min-h-screen grid place-items-center">Loading...</div>
    }
    // If authenticated, redirect to dashboard
    // If not authenticated, show the page
    return !isAuthenticated? children:<Navigate to="/dashboard" replace />;
}
