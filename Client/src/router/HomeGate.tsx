import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import Home from "../pages/Home";



export default function HomeGate() {
    const {isAuthenticated,isLoading} = useAuth();


    if(isLoading){
        return <div className="min-h-screen grid place-items-center">Loading...</div>
    }
    if(isAuthenticated){
        return <Navigate to="/dashboard" replace/>
    }
  return <Home/>
}
