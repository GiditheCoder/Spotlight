import { View, Text, Modal, KeyboardAvoidingView, Platform, FlatList, TextInput } from 'react-native'
import React, { useState } from 'react'
import { Id } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { styles } from '@/styles/feed.styles';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/theme';
import { Loader } from './Loader';
import Comment from './Comment';


    type CommentsModal = {
         postId : Id<"posts">;
        visible : boolean;
        onClose :  ()=> void;
    
    }

        // onCommentAdded :  ()=> void;

    // in this case , we pass the props inside to destructure

export default function CommentsModal({postId, visible, onClose} : CommentsModal) {
   
    // we need to be able to have access to the previous and current code 
    // we would start with an empty state
    const [newComment, setNewComment] = useState("")

   const comments = useQuery(api.comments.getComment , { postId}  )
   const addComment =  useMutation(api.comments.addComment)

// thisis the function that would handle the comment function

   const handleAddComment = async () =>{
    if(!newComment.trim()) return

    try {
       await addComment({
        content: newComment,
        postId 
       })

       setNewComment("")
      //  this increments the commentsCount
      //  onCommentAdded()  
    } catch (error) {
      console.log("Error adding cmmnent", error)
    }
   }

  return (
    // We would then build out the ui here 
    // we would then pass the props we got from the Posts.tsx here 
    <Modal visible={visible} animationType='slide' transparent={true} onRequestClose={onClose}>  
    
    {/* we woudl pass the behavior and then the style */}
     <KeyboardAvoidingView
     behavior={Platform.OS === "ios" ? "padding" : "height"}
     style={styles.modalContainer}
     >
{/* This is the top view */}
        <View style={styles.modalHeader}>
  <TouchableOpacity onPress={onClose}>
    <Ionicons name="close" size={24} color={COLORS.white} />
  </TouchableOpacity>
  <Text style={styles.modalTitle}>Comments</Text>
  <View style={{ width: 24 }} />
</View>

{/* this is the main comment section side  */}
{comments === undefined ? (
    // loader is an example of a reusable component
    <Loader />
) : (
    <FlatList 
     data={comments}
     keyExtractor={(item)=> item._id}
     renderItem={  ({item}) => <Comment comment={item}   />}
     contentContainerStyle ={styles.commentsList}
    />
)}


<View
style={styles.commentInput}
>
<TextInput
  style={styles.input}
  placeholder='Add a comment...'
  placeholderTextColor={COLORS.grey}
  value={newComment}
  onChangeText={setNewComment}
  multiline
/>

<TouchableOpacity 
onPress={handleAddComment}  disabled={!newComment.trim()}
>
    <Text
    style={[styles.postButton , !newComment.trim() && styles.postButtonDisabled]}
    >
     Post
    </Text>

</TouchableOpacity>
</View>
        
     </KeyboardAvoidingView>


    </Modal>
  )
}