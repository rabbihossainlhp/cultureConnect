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



export interface LoginPayload{
    email:string;
    password:string;
}


export interface LoginResponse{
    success:boolean,
    message:string;
    data?:{
        username:string;
        email:string;
        country:string;
    }
}




export interface MeResponse{
    success:boolean;
    data?:{username:string,email:string; country:string};
    message:string;
}