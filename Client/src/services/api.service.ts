import type {
    CreatePostPayload,
    CreatePostResponse,
    CreateRoomPayload,
    CreateRoomResponse,
    LoginPayload,
    LoginResponse,
    MeResponse,
    PostListResponse,
    RoomListResponse,
    SignupResponse,
    SingupPayload,
} from "../constants/interface";

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



//logout api handler 
export const logoutApiHandler = async ():Promise<void> =>{
    await fetch (`${Base_api_url}/auth/logout`,{
        method:"POST",
        credentials:"include",
    });
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


// create room api handler
export const createRoomApiHandler = async(
    payload: CreateRoomPayload
): Promise<CreateRoomResponse> => {
    const res = await fetch(`${Base_api_url}/room/create-room`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = (await res.json()) as CreateRoomResponse;

    if (!res.ok) {
        throw new Error(data.message || "Create room failed");
    }

    return data;
};


// room list api handler
export const getRoomListApiHandler = async(): Promise<RoomListResponse> => {
    const res = await fetch(`${Base_api_url}/room/room-list`, {
        method: "GET",
        credentials: "include",
    });

    const data = (await res.json()) as RoomListResponse;

    if (!res.ok) {
        throw new Error(data.message || "Fetch room list failed");
    }

    return data;
};


// create post api handler
export const createPostApiHandler = async (
    payload: CreatePostPayload
): Promise<CreatePostResponse> => {
    const res = await fetch(`${Base_api_url}/post/create`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });

    const data = (await res.json()) as CreatePostResponse;

    if (!res.ok) {
        throw new Error(data.message || "Create post failed");
    }

    return data;
};


// get post list api handler
export const getPostListApiHandler = async (): Promise<PostListResponse> => {
    const res = await fetch(`${Base_api_url}/post/list`, {
        method: "GET",
    });

    const data = (await res.json()) as PostListResponse;

    if (!res.ok) {
        throw new Error(data.message || "Fetch posts failed");
    }

    return data;
};