export const calculateReadTime = (text:string, wordsPerMinute = 200):string=>{
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1,Math.ceil(words/wordsPerMinute));
    return `${minutes} min read`;
};