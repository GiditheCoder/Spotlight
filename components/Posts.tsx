import { COLORS } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { Link, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import CommentsModal from "./CommentsModal";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/clerk-expo";
import React from "react";



// the typical reason why we use postProps is to be able to determine what each element is 
// and also to be type safe


type PostProps = {
  post :{
   _id: Id<"posts"> ;
    _creationTime: number;
    caption?: string | undefined;
    userId: Id<"users">;
    imageUrl: string;
    storageId: Id<"_storage">;
    likes: number;
    comments: number;
    // i added isLiked and isBookMarked
    isLiked: boolean;       
    isBookMarked: boolean; 
    author:{
      id : string;
      username: string;
      image: string;
  };

  };
};

export default function Post({post}: PostProps){

// there is an error with this line
// we also have to build a like counter
  const [isLiked , setIsLiked] = useState(post.isLiked) 
  const [isBookMarked , setIsBookmarked] = useState(post.isBookMarked) 
  
  // const [likesCount , setLikesCount] = useState(post.likes) 

  // we created 2 states in this ase , one for the counts and one to show the comment or not 
  // we create the states for the comments also to be able to have access the number of comments 

  //  const [commentsCount , setCommentsCount] = useState(post.comments) 
 //  this is the 3rd flow

   const [showComments , setShowComments] = useState(false)

  //  this is the user stored in clerk
  //  const {id} = useLocalSearchParams()
  const {user} = useUser()
//  this is the user stored in the database of Convex --- to the users.ts 
 const currentUser =  useQuery(api.users.getUserByClerkId , user ? {clerkId : user.id } : "skip")
  //  get the mutation
  const toggleLike = useMutation(api.posts.toggleLike)
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark)
  const deletePost = useMutation(api.posts.deletePost)


  // this would handle the function
  const handleLike = async ()=>{
    // the code we are wriing here is to e toggle the like between like + 1 and like -1  
     try {
    const newIsLiked  = await toggleLike({postId: post._id})
       setIsLiked(newIsLiked)
     } catch (error) {
       console.error("Error toggling like:", error)
     }
  }
  
  const handleBookmark =  async ()=>{
    const newIsBookMarked = await toggleBookmark({postId: post._id})
    setIsBookmarked(newIsBookMarked)
    
  }


  const handleDelete = async ()=>{
    try {
       await deletePost({postId : post._id})
       
    } catch (error) {
      console.error("Error deleting the post" , error)
    }
  }

  

    return(
        <View style={styles.post}>
            {/* POST HEADERS */}
            <View style={styles.postHeader}>
              {/* track where ost is coming from */}
  <Link 
  href={currentUser?._id === post?.userId
    ? "/(tabs)/profile" 
    : `/user/${post?.userId}`}  // Use _id instead of username
  asChild
>
        <TouchableOpacity style={styles.postHeaderLeft}>
  <Image
    source={post.author.image}
    style={styles.postAvatar}
    contentFit="cover"
    transition={200}
    cachePolicy="memory-disk"
  />
  <Text style={styles.postUsername}>{post.author.username}</Text>
</TouchableOpacity>

                </Link>

              
                {/* this is a delet button to be fixed later */}
  {/* console log the post.author.id */}
  {/* i fixed the issue here */}
                {   currentUser?._id === post.author.id ? 
                (
    <TouchableOpacity onPress={handleDelete}>
                    <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
                 </TouchableOpacity>
                ) : (
  <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={20} color={COLORS.white} />
                 </TouchableOpacity> 
                )} 
           
            </View>
            {/* This is the image section */}

            <Image 
            source={post.imageUrl}
            style={styles.postImage}
            contentFit="cover"
            transition={200}
            cachePolicy="memory-disk"
            />

            {/* POST ACTIONS */}
<View style={styles.postActions}>


  <View style={styles.postActionsLeft}>
    <TouchableOpacity 
    onPress={handleLike}
    >
      <Ionicons
       name={isLiked ? "heart" : "heart-outline"} 
      size={24} 
// make the color also dynamic
      color={isLiked ? COLORS.primary : COLORS.white} />
    </TouchableOpacity>


    <TouchableOpacity  onPress={()=> setShowComments(true)}   >
      <Ionicons name="chatbubble-outline" size={22} color={COLORS.white} />
    </TouchableOpacity> 
  </View>
  <TouchableOpacity onPress={handleBookmark}>
    <Ionicons
     name={isBookMarked ? "bookmark" : "bookmark-outline"}
      size={22} 
      color={COLORS.white}
       />
  </TouchableOpacity>
</View>


    {/* POST INPUT */}

    <View style={styles.postInfo}>
      {/* {post.likes} */}
  <Text style={styles.likesText}>

    {post.likes > 0 ? `${post.likes.toLocaleString()} likes` : "Be the first to Like "}
  </Text>
  {post.caption && (
    <View style={styles.captionContainer}>
      <Text style={styles.captionUsername}>{post.author.username}</Text>
      <Text style={styles.captionText}>{post.caption}</Text>
    </View>
  )}

{/* we want to view this conditionally instead of just static */}

{ post.comments > 0 && (
 <TouchableOpacity   onPress={()=> setShowComments(true)} >
    <Text style={styles.commentsText}>View all {post.comments} comments</Text>
  </TouchableOpacity>
)}
  
  {/* {post.timeAgo}  */}
  {/* we have to use a timestamp function */}
  <Text style={styles.timeAgo}>
   {formatDistanceToNow(post._creationTime,{addSuffix: true})}
    
    </Text>

</View>

{/* The comment Modal that is the component depends on this  */}
      <CommentsModal
        postId =  {post._id}
        visible ={ showComments}
        onClose = {()=> setShowComments(false)}
        // we also remove the comment from here 
       
      />

       {/* onCommentAdded = {()=> setCommentsCount((prev)=> prev + 1)} */}

        </View>
    )
}





  // i removed undefined fro the dependencies
  // "undefined": "\\"