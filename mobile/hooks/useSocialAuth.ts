import * as Linking from "expo-linking"
import { useSSO } from "@clerk/clerk-expo"
import { useState } from "react"
import { Alert } from "react-native";


export const useSocialAuth = () => {
 const [isLoading,setIsLoading] = useState(false)
 const {startSSOFlow} = useSSO();

 const handelSocialAuth = async(strategy:"oauth_google"| "oauth_apple")=>{
  setIsLoading(true)
  try {
    const { createdSessionId,setActive } = await startSSOFlow({
        strategy,
        redirectUrl: Linking.createURL('/', { scheme: 'mobile' })
    })
    if(createdSessionId && setActive){
        await setActive({session:createdSessionId});
        
    }
  } catch (err) {
    console.log(err);
    const provider = strategy === "oauth_google"?"Google":"Apple"
    Alert.alert("Error",`Failed to sign in with ${provider}. please try again `)
    
  }finally{
    setIsLoading(false)
  }
 }

    return {isLoading,handelSocialAuth}
} 