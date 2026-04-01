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

export interface CreateRoomPayload {
  slug: string;
  roomName: string;
  language: string;
  visibility: "public" | "private";
  capacity: number;
}

export interface CreateRoomResponse {
  success: boolean;
  message: string;
  room?: {
    id: number;
    name: string;
    slug: string;
    language: string;
    visibility: "public" | "private";
    capacity: number;
  };
}

export interface RoomListItem {
  id: number;
  name: string;
  description: string | null;
  language: string;
  status: string;
  visibility: "public" | "private";
}

export interface RoomListResponse {
  success: boolean;
  message: string;
  data?: RoomListItem[];
}

export interface CreatePostPayload {
  title: string;
  description: string;
  tags: string[];
  slug: string;
  readtime:string;
}

export interface PostItem {
  id: number;
  author_id: number;
  title: string;
  description: string | null;
  tags: string[] | null;
  slug: string;
  post_image: string | null;
  status: string;
  readtime: string | null;
  likes: number;
  comments_count: number;
  created_at: string;
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  data?: PostItem;
}

export interface PostListResponse {
  success: boolean;
  message: string;
  data?: PostItem[];
}