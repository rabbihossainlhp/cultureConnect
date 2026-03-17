
const Base_api_url = import.meta.env.VITE_API_URI;


export interface SingupPayload{
    username:string;
    email:string;
    country:string;
    nativeLanguage:string;
    password:string;
}


export interface SignupResponse{
    success:boolean;
    message:string;
    data?:{
        id:number;
        email:string;
        username:string;
        country:string;
        native_language:string;
        created_at:string;
    }
}

const signupApiHandler = async(payload:SingupPayload): Promise<SignupResponse> =>{
    const res = await fetch(`${Base_api_url}/auth/register`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload),
    });

    const data = (await res.json()) as SignupResponse;

    if(!res.ok){
        console.log(res.json());
    };

    return data;
}

export default signupApiHandler;