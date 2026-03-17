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