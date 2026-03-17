import type { LoginPayload, LoginResponse, SignupResponse, SingupPayload } from "../constants/interface";

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
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload),
    });

    const data = (await res.json()) as LoginResponse;

    if(!res.ok){
        throw new Error(data.message || "Login failed!");
    };

    return data;
}




