import { View, Text } from 'react-native'
import React from 'react'
import { query } from './_generated/server'
import { getAunthenticatedUser } from './users'

export const getNotifications = query({

    
    handler : async(ctx)=>{
        const currentUser = await getAunthenticatedUser(ctx)

        const notifications = await ctx.db.query("notifications")
        .withIndex("by_receiver", (q)=> q.eq("receiverId" , currentUser._id))
        .order("desc")
        .collect()


        // the 3 key thing swe need would be the comment , semder and the post 
        const notificationsWithInfo = await Promise.all(
            notifications.map( async (notification)=>{
                 const sender = (await ctx.db.get(notification.senderId))!
                //  in this version of code the post and the coment is made to be null
                // we have to get the senderId and also the comment to add to it 
                 let post = null
                 let comment= null
                //  pass the if checks
                // get the notification post 
                // what about the likes, follow
                // post and comment
                
                 if(notification.postId){
                    post = await ctx.db.get(notification.postId)
                 }

                  if(notification.type === "comment" && notification.commentId){
                   comment = await ctx.db.get(notification.commentId)
                  }

                     return{
                        ...notification,
                        sender: {
                            _id : sender._id,
                            username : sender.username,
                            image: sender.image
                        },
                        post,
                        comment : comment?.content

                   }
            })
        )

        return notificationsWithInfo
    }
})