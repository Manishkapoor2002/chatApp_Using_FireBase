import {auth,provider} from '../firebase-config'
import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import Cookies from 'universal-cookie'
const cookies = new Cookies()
type AuthProps = {
    setIsAuth : (authToken:(string))=>void  
}
export const Auth : React.FC<AuthProps> = ({setIsAuth}) =>{
    
    const signUpWithUser = async () =>{
        try{
            const result = await signInWithPopup(auth,provider)
            cookies.set('auth-token',result.user.refreshToken);
            setIsAuth(result.user.refreshToken)
        }catch(err){
            console.error(err)
        }
    }
    return <div>
            <p>Sign up with Google to continue!</p>
            <button onClick={signUpWithUser}>Sign up with Google</button>
    </div>
}