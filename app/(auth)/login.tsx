import { View, Text } from 'react-native'
import React from 'react'
import { styles } from '@/styles/auth.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'
import { Image } from 'react-native'
import { TouchableOpacity } from 'react-native'
import { useSSO } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'




export default function login() {
 
 const {startSSOFlow} = useSSO()
 const router =  useRouter()


 const handleSignin = async() =>{
  try {
  const {createdSessionId ,setActive} =  await startSSOFlow({strategy: "oauth_google"})

  if(setActive && createdSessionId){
    setActive({session: createdSessionId})
    router.replace("/(tabs)")
  }

  } catch (error) {
    console.error("OAuth error:", error)
    
  }
 }

  return (
    <View style={styles.container} >

        {/* BRAND SECTION */}

     <View style={styles.brandSection}>

         <View style={styles.logoContainer}>
        <Ionicons name='leaf' size={32} color={COLORS.primary} />
         </View>

         <Text  style={styles.appName} >
            spotlight
         </Text>

         <Text  style={styles.tagline}>
           Don't miss anything
         </Text>
     </View>

     {/* ILLUSTRATIONS */}

     <View style={styles.illustrationContainer}> 
  <Image 
    source={require("../../assets/images/social.png")}
    style={styles.illustration}
    resizeMode="cover"
  />
</View>

{/* LOFIN section */}

<View style={styles.loginSection}>
  <TouchableOpacity
    style={styles.googleButton}
    onPress={handleSignin}
    activeOpacity={0.9}
  >
    <View style={styles.googleIconContainer}>
      <Ionicons name="logo-google" size={20} color={COLORS.surface} />
    </View>
    <Text style={styles.googleButtonText}>Continue with Google</Text>
  </TouchableOpacity>

  <Text style={styles.termsText}>
    By continuing, you agree to our Terms and Privacy Policy
  </Text>
</View>



    </View>
  )
}