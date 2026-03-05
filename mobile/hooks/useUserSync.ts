import { useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-expo";
import { useApiClient,userApi } from "@/utils/api";

export const useUserSync = ()=>{
const {isSignedIn} = useAuth();
const api = useApiClient()

const syncUserMutation = useMutation({
    mutationFn:() => userApi.syncUser(api),
    onSuccess:(response:any) => console.log("User synced successfully",response.data.message),
    onError:(error:any) => {
      console.error("User sync failed,", error.response?.data || error.message);
    }
})

  useEffect(() => {
    if (isSignedIn && !syncUserMutation.isPending && !syncUserMutation.isSuccess && !syncUserMutation.isError) {
      syncUserMutation.mutate();
    }
  }, [isSignedIn, syncUserMutation.isPending, syncUserMutation.isSuccess, syncUserMutation.isError]);


return null;
}