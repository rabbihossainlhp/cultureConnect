import type { Message, RoomUser } from "../constants/interface";

export type ToastState = {
    type: "error" | "success";
    message:string;
};




export type CulturePost = {
    id: number;
    title: string;
    excerpt: string;
    country: string;
    category: "Tradition" | "Food" | "Language" | "Festival" | "History";
    author: string;
    readTime: string;
    published: string;
    likes: number;
    comments: number;
};





export type UiRoom = {
  id: string;
  roomId: number;
  name: string;
  language: string;
  description?: string;
  createdAt: string;
};







export type RoomJoinedPayload = {
  room: {
    id: number;
    slug: string;
    name: string;
    language: string;
    visibility: string;
    status: string;
  };
  users: RoomUser[];
  messages: Message[];
};




