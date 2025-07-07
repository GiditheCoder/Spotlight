import { View, Text, TouchableOpacity, ScrollView, Pressable } from 'react-native'
import React from 'react'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useLocalSearchParams } from 'expo-router'
import { Id } from '@/convex/_generated/dataModel'
import { Loader } from '@/components/Loader'
import { styles } from '@/styles/profile.style.s'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'
import { Image } from 'expo-image'
import { FlatList } from 'react-native'
import { useRouter } from 'expo-router'


export default function UserProfileScreen() {

    const {id} = useLocalSearchParams()

   const router = useRouter()  
    const profile = useQuery(api.users.getUserProfile , {id :id as Id<"users">})
  const posts = useQuery(api.posts.getPostsByUser, { userId :id as Id<"users">})
 
     const isFollowing = useQuery(api.users.isFollowing, {followingId:id as Id<"users">})

    //  why is there no passage of id here 
     const toggleFollow = useMutation(api.users.toggleFollow)


     const handleBack = ()=>{
      if(router.canGoBack()) router.back();
      else(router.replace("/(tabs)"))
     }

     if(profile === undefined || posts === undefined || isFollowing === undefined ) return <Loader/>

    //  so we wuld build out the headers section 
  return (
    <View style={styles.container}>
        <View  style={styles.header}>
            <TouchableOpacity onPress={handleBack}>
  <Ionicons name='arrow-back' size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{profile.username}</Text>
            <View style={{width: 24}}/>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* thisis the proffile info */}
              <View style={styles.profileInfo}> 
                    
                 <View style={styles.avatarAndStats}>

                <Image 
                source={profile.image}
                style={styles.avatar}
                contentFit='cover'
                cachePolicy="memory-disk"
                />

                {/* STATS */}

                <View style={styles.statsContainer}>
                  {/* 1 */}
                  <View style={styles.statItem}>
                    <Text style={styles.statNumber}>{profile.posts}</Text>
                     <Text style={styles.statLabel}>Post</Text>
                  </View>
                  {/* 2 */}
                  <View style={styles.statItem}>
                  <Text style={styles.statNumber}>{profile.followers}</Text>
                     <Text style={styles.statLabel}>followers</Text>
                  </View>
                  {/* 3 */}
                  <View style={styles.statItem}>
                     <Text style={styles.statNumber}>{profile.following}</Text>
                     <Text style={styles.statLabel}>following</Text>
                  </View>

                </View>




                 </View>

                 <Text style={styles.name}>{profile.fullname}</Text>
                 {profile.bio && <Text style={styles.bio}>{profile.bio}</Text>}

                  <Pressable
                  style={[styles.followButton , isFollowing && styles.followingButton]}
                  onPress={()=> toggleFollow( {followingId: id as Id<"users">})}
                  >
                   <Text
                   style={[styles.followButtonText , isFollowing && styles.followingButtonText]}
                   >
                     {isFollowing ?  "Following" : "follow"}
                   </Text>
                  </Pressable>

              </View>
    {/* kaka */}
   {/* <View style={styles.postsGrid}>
    {posts.length === 0 ? 
            (
           <View style={styles.noPostsContainer}>
        <Ionicons name='images-outline' size={48} color={COLORS.grey}  />
        <Text style={styles.noPostsText}> No Posts Yet</Text>
         </View>> 
         ) 
         :(
          <FlatList
  data={posts}
  numColumns={3}
  scrollEnabled={false}
  renderItem={({ item }) => (
    <TouchableOpacity style={styles.gridItem}>
      <Image
        source={item.imageUrl}
        style={styles.gridImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
    </TouchableOpacity>
  )}
  keyExtractor={(item) => item._id}
/>

         )}

   </View> */}


   <View style={styles.postsGrid}>
  {posts.length === 0 ? (
    <View style={styles.noPostsContainer}>
      <Ionicons name="images-outline" size={48} color={COLORS.grey} />
      <Text style={styles.noPostsText}>No Posts Yet</Text>
    </View>
  ) : (
    <FlatList
      data={posts}
      numColumns={3}
      scrollEnabled={false}
      renderItem={({ item }) => (
        <TouchableOpacity style={styles.gridItem}>
          <Image
            source={item.imageUrl}
            style={styles.gridImage}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
          />
        </TouchableOpacity>
      )}
      keyExtractor={(item) => item._id}
    />
  )}
</View>



        </ScrollView>
     
    </View>
  )
}