import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Modal
} from 'react-native';
import { Image } from "expo-image";
import { Ionicons } from '@expo/vector-icons';
import { styles } from '@/styles/create.styles';
import { COLORS } from '@/constants/theme';
import StoryCard from './StoryCard';
import { Doc } from '@/convex/_generated/dataModel';
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import * as FileSystem from "expo-file-system";
import * as ImagePicker from "expo-image-picker";
import { useUser } from '@clerk/clerk-expo';

export default function Story() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<Doc<'stories'> | null>(null);
 const timerRef = useRef<number | null>(null);


  const generateUploadUrl = useMutation(api.stories.generateUploadUrl);
  const createStory = useMutation(api.stories.createStory);
  const stories = useQuery(api.stories.getUserStory);
  const deleteStory = useMutation(api.stories.deleteStory);

  // i added the progress
  const [progress, setProgress] = useState(0);


  const { user } = useUser();
  const currentUser = useQuery(api.users.getUserByClerkId, user ? { clerkId: user.id } : "skip");

  // Auto-close story after 10 seconds
  // useEffect(() => {
  //   if (selectedPost) {
  //     timerRef.current = setTimeout(() => {
  //       setSelectedPost(null);
  //     }, 1000);
  //   }

  //   return () => {
  //     if (timerRef.current) {
  //       clearTimeout(timerRef.current);
  //     }
  //   };
  // }, [selectedPost]);



  useEffect(() => {
  if (selectedPost) {
    setProgress(0);
    let interval: number | null = null;

    interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 1) {
          clearInterval(interval!);
          setSelectedPost(null);
          return 1;
        }
        return prev + 0.01;
      });
    }, 10); // Every 100ms

    return () => {
      if (interval) clearInterval(interval);
    };
  }
}, [selectedPost]);


  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8
    });
    if (!result.canceled) setSelectedImage(result.assets[0].uri);
  };

  const handleShare = async () => {
    if (!selectedImage) return;

    try {
      setIsSharing(true);
      const uploadUrl = await generateUploadUrl();

      const uploadResult = await FileSystem.uploadAsync(uploadUrl, selectedImage, {
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        mimeType: "image/jpeg"
      });

      if (uploadResult.status !== 200) throw new Error("Upload Failed");

      const { storageId } = JSON.parse(uploadResult.body);
      await createStory({ storageId });
      setSelectedImage(null);
    } catch (error) {
      console.log("Error sharing post:", error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedPost?._id) {
      console.error("Cannot delete: story ID is undefined");
      return;
    }
    try {
      await deleteStory({ storyId: selectedPost._id });
      setSelectedPost(null);
    } catch (error) {
      console.error("Error deleting the post", error);
    }
  };

  return (
    <View style={styles.container}>
      {selectedImage ? (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.container}
          keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
        >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSelectedImage(null)} disabled={isSharing}>
              <Ionicons name='close-outline' size={28} color={isSharing ? COLORS.grey : COLORS.white} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>New Post</Text>
            <TouchableOpacity
              style={[styles.shareButton, isSharing && styles.shareButtonDisabled]}
              disabled={isSharing || !selectedImage}
              onPress={handleShare}
            >
              {isSharing ? (
                <ActivityIndicator size="small" color={COLORS.primary} />
              ) : (
                <Text style={styles.shareText}>Share</Text>
              )}
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={[styles.content, isSharing && styles.contentDisabled]}>
              <View style={styles.imageSection}>
                <Image
                  source={selectedImage}
                  style={styles.previewImage}
                  contentFit="cover"
                  transition={200}
                />
                <TouchableOpacity
                  style={styles.changeImageButton}
                  onPress={pickImage}
                  disabled={isSharing}
                >
                  <Ionicons name="image-outline" size={20} color={COLORS.white} />
                  <Text style={styles.changeImageText}>Change</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContainer}>
          <TouchableOpacity style={styles.storyContainer} onPress={pickImage}>
            <View style={styles.yourStoryBorder}>
              <View style={styles.yourStoryAvatar}>
                <Text style={styles.addText}>+</Text>
              </View>
            </View>
            <Text style={styles.username}>Your Story</Text>
          </TouchableOpacity>

          <FlatList
            data={stories}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => setSelectedPost(item)}>
                <StoryCard story={item} />
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      )}

     
     <Modal
  visible={!!selectedPost}
  animationType="fade"
  transparent
  onRequestClose={() => setSelectedPost(null)}
>
  <View style={styles.modalBackdrop}>
    <View style={styles.modalContent}>
      
      {/* Progress Bar */}
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Header */}
      <View style={styles.modalHeader}>
        <TouchableOpacity onPress={() => setSelectedPost(null)}>
          <Ionicons name="close" size={28} color={COLORS.white} />
        </TouchableOpacity>

        {currentUser?._id === selectedPost?.userId && (
          <TouchableOpacity onPress={handleDelete} style={{ marginLeft: 12 }}>
            <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Story Image */}
      {selectedPost?.imageUrl && (
        <Image
          source={selectedPost.imageUrl}
          style={styles.postDetailImage}
          contentFit="cover"
          transition={200}
        />
      )}
    </View>
  </View>
</Modal>



    </View>
  );
}
