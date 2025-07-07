import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import InitialLayout from "@/components/InitialLayout";
import ClerkandConvexProvider from "@/providers/ClerkandConvexProvider";
import { Slot, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import { useCallback } from "react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "JetBrainsMono-Medium": require("../assets/fonts/JetBrainsMono-Medium.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) await SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <ClerkandConvexProvider>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1, backgroundColor: "black" }}
          onLayout={onLayoutRootView}
        >
          <InitialLayout>
            <Slot /> 
          </InitialLayout>
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkandConvexProvider>
  );
}



  {/* <Stack screenOptions={{headerShown: false}} />  */}

  
// testout the tokencache after i am done
// this is the authentication stage

// const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!

// if (!publishableKey) {
//   throw new Error(
//     'Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env',
//   )
// }


// issuerurl
// https://smooth-hen-62.clerk.accounts.dev