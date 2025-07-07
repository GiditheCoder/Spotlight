import { useAuth } from '@clerk/clerk-expo';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, ReactNode } from 'react';

interface InitialLayoutProps {
  children: ReactNode;  // Accept children as a prop
}

export default function InitialLayout({ children }: InitialLayoutProps) {
  const { isLoaded, isSignedIn } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Check if we are in the auth page and also to check if Clerk is initialized
  useEffect(() => {
    if (!isLoaded) return;

    const inAuthScreen = segments[0] === "(auth)";

    if (!isSignedIn && !inAuthScreen) {
      router.replace("/(auth)/login");
    } else if (isSignedIn && inAuthScreen) {
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn, segments]);

  if (!isLoaded) return null;

  return   <>   {children}   </>

}




// import { useAuth } from '@clerk/clerk-expo'
// import { Stack, useRouter, useSegments } from 'expo-router'
// import { useEffect } from 'react';

// export default function InitialLayout() {
//  const {isLoaded , isSignedIn} = useAuth()


//  const segments = useSegments();
// const router = useRouter()

// //  we have to check if we are in the auth page and also to check if clerk is initialized
// useEffect( ()=>{
//     if(!isLoaded)
//         return;

//     const inAuthScreen = segments[0] === "(auth)"

//     if(!isSignedIn && !inAuthScreen){
//         router.replace("/(auth)/login")
//     }
//         else if (isSignedIn && inAuthScreen){
//             router.replace("/(tabs)")
//         }

        
// }, [isLoaded, isSignedIn, segments])

// if(!isLoaded) return null

// return <Stack  screenOptions={{headerShown: false}}   />

// } 
