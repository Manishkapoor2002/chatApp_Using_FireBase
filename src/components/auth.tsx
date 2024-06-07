import {auth,provider} from '../firebase-config'
import { signInWithPopup } from 'firebase/auth'
import React from 'react'
import Cookies from 'universal-cookie'
import '../style/auth.css'
const cookies = new Cookies()
type AuthProps = {
    setIsAuth : (authToken:(string))=>void  
}
export const Auth : React.FC<AuthProps> = ({setIsAuth}) =>{
    
    const signUpWithUser = async () =>{
        try{
            const result = await signInWithPopup(auth,provider)
            cookies.set('auth-token',result.user.refreshToken);
            console.log(result.user.displayName)
            cookies.set('currentUsername',result.user.displayName)
            setIsAuth(result.user.refreshToken)
        }catch(err){
            console.error(err)
        }
    }
    return <div className="signup-container">
    <p>Sign up with Google to continue!</p>
    <button className="signup-button" onClick={signUpWithUser}>
        <img 
            src="https://static-00.iconduck.com/assets.00/google-icon-2048x2048-tmg5cp5v.png" 
            alt="Google Icon" 
            width="20"
        />
        Sign up with Google
    </button>
</div>
}