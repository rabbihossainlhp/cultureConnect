import {createContext,useContext,useEffect,useMemo,useState} from 'react';
import { meApiHandler,logoutApiHandler } from '../services/api.service';


type User = {id?: number; username:string; email:string; country:string;};


type AuthContextType = {
    user: User | null;
    isAuthenticated:boolean;
    isLoading:boolean;
    refreshAuth: ()=>Promise<void>;
    logout:()=>Promise<void>;
};


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider ({children}:{children:React.ReactNode}){
    const [user, setUser] = useState<User | null>(null);
    const [isLoading,setIsLoading] = useState(true);

    const refreshAuth = async () =>{
        setIsLoading(true);
        try{
            const res = await meApiHandler();
            if(res.success && res.data){
                setUser(res.data);
            }
            else{
                setUser(null);
            }
        }catch{
            setUser(null);
        }finally{
            setIsLoading(false);
        }
    };



    const logout = async() =>{
        try{
            await logoutApiHandler();
        }finally{
            setUser(null);
        }
    }

    useEffect(()=>{
        void refreshAuth();
    },[]);

    const value = useMemo(()=>({
        user,isAuthenticated: !!user, isLoading, refreshAuth, logout
    }), [user,isLoading]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};


export function useAuth (){
    const cntx = useContext(AuthContext);
    if(!cntx) throw new Error('useAuth must be used inside AuthProvider');

    return cntx;
}