import { Stack } from "expo-router";
import { ClerkProvider } from '@clerk/clerk-expo'
import { tokenCache } from '@/utils/cache'
import "../global.css"
import { QueryClient,QueryClientProvider} from "@tanstack/react-query"



const queryClient = new QueryClient()
export default function RootLayout() {
  return( 
  <ClerkProvider tokenCache={tokenCache}>
    <QueryClientProvider client={queryClient}>
  <Stack screenOptions={{
    headerShown:false,
  }}>
    <Stack.Screen name="(auth)" options={{headerShown:false,headerTitleAlign:'center'}}/>
    <Stack.Screen name="(tabs)" options={{headerShown:false}}/>
  </Stack>
  </QueryClientProvider>
</ClerkProvider>
)
}
