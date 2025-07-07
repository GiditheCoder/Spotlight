import { Text, View, TouchableOpacity , Pressable , Image, ScrollView, FlatList} from "react-native";
import {styles} from "../../styles/feed.styles";
import { Link } from "expo-router";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { useQueries, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import Post from "@/components/Posts";
import { useState } from "react";
import { RefreshControl } from "react-native";
import Story from "@/components/Story";




// tabs edit
export default function Index() {

 const posts = useQuery(api.posts.getFeedPost)
 const [refreshing , setIsRefreshing] = useState(false)
 

 const onrefresh = () =>{
  setIsRefreshing(true)
  setTimeout(()=>{
    setIsRefreshing(false)
   // then we want call the posts query again to get the latest posts using tanstack query

    // this will invalidate the query and refetch the data
    // this is how we can refresh the data in react query
  }, 1000)
 

 }

 if(posts === undefined) return <Loader />
 if(posts.length === 0) return <NoPostsFound />

  return (
    <View style={styles.container} >
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>spotlight</Text>
        
       <TouchableOpacity>
  <Ionicons  name="chatbubble-outline"  size={22} color={COLORS.white} />
       </TouchableOpacity>
      </View>
  
{/* we would create states so that incase we have successfully posted a story , it would change depending */}
   
      <View >
        <ScrollView >
          <Story />
          
        </ScrollView>
      </View>

      {/* Posts */}
       
      


  <FlatList 
  data={posts}
  renderItem=  { ({ item })=> <Post post= {item} />}
  keyExtractor = {(item) => item._id}
  showsVerticalScrollIndicator ={false}
  contentContainerStyle = {{paddingBottom : 60}}
  refreshControl={
    <RefreshControl 
      refreshing={refreshing}
      onRefresh={onrefresh}
      tintColor={COLORS.primary}
    />
  }
     />

 
      
    </View>
  );
}



const NoPostsFound = () => (
  <View
    style={{
      flex: 1,
      backgroundColor: COLORS.background,
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
  </View>
);


//  ListHeaderComponent={<Stories />}

  {/* scroll Indicator for the bottom part */}

    {/* <ScrollView  
    showsVerticalScrollIndicator={false}
    contentContainerStyle={{paddingBottom : 60}}
    > */}
{/* This is where to work on */}
      {/* {posts.map((post)=>{ */}
      {/* return  <Post key={post._id} post={post} />
      })
      } */}
      {/* </ScrollView> */}


                   {/* Stories */}
      //

   {/* stories end */}

