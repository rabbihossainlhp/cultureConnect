//dependencies....
import {auth,provider} from "../config/firebaseConfig.js"
import {signInWithPopup} from "firebase/auth"; 
import { Base_api_url } from './api.service';
import type { FirebaseAuthPayload, FirebaseAuthResponse } from "../constants/interface.js";



export const logSignControllerWithGoogle = async():Promise<FirebaseAuthResponse> =>{
    
    const result = await signInWithPopup(auth,provider);

    console.log(result.user)
    const payload:FirebaseAuthPayload ={
        username:result.user.displayName,
        email:result.user.email,
        profilePicture: result.user.photoURL,
        country: "Spain" ,
        nativeLanguage: "Spanish",
        firebaseUid:result.user.uid

    }
    const fetchRequest = await fetch(`${Base_api_url}/auth/continue-with-google`,{
        method:"POST",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(payload)
    })


    const data = await fetchRequest.json();


    if(!fetchRequest.ok){
            const ErrData = await fetchRequest.json();
            throw new Error(ErrData.message || "Server synce failed during continue with ggle in frontend!..");
    };


    return data;
}