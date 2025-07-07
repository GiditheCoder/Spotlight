import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { Image } from 'expo-image'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/theme'
import { styles } from '@/styles/notifications.style'
import { formatDistanceToNow } from 'date-fns'


export default function NotificationItem({notification}: any) {
  return (
    <View style={styles.notificationItem}>
       <View style={styles.notificationContent}>

            {/*this is the link page  */}
            {/* fix this later */}
            {/* check if the fix isw roking  */}
            <Link href={`/user/${notification.sender._id}`} asChild>
  <TouchableOpacity style={styles.avatarContainer}>
    {/* this is the image side  */}
    <Image
    // noification image
      source={notification.sender.image}
      style={styles.avatar}
      contentFit="cover"
      transition={200}
    />
 {/* this is the icon */}
<View style={styles.iconBadge}>
  {notification.type === "like" ? (
    <Ionicons name="heart" size={14} color={COLORS.primary} />
  ) : notification.type === "follow" ? (
    <Ionicons name="person-add" size={14} color="#8B5CF6" />
  ) : (
    <Ionicons name="chatbubble" size={14} color="#3B82F6" />
  )}
</View>

 </TouchableOpacity>
</Link>


<View style={styles.notificationInfo}>


   {/* to fix the link issure */}
    <Link  href={`/notifications`}  asChild>
    <TouchableOpacity>
      <Text style={styles.username}> {notification.sender.username}</Text>
    </TouchableOpacity>
    </Link>

    {/* this is the text side and it would be conditional */}
         {/* fix the comment */}
         {/* there is n issue of the comment eing undefined*/}
    <Text style={styles.action}>
          {
            notification.type === "follow" ?
            "started following you " :
            notification.type === "like" ?
            "liked your posts" : `commented : "${notification?.comment}"`
          }
          {/* i fixed the issue on this  */}
    </Text>

    <Text style={styles.timeAgo}>
{formatDistanceToNow(notification._creationTime,{addSuffix: true})}
    </Text>

</View>
       </View>

  {/* this is for the image */}

{notification.post && (
  <Image 
    source={notification.post.imageUrl}
    style={styles.postImage}
    contentFit='cover'
     transition={200}
  />
)}

    </View>
  )
}