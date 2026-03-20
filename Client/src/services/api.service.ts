import type { LoginPayload, LoginResponse, MeResponse, SignupResponse, SingupPayload } from "../constants/interface";

const Base_api_url = import.meta.env.VITE_API_URI;


//api handler for signup
export const signupApiHandler = async(payload:SingupPayload): Promise<SignupResponse> =>{
    const res = await fetch(`${Base_api_url}/auth/register`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload),
    });

    const data = (await res.json()) as SignupResponse;

    if(!res.ok){
        throw new Error(data.message || "Signup failed!..");
    };

    return data;
}




///api handler for login 
export const loginApiHandler = async(payload:LoginPayload):Promise<LoginResponse> =>{
    const res = await fetch(`${Base_api_url}/auth/login`,{
        method:"POST",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload),
    });

    const data = (await res.json()) as LoginResponse;

    if(!res.ok){
        throw new Error(data.message || "Login failed!");
    };

    return data;
}






//own / me api handler...
export const meApiHandler = async():Promise<MeResponse> =>{
    const res = await fetch(`${Base_api_url}/profile`, {
        method:"GET",
        credentials:"include",
    });

    if(!res.ok){
        if(res.status === 401) return {success:false, message:'UnAuthorized'};
        throw new Error("Session check failed");
    }

    return (await res.json()) as MeResponse;
}