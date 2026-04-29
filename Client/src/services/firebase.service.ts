//dependencies....
import {auth,provider} from "../config/firebaseConfig.js"
import {signInWithPopup} from "firebase/auth"; 



export const logSignControllerWithGoogle = async()=>{
    
    const result = await signInWithPopup(auth,provider);
    return result;
}