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






//realtiem type:
export interface Message {
  userId: string;
  username: string;
  text: string;
  timestamp: string;
}

export interface RoomUser {
  userId: string;
  username: string;
  country: string;
}

export interface Room {
  id: string;
  name: string;
  language: string;
  members: number;
}




export interface Message {
  id?: number;
  roomId?: number;
  userId: string | number;
  username: string;
  text: string;
  timestamp: string;
}

export interface RoomUser {
  userId: string | number;
  username: string;
  country: string;
}