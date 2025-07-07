import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Image } from 'expo-image';
import React from 'react';
import { View } from 'react-native';
import { Id } from '@/convex/_generated/dataModel';

// change the stories Id
type StoryProps = {
  story: {
    _id: Id<"stories">;
    _creationTime: number;
    expiresAt: number;
    imageUrl: string;
    storageId: string;
    userId: string;
    author: {
      id: string;
      username: string;
      image: string;
    };
  };
};



const StoryCard: React.FC<StoryProps> = ({ story }) => {
  
  return (
    <View style={styles.postHeaderLeft}> 
      <Image
        source={{ uri: story.imageUrl }}
        style={styles.postAvatar}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
      <Text style={styles.postUsername}>{story.author.username}</Text>
    </View>
  );
};

export default StoryCard;

const styles = StyleSheet.create({
  postHeaderLeft: {
    alignItems: 'center',
    marginRight: 12,
  },
  postAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 6,
  },
  postUsername: {
    fontSize: 12,
    color: '#fff',
    textAlign: 'center',
  },
});
